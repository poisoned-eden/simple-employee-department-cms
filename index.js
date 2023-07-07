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

async function viewMenu() {
    const mainMenu = await inquirer.prompt(questions.menu);

    console.log(mainMenu.menuChoice);

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
            console.log('Thank you for using Simple Employee Department CMS');
            db.end();
    };
};

async function getDepts() {
    return db.promise().query("SELECT * FROM departments;");
}

async function viewDepts() {
    db.promise().query("SELECT * FROM departments;")
        .then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

async function viewRoles() {
    db.promise().query("SELECT * FROM roles;")
        .then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

async function viewEmployees() {
    db.promise().query("SELECT * FROM employees;")
        .then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

async function addDept() { 
    const newDept = await inquirer.prompt(questions.addDeptQ);

    db.promise().execute("INSERT INTO departments (department_name) VALUES (?)", [newDept.deptName])
        .then(console.log(newDept.deptName + ' added to departments'))
        .catch((err) => console.error(err));
};

async function addRole() {
    // get departments

    // push departments into addRoleQ.roleDept


    
    const newRole = await inquirer.prompt(questions.addRoleQ);

    db.promise().execute("INSERT INTO departments (department_name) VALUES (?)", [newDept.deptName])
        .then(console.log(newDept.deptName + ' added to departments'))
        .catch((err) => console.error(err));
};

async function addEmployee() {
    db.promise().query("SELECT * FROM departments;")
        .then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

async function updateEmployee() {
    db.promise().query("SELECT * FROM departments;")
        .then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

viewMenu();