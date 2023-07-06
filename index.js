require('dotenv').config();
const questions = require('./questions.js');
const mysql = require('mysql2');
require('mysql2/promise');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

async function init() {
    const mainMenu = await inquirer.prompt(questions.menu);

    console.log(mainMenu);

    switch (mainMenu.menuChoice) {
        case 'View All Departments':
            viewDepts();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add A Department':
            addDept();
            break;
        case 'Add A Role':
            addRole();
            break;
        case 'Add An Employee':
            addEmployee();
            break;
        case 'Update An Employee Role':
            updateEmployee();
            break;
        default:
            console.log('Thank you');
    };
};

async function viewDepts() {
    await db.query("SELECT * FROM departments;", (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        };
    });
};

init();