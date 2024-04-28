
## Create Table Queries

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);

CREATE TABLE train (
    trainno VARCHAR(255) PRIMARY KEY,
    trainname VARCHAR(255),
    source VARCHAR(255),
    destination VARCHAR(255),
    arrival TIME,
    departure TIME,
    duration INT,
    price FLOAT,
    available INT
);

CREATE TABLE bookings (
    pnrid SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(username),
    train_id INT REFERENCES trains(trainno),
    booked_seats INT NOT NULL,
    datecreated VARCHAR(255)
);


## Table ERD


![image](https://github.com/ShauryaPanwar/IRCTCAPP/assets/74058434/51095018-9e4b-47a0-a4d5-071dc493507c)


## Deployment

To deploy this project run

```bash
  npm run dev
```


## Documentation

To run the project one have to install following dependencies: 
- Node Js
- express
- pg
- nodemon
- ejs
- dotenv


must be familiar with npm (node package manager).
ejs is being used as view engine

## Installation

Build command is

```bash
  npm install
```
    
    
##DB Setup

![image](https://github.com/ShauryaPanwar/IRCTCAPP/assets/74058434/05387fa3-8e36-43c3-902a-5dddccfbb3ea)



Above is the setup for Db used inside config folder in file develpoment.env to set environment variables.

    
## Authors

- [@ShauryaPanwar](https://github.com/ShauryaPanwar)


##Features 

- Register and Login for User and Admin Roles
- Admin Role need special code "admin123"
- Server runs on localhost:4000
- Navigate to LoginPage then go to Register If firsttime User else enter your credentials
- if Admin Enter Admin Credentials
- Once In user Dashboard one can search for trains using train search book tickets right there.
- Receiving a PNR Number which we can later enter back into check PNR Detail page on Login Page to get PNR Details.
- If In admin DashBoard one can Add trains avialable.




