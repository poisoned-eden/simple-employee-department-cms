const menu = [
    {
        type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role',
            'Quit'
        ],
    },
];

const addDeptQ = [
    {
        type: 'input',
        name: 'deptName',
        message: 'Enter the name of the department',
    },
];

const addRoleQ = [
    {
        type: 'input',
        name: 'roleTitle',
        message: 'Enter the role title'
    },
    {
        type: 'number',
        name: 'roleSalary',
        message: 'Enter the salary for the role'
    },
    {
        type: 'list',
        name: 'roleDept',
        message: 'Choose the department for the role',
        choices: [],
    },
];

const addEmployeeQ = [
    {
        type: 'input',
        name: 'firstName',
        message: 'Enter the employees first name'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'Enter the employees last name'
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: 'Choose the employees role',
        choices: [],
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: 'Choose the employees manager',
        choices: [],
    },
];

module.exports = {menu, addDeptQ, addRoleQ, addEmployeeQ};