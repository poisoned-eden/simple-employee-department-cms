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

// Get from the db
async function getDepts() {
    try {
        const depts = await db.promise().query("SELECT * FROM departments;");
        return depts[0];
    } catch (error) {
        console.error(error);
    };
};

async function getRoles() {
    try {
        const roles = await db.promise().query("SELECT * FROM roles;");
        return roles[0];
    } catch (error) {
        console.error(error);
    };
};

async function getEmployees() {
    try {
        const emps = await db.promise().query("SELECT * FROM employees;");
        return emps[0];
    } catch (error) {
        console.error(error);
    };
};


// View results
async function viewDepts() {
    console.table( await getDepts());
    viewMenu();
};

async function viewRoles() {
    console.table(await getRoles());
    viewMenu();
};

async function viewEmployees() {
    console.table(await getEmployees());
    viewMenu();
};


// Add to db
async function addDept() {
    try {
        const newDept = await inquirer.prompt(questions.addDeptQ);
    
        const dbAddRow = await db.promise().execute("INSERT INTO departments (department_name) VALUES (?)", [newDept.deptName]);

        const dbNewRow = await db.promise().execute("SELECT * FROM departments WHERE id = ?;", [dbAddRow[0].insertId]);

        console.log('Added to departments:');
        console.table(dbNewRow[0]);
        
        viewMenu();
    } catch (error) {
        console.error(error);
    };
};

async function addRole() {
    try {
        getDepts().forEach((department) => {
                questions.addRoleQ[2].choices.push({
                    name: department.department_name,
                    value: department.id,
                });
            });

        const newRole = await inquirer.prompt(questions.addRoleQ);

        console.log(newRole);

        const dbAddRow = await db.promise().execute("INSERT INTO roles SET role_title = ?, salary = ?, department_id = ?;", [newRole.roleTitle, newRole.roleSalary, newRole.roleDept]);

        const dbNewRow = await db.promise().execute("SELECT * FROM roles WHERE id = ?;", [dbAddRow[0].insertId]);

        console.log('Added to roles:');
        console.table(dbNewRow[0]);
        
        viewMenu();
    } catch (error) {
        console.error(error);
    };
};

async function addEmployee() {

    try {
        const roleList = await getRoles();
        roleList.forEach((role) => {
            questions.addEmployeeQ[2].choices.push({
                name: role.role_title,
                value: role.id,
            });
        });

        const employeesList = await getEmployees();
        employeesList.forEach((employee) => {
            questions.addEmployeeQ[3].choices.push({
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
            });
        });

        const newEmployee = await inquirer.prompt(questions.addEmployeeQ);
        console.log(newEmployee);

        const dbAddRow = await db.promise().execute("INSERT INTO employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?;", [newEmployee.firstName, newEmployee.lastName, newEmployee.employeeRole, newEmployee.employeeManager]);

        const dbNewRow = await db.promise().execute("SELECT * FROM employees WHERE id = ?;", [dbAddRow[0].insertId]);

        console.log('Added to employees:');
        console.table(dbNewRow[0]);

        viewMenu();
    } catch (error) {
        console.error(error);
    };
};

async function updateEmployee() {
    
    try {
        const employeesList = await getEmployees();
        employeesList[0].forEach((employee) => {
            questions.updateEmployeeQ[0].choices.push({
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id,
                });
        });
        
        const roleList = await getRoles();
        roleList[0].forEach((role) => {
            questions.updateEmployeeQ[1].choices.push({
                name: role.role_title,
                value: role.id,
            });
        });

        const updateEmployee = await inquirer.prompt(questions.updateEmployeeQ);

        const dbAddRow = await db.promise().execute("UPDATE employees SET role_id = ? WHERE id = ?;", [updateEmployee.updatedRole, updateEmployee.employeeToUpdate]);

        const dbNewRow = await db.promise().execute("SELECT * FROM employees WHERE id = ?;", [dbAddRow[0].insertId]);

        console.log('Updated employee:');
        console.table(dbNewRow[0]);

        viewMenu();

    } catch (error) {
        console.error(error);
    };
};

viewMenu();