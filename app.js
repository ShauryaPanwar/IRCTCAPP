const pool = require('./config/databasepg');
const express = require("express");
const app = express();

const PORT = 4000;
const adminApiKey = "test";
function apiKeyVerification(req,res,next)
{
    const apiKey = req.headers['api-key'];
    console.log("api "+apiKey);
    if(!apiKey || apiKey!==adminApiKey)
    {
        return res.status(401).json({error:'Unauthorised Admin'})
    }
    next();
}
app.use("/admin",apiKeyVerification);

app.set("view engine", "ejs");
//MiddleWare
app.use(express.urlencoded({extended : false}));
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/users/register", (req, res) => {
    res.render("register");
});

app.get("/users/login", (req, res) => {
    res.render("login");
});

app.get("/users/dashboard", (req, res) => {
    res.render("dashboard" , {user : req.query.username});
});

app.get("/admin/dashboard", (req, res) => {
    res.render("admindashboard");
});
app.get("/users/checkpnr", (req, res) => {
    res.render("checkpnr");
});

app.post("/trains/add", (req, res) => {
    const {trainNumber, trainName, source, destination, arrivalTime, departureTime, duration, price} =
    req.body;
    pool.query(`INSERT INTO train(trainno, trainname, source, destination, arrival, departure, duration, price, available) VALUES('${trainNumber}', '${trainName}', '${source}', '${destination}', '${arrivalTime}', '${departureTime}', '${duration}','${price}','100')`, (err, result) => {
        if(err){
            console.log(err)
            res.send("Train Already Exist");
            return;
        }
        res.redirect("/admin/dashboard");
    });
});

app.get("/trains", (req, res) => {
    pool.query(`SELECT * FROM train`, (err, result) => {
        if(err){
            res.send("No Trains Available");
            return;
        }
        console.log(result.rows);
        res.send( {trains : result.rows});
    });
});
app.get("/pnrdetails", (req, res) => {
    const {pnr} = req.query;
    let pnrId = convertToId(pnr);
    pool.query(`SELECT * FROM bookings where pnrid=${pnrId}`, (err, result) => {
        if(err){
            res.send({});
            return;
        }
        res.send({details : result.rows});
    });
});



app.post("/users/register", (req, res) => {
    const {username, password,password2,role,adminCode} = req.body;
    if(password !== password2){
        res.send("Password do not match");
        return;
    }
    if(role==="admin" && adminCode !== "admin123"){
        res.send("Invalid Admin Code");
        return;
    }
    
    pool.query(`INSERT INTO users(username, password, role) VALUES('${username}', '${password}', '${role}')`, (err, result) => {
        if(err){
            res.send("User Already Exist");
            return;
        }
        if(role === "admin"){
            res.redirect("/admin/dashboard");
            return;
        }
        res.redirect("/users/dashboard");
    });

});


app.post("/users/login", (req, res) => {
    const {username, password} = req.body;
    pool.query(`SELECT role FROM users WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
        if(err){
            res.send("Invalid Credentials");
            return;
        }
        if(result.rows.length === 0){
            res.send("Invalid Credentials");
            return;
        }
        if(result.rows[0].role === "admin"){
            res.redirect("/admin/dashboard");
            return;
        }
        res.redirect("/users/dashboard?username="+username);
    });
});

app.get("/trains/search", (req, res) => {
    const {source, destination} = req.query;
    pool.query(`SELECT * FROM train WHERE source = '${source}' AND destination = '${destination}' AND available>0 order by trainno`, (err, result) => {
        if(err){
            res.send({});
            return;
        }
        res.send({trains : result.rows});
    });
});

app.post("/trains/book", (req, res) => {
    let pnr="0";
    let today = new Date();
    const {trainno, username,ticketnumber} = req
    .body;
    console.log(trainno+username+ticketnumber)
    try {
        (async() =>{ 
            pool.query(`SELECT * FROM train WHERE trainno = '${trainno}'`,(err , result) =>{
                if(err){
                    res.send("train not found");
                    return
                }else{
                    if(result.rows.length === 0){
                        res.send("Train Not Found");
                        return;
                    }
                    pool.end;

                    pool.query(`INSERT INTO bookings(user_id,train_id,booked_seats,datecreated) values('${username}','${trainno}',${ticketnumber},'${today.toString()}')`, (err1 , res1) => {

                        if(err1){
                            return;
                        }
                        pool.query(`SELECT * from bookings where train_id='${trainno}' and user_id='${username}' and booked_seats=${ticketnumber}` , (err2 , result2) =>{
                            if(!err2){
                                pool.end;
                                pnr=result2.rows[0].pnrid;
                                pnr = convertToPNR(pnr);
                                pool.query(`UPDATE train SET available = available - 1 WHERE trainno = '${trainno}'` , (err3 ,resukt3) => {
                                    if(!err3){
                                        pool.end;
                                        res.send("Train Booked Successfully, PNR = '"+pnr+"'<br><a href='/users/dashboard?username="+username+"'>Go Back</a>");
                                    }
                                });
                            }
                        });
                        
                    } );

                    pool.end;
                }
            } );
            
        })();
    } catch (error) {
        if(error){
            res.send("train not found");
            return
        }
    }

   

    // try {
    //     (async() =>{ 
    //         await pool.query(`INSERT INTO bookings(user_id,train_id,booked_seats,datecreated) values('${username}','${trainno}',${ticketnumber},'${today.toString()}')` );
    //         pool.end;
    //     })();
    // } catch (error) {
    //     if(error){
    //         res.send("booking not entered");
    //         return
    //     }
    // }
    
    // try {
    //     (async() =>{ 
    //         let datares = await pool.query(`SELECT * from bookings where train_id='${trainno}' and user_id='${username}' and booked_seats=${ticketnumber}`);
    //         pool.end;
    //         console.log(datares.rows);
    //         pnr=datares.rows[0].pnrid;
    //     })();
    // } catch (error) {
    //     if(error){
    //         res.send("booking not found");
    //         return
    //     }
    // }
   console.log("pnr "+pnr);


//    try {
//     (async() =>{ 
//         await pool.query(`UPDATE train SET available = available - 1 WHERE trainno = '${trainno}'`);
//         pool.end;
//         res.send("Train Booked Successfully, PNR = '"+pnr+"'<br><a href='/users/dashboard?username="+username+"'>Go Back</a>");
//     })();
//     } catch (error) {
//     if(error){
//         res.send("Aviaval not Updated");
//         return
//     }
        //}
    // pool.query(`UPDATE train SET available = available - 1 WHERE trainno = '${trainno}'`, (err, result) => {
    //     if(err){
    //         res.send("Train Not Found");
    //         return;
    //     }
    //     res.send("Train Booked Successfully, PNR = '"+pnr+"'<br><a href='/users/dashboard?username="+username+"'>Go Back</a>");
    // });
    
}
);

function convertToId(pnr){
    return parseInt(pnr.substring(5));
}

function convertToPNR(pnr){
    let baseString = "ABXYZ";
    if(pnr<10)
    {
        baseString += "00";
    }
    else if(pnr<100)
    {
        baseString += "0"
    }
    baseString+=pnr.toString();
    return baseString;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






