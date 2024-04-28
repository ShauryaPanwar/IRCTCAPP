
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




## Screenshots

![Image](![image](https://github.com/ShauryaPanwar/IRCTCAPP/assets/74058434/7845d6a9-d55f-45b1-8d2f-1eba22dbc18a))


![Image]([https://i.ibb.co/4WKNXkT/affair.png](https://github.com/ShauryaPanwar/IRCTCAPP/assets/74058434/4ab6af12-6a7f-4df4-8443-2ce679498964))



## Deployment

To deploy this project run

```bash
  npm run dev
```
https://valhein-shaurya.onrender.com


## Documentation

[Documentation](https://linktodocumentation)

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

![App Screenshot](https://github.com/ShauryaPanwar/IRCTCAPP/assets/74058434/e66dc921-b2a0-471a-aff5-3d66911fba4d)


Above is the setup for Db used inside config folder in file develpoment.env to set environment variables.

    
## Authors

- [@ShauryaPanwar](https://github.com/ShauryaPanwar)




