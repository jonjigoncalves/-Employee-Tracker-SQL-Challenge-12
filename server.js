const db = require('./config/connection');
const { prompt } = require('inquirer');
const { printTable } = require('console-table-printer');


const mainMenu = () => {
    prompt({
        type: "list",
        name: 'query',
        message: 'Select Your Query from the List',
        choices: ['view departments', 'view roles', 'view staff', 'add a department', 'add a role', 'add an employee', 'update an employee role']
    }).then(({ query }) => {
        switch (query) {
            case 'view departments':
                viewDepartments();
                break;
            case 'view roles':
                viewRoles();
                break;
            case 'view staff':
                viewStaff();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update an employee role':
                updateEmployeeRole();
                break;
            default:
                break;
        }
    });
};

const viewDepartments = () => {
    db.promise().query('SELECT department_name AS Department FROM department').then(([departmentData]) => {
        printTable(departmentData);
        mainMenu();
    });
};

const viewRoles = () => {
    db.promise().query('SELECT title, salary, department_id FROM role LEFT JOIN department ON role.department_id = department.id').then(([roleData]) => {
        printTable(roleData);
        mainMenu();
    });
};

const viewStaff = () => {
    db.promise().query('SELECT staff.id AS Id, CONCAT(staff.first_name," ", staff.last_name) AS Name, role.title AS Title, role.salary AS Salary, department.department_name AS Department FROM staff LEFT JOIN role on staff.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN staff manager on manager.id = staff.manager_id;').then(([staffData]) => {
        printTable(staffData);
        mainMenu();
    });
};

const addDepartment = () => {
    prompt({
        type: "input",
        name: "departmentName",
        message: "Name of the department:",
    }).then(({ departmentName }) => {
        db.promise()
            .query('INSERT INTO department (department_name) VALUES (?)', [departmentName])
            .then(() => {
                console.log("Department added successfully!");
                mainMenu();
            })
            .catch((err) => {
                console.error("Error adding department:", err);
                mainMenu();
            });
    });
};

const addRole = async () => {
    try {
        const [departments] = await db.promise().query('SELECT * FROM department');

        const { roleTitle, roleSalary, departmentId } = await prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "Name of the role:",
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Salary for the role:",
            },
            {
                type: "list",
                name: "departmentId",
                message: "Department for the role:",
                choices: departments.map((department) => ({
                    name: department.department_name,
                    value: department.id,
                })),
            },
        ]);

        await db.promise()
            .query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleTitle, roleSalary, departmentId]);

        console.log(`Role "${roleTitle}" added successfully!`);
        mainMenu();
    } catch (err) {
        console.error("Error adding role:", err);
        mainMenu();
    }
};

const addEmployee = () => {
    db.promise()
        .query('SELECT * FROM role')
        .then(([roles]) => {
            db.promise()
                .query('SELECT * FROM staff')
                .then(([employees]) => {
                    prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Type employee's first name:",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Type employee's last name:",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Employee's role?",
                            choices: roles.map((role) => ({
                                name: role.title,
                                value: role.id,
                            })),
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Choose the employee's manager:",
                            choices: employees.map((employee) => ({
                                name: `${employee.first_name} ${employee.last_name}`,
                                value: employee.id,
                            })),
                        },
                    ]).then(({ firstName, lastName, roleId, managerId }) => {
                        db.promise()
                            .query('INSERT INTO staff (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId])
                            .then(() => {
                                console.log("Employee added successfully!");
                                mainMenu();
                            })
                            .catch((err) => {
                                console.error("Error adding employee:", err);
                                mainMenu();
                            });
                    });
                });
        });
};

const updateEmployeeRole = () => {
    db.promise()
        .query('SELECT * FROM staff')
        .then(([employees]) => {
            db.promise()
                .query('SELECT * FROM role')
                .then(([roles]) => {
                    prompt([
                        {
                            type: "list",
                            name: "employeeId",
                            message: "Which employee is being updated?",
                            choices: employees.map((employee) => ({
                                name: `${employee.first_name} ${employee.last_name}`,
                                value: employee.id,
                            })),
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Select new role:",
                            choices: roles.map((role) => ({
                                name: role.title,
                                value: role.id,
                            })),
                        },
                    ]).then(({ employeeId, roleId }) => {
                        db.promise()
                            .query('UPDATE staff SET role_id = ? WHERE id = ?', [roleId, employeeId])
                            .then(() => {
                                console.log("Employee Updated");
                                mainMenu();
                            })
                            .catch((err) => {
                                console.error("Error updating employee role:", err);
                                mainMenu();
                            });
                    });
                });
        });
};

mainMenu();
