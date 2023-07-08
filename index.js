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
};

async function viewDepts() {
    getDepts().then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

async function getRoles() {
    return db.promise().query("SELECT * FROM roles;");
};

async function viewRoles() {
    getRoles().then( ([rows, fields]) => {
            console.table(rows);
            viewMenu();
        })
        .catch(console.log);
};

async function getEmployees() {
    return db.promise().query("SELECT * FROM employees;");
};

async function viewEmployees() {
    getEmployees().then(([rows, fields]) => {
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

    viewMenu();
};

async function addRole() {
    getDepts().then(([rows, fields]) => {
        rows.forEach((department) => {
            questions.addRoleQ[2].choices.push({
                name: department.department_name,
                value: department.id,
            });
        })
    });

    const newRole = await inquirer.prompt(questions.addRoleQ);

    console.log(newRole);

    db.promise().execute("INSERT INTO roles SET role_title = ?, salary = ?, department_id = ?;", [newRole.roleTitle, newRole.roleSalary, newRole.roleDept])
        .then( () => {
            console.log(`New Role Added.\nTitle: ${newRole.roleTitle}\nSalary: ${newRole.roleSalary}\nDepartment Number: ${newRole.roleDept}`);
            viewMenu();
        })
        .catch((err) => console.error(err));
};

async function addEmployee() {
    getRoles().then(([rows, fields]) => {
        rows.forEach((role) => {
            questions.addEmployeeQ[2].choices.push({
                name: role.role_title,
                value: role.id,
            });
        })
    });

    getEmployees().then(([rows, fields]) => {
        rows.forEach((employee) => {
            questions.addEmployeeQ[3].choices.push({
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
            });
        })
    });

    const newEmployee = await inquirer.prompt(questions.addEmployeeQ);

    console.log(newEmployee);

    db.promise().execute("INSERT INTO employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?;", [newEmployee.firstName, newEmployee.lastName, newEmployee.employeeRole, newEmployee.employeeManager])
        .then( () => {
            console.log(`New Employee Added.\nName: ${newEmployee.firstName} ${newEmployee.lastName}\nRole ID: ${newEmployee.employeeRole}\nManager ID: ${newEmployee.employeeManager}`);
            viewMenu();
        })
        .catch((err) => console.error(err));
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
        
        const employeeIndex = questions.updateEmployeeQ[0].choices.findIndex((emp) => emp.value == updateEmployee.employeeToUpdate);
        const saveName = questions.updateEmployeeQ[0].choices[employeeIndex].name;

        const roleIndex = questions.updateEmployeeQ[1].choices.findIndex((emp) => emp.value == updateEmployee.updatedRole);
        const saveRole = questions.updateEmployeeQ[0].choices[roleIndex].name;



        db.promise().execute("UPDATE employees SET role_id = ? WHERE id = ?;", [updateEmployee.updatedRole, updateEmployee.employeeToUpdate]);

        console.log(`Employee updated.\n${saveName}'s role changed to ${saveRole}`);

        viewMenu();

    } catch (error) {
        console.error(error);
    };
};

function pushListItems(questionSet, index, [rows, fields]) {

}

viewMenu();