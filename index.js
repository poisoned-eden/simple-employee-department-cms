require('dotenv').config();
const questions = require('./questions.js');
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

async function init() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    
    db.connect( (error) => {
        if (error) {
            console.error(error);
        };
    });

    async function menuLoop () {
        var menuChoice = "";
        
        do {
            menuChoice = await viewMenu();
            await enactChoice(menuChoice);
            console.log('------');
        } while (menuChoice != 'Quit');
    };

    async function viewMenu() {
        try {
            const mainMenu = await inquirer.prompt(questions.menu);
            return mainMenu.menuChoice;
        } catch (error) {
            console.error(error);
        }
    };
    
    async function enactChoice (menuChoice) {
        switch (menuChoice) {
            case 'View All Departments':
                await viewDepts();
                break;
            case 'View All Roles':
                await viewRoles();
                break;
            case 'View All Employees':
                await viewEmployees();
                break;
            case 'Add A Department':
                await addDept();
                break;
            case 'Add A Role':
                await addRole();
                break;
            case 'Add An Employee':
                await addEmployee();
                break;
            case 'Update An Employee Role':
                await updateEmployee();
                break;
            default:
                return quit();
        };
    };

    async function quit() {
        console.log('Thank you for using Simple Employee Department CMS');
        await db.end();
    };

    // Get from the db
    async function getDepts(id) {
        if (id === undefined) {
            id = '%';
        };
    
        try {
            const depts = await db.execute(`SELECT * FROM departments WHERE id LIKE ?;`, [id]);
            return depts[0];
        } catch (error) {
            console.error(error);
        };
    };
    
    async function getRoles(id) {
        if (id === undefined) {
            id = '%';
        };
         
        try {
            const roles = await db.execute(`
                SELECT 
                    roles.id, 
                    roles.role_title, 
                    roles.salary, 
                    departments.department_name 
                FROM roles 
                LEFT JOIN departments ON departments.id = roles.department_id
                WHERE roles.id LIKE ?;`, [id]);
            return roles[0];
        } catch (error) {
            console.error(error);
        };
    };
    
    async function getEmployees(id) {
        if (id === undefined) {
            id = '%';
        };
         
        try {
            const emps = await db.execute(`
                SELECT
                    employees.id, 
                    employees.first_name, 
                    employees.last_name,
                    departments.department_name, 
                    roles.role_title, 
                    roles.salary, 
                    CONCAT(managers.first_name,' ', managers.last_name) AS manager
                FROM employee_db.employees 
                LEFT JOIN 
                    employees AS managers ON employees.manager_id = managers.id
                LEFT JOIN 
                    roles ON roles.id = employees.role_id
                LEFT JOIN 
                    departments ON departments.id = roles.department_id
                WHERE employees.id LIKE ?;`, [id]);
            return emps[0];
        } catch (error) {
            console.error(error);
        };
    };
    
    
    // View results
    async function viewDepts(id) {
        try {
            console.table(await getDepts(id));
        } catch (error) {
            console.error(error);
        }
    };
    
    async function viewRoles(id) {
        try {
            console.table(await getRoles(id));
        } catch (error) {
            console.error(error);
        }
    };
    
    async function viewEmployees(id) {
        try {
            console.table(await getEmployees(id));
        } catch (error) {
            console.error(error);
        }
    };
    
    
    // Add to db
    async function addDept() {
        try {
            const newDept = await inquirer.prompt(questions.addDeptQ);
        
            const dbAddRow = await db.execute("INSERT INTO departments (department_name) VALUES (?)", [newDept.deptName]);
    
            console.log('\nAdded to departments:');
            await viewDepts(dbAddRow[0].insertId);
        } catch (error) {
            console.error(error);
        };
    };
    
    async function addRole() {
        try {
            const deptList = await getDepts();
            deptList.forEach((department) => {
                    questions.addRoleQ[2].choices.push({
                        name: department.department_name,
                        value: department.id,
                    });
                });
    
            const newRole = await inquirer.prompt(questions.addRoleQ);
    
            const dbAddRow = await db.execute("INSERT INTO roles SET role_title = ?, salary = ?, department_id = ?;", [newRole.roleTitle, newRole.roleSalary, newRole.roleDept]);
    
            console.log('\nAdded to roles:');
            await viewRoles(dbAddRow[0].insertId);
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
    
            const dbAddRow = await db.execute("INSERT INTO employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?;", [newEmployee.firstName, newEmployee.lastName, newEmployee.employeeRole, newEmployee.employeeManager]);
    
            console.log('\nAdded to employees:');
            await viewEmployees(dbAddRow[0].insertId);
        } catch (error) {
            console.error(error);
        };
    };
    
    async function updateEmployee() {
        
        try {
            const employeesList = await getEmployees();
            employeesList.forEach((employee) => {
                questions.updateEmployeeQ[0].choices.push({
                        name: employee.first_name + ' ' + employee.last_name,
                        value: employee.id,
                    });
            });
            
            const roleList = await getRoles();
            roleList.forEach((role) => {
                questions.updateEmployeeQ[1].choices.push({
                    name: role.role_title,
                    value: role.id,
                });
            });
    
            const updateEmployee = await inquirer.prompt(questions.updateEmployeeQ);
            await db.execute("UPDATE employees SET role_id = ? WHERE id = ?;", [updateEmployee.updatedRole, updateEmployee.employeeToUpdate]);
            console.log('\nUpdated employee:');
            await viewEmployees(updateEmployee.employeeToUpdate);
    
        } catch (error) {
            console.error(error);
        };
    };
    
    menuLoop();
};

init();