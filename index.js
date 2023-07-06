require('dotenv').config();
const questions = require('./questions.js');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect();

async function init() {
    const mainMenu = await inquirer.prompt(questions.menu);
};

init();