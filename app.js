const pool = require('./config/databasepg');
const express = require("express");
const app = express();

const PORT = 4000;


const adminRoutes = require('./Routes/adminRoutes');
const userRoutes = require('./Routes/userRoutes');

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
    res.render("dashboard" , {user : "Shaur"});
});

app.get("/admin/dashboard", (req, res) => {
    res.render("admindashboard");
});

app.post("/trains/add", (req, res) => {
    const {trainNumber, trainName, source, destination, arrivalTime, departureTime, duration, price} =
    req.body;
    pool.query(`INSERT INTO train(trainno, trainname, source, destination, arrival, departure, duration, price) VALUES('${trainNumber}', '${trainName}', '${source}', '${destination}', '${arrivalTime}', '${departureTime}', '${duration}','${price}')`, (err, result) => {
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
        res.redirect("/users/dashboard");
    });
});

app.get("/trains/search", (req, res) => {
    const {source, destination} = req.query;
    pool.query(`SELECT * FROM train WHERE source = '${source}' AND destination = '${destination}'`, (err, result) => {
        if(err){
            res.send({});
            return;
        }
        res.send({trains : result.rows});
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






