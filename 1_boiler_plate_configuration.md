video link: https://courses.chaicode.com/learn/home/Web-Dev-Cohort/Web-Dev-Cohort-Live/section/596916/lesson/3726186

# Initial configurations

create a ```package.json```

    $ npm init

create entry point: ```index.js```

    import express from 'express';
    const app = express()
    const port = 3000

    app.get('/', (req, res) => {
    res.send('Hello World!')
    })

    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })

Now, install Express
    
    $ npm install express

install nodemon
    
    npm i -D nodemon

update file ```package.json``` file with

    { 
        "type": "module",
        "scripts": {
            "start": "nodemon index.js"
        },
    }

install dotenv

    npm install dotenv

Create ```.env``` file and set ```port = 3000```

    PORT = 3000

Again, update ```index.js``` file

    import dotenv from 'dotenv';
    dotenv.config();

    const port = process.env.PORT || 3000;


Now, configuration for ```Cors (Cross Origin Resource Sharing)```

**NOTE:** ```cors``` errro solve in backend side

install cors
    
    Npm i cors

Again, update ```index.js``` file

    import cors from 'cors';

    app.use(cors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    }));

telling express accept the ```json``` file and ```urlencoded``` data. 

Again, update ```index.js``` file

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


### Working with db (mongodb)

install mongoose

    npm i mongoose

#### create folder called ```utils``` and create file called ```db.js```

    import mongoose from 'mongoose';

    import dotenv from 'dotenv';
    dotenv.config();


    // export function that connects to the database

    const db = () => {
        mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to database");
        })
        .catch((err) => {
            console.log("Error in connecting to database", err);
        })
    }



export default db;

### ```.env``` from Mongodb atlas 
    MONGO_URI = mongodb+srv://:<password>@cluster0.l2nxz.mongodb.net/<app-name>

**mongodb+srv://** is a protocol. just like http, ftp, etc.

    BASE_URL = http://localhost:3000

Now, update ```index.js```

    app.use(cors({
        origin: process.env.BASE_URL,
    }));

Now, update ```utils/db.jd```

    import mongoose from 'mongoose';

    // for safty purpose, we are importing dotenv and configuring it
    import dotenv from 'dotenv';
    dotenv.config();


    // export function that connects to the database

    const db = () => {
        mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to database");
        })
        .catch((err) => {
            console.log("Error in connecting to database", err);
        })
    }

    export default db;


### connect database in ```index.js``` file using utils/db.js file
    // const express = require('express')
    import express from 'express';
    import dotenv from 'dotenv';
    import cors from 'cors';
    import db from './utils/db.js';    // sometime we need to add .js extension otherwise it will not work

    dotenv.config();

    const app = express()
    const port = process.env.PORT || 3000;

    app.use(cors({
        origin: [process.env.BASE_URL, 'http://localhost:3001'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
    res.send('Hello World!')
    })

    app.get('/tikaram', (req, res) => {
        res.send("Hello Tikaram")
    })

    // connect to the database
    db();

    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })


Run the program to check db connection: ```npm run start```




---
We completed the configuration. Next, we start project

#### This part has completed at 2:20 hr


Summary:
1. always install mongoose and express
2. need: cors, .env, nodemon


