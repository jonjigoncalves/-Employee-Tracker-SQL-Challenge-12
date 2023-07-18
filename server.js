
const db = require('./config/connection');
const { prompt } = require('inquirer');
const {printTable} = require('console-table-printer');

const mainMenu = () => {
    prompt({
        type: "list",
        name: 'query',
        message: 'Select Your Query from the List',
        choices: ['view departments', 'view roles', 'view staff']
    }).then(({ query }) => {
        switch (query) {
            case 'view departments':
                viewDepartments()
                break;
            case 'view roles':
                viewRoles()
                break;
            case 'view staff':
                viewStaff()
                break;

            default:
                break;
        }
    })
} 
const viewDepartments = ()=>{
    db.promise().query('SELECT department_name AS Department FROM department').then(([departmentData]) =>{
        printTable(departmentData);
        mainMenu();
    })
};

const viewRoles = ()=>{
    db.promise().query('SELECT title, salary, department_id FROM role LEFT JOIN department ON role.department_id = department.id').then(([roleData]) =>{
        printTable(roleData);
        mainMenu();
       
    })
};

const viewStaff = ()=>{
    db.promise().query('SELECT staff.id AS Id, CONCAT(staff.first_name," ", staff.last_name) AS Name, role.title AS Title, role.salary AS Salary, department.department_name AS Department FROM staff LEFT JOIN role on staff.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN staff manager on manager.id = staff.manager_id;').then(([staffData]) =>{
        printTable(staffData);
        mainMenu();
    })
};

mainMenu();