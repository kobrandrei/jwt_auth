require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const mysql = require('mysql2');
const colors = require('colors');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware')

// Colors
let red = colors.red;
let yellow = colors.yellow;
let cyan = colors.cyan;
let green = colors.green;
let magenta = colors.magenta;
let white = colors.white;

// Mysql Connection
const connection = process.env.db_activate == true ? mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.db_base
}) : null;

function watchDog() {
    try {
        console.log(yellow("[+] [WATCH_DOG]: Переподключение"))
        connection.query('SHOW TABLES', function(err, results, fields) {});
    } catch(err) {
        console.log(red('[-] [WATCH_DOG]: ' + err));
    }
}

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        // if (process.env.db_activate) {
        //     setInterval(watchDog, 1000 * 60 * 30); // Каждые 30 минут
        //     connection.connect(function(err) {
        //         if (err) {
        //             console.log(red('[-] [MYSQL]: ' + err));
        //             process.exit(1);
        //         } else console.log(cyan('[+] [MYSQL]: Успешное соединение с базой данных'));
        //     });
        // } else console.log(yellow('[+] [MYSQL]: Игнорирование подключения к БД'));

        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log(`Server start on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();