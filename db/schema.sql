-- drop and create a table for our empolyees
DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

-- select those employees db
USE employees

-- making a table for each of the req
CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(250) NOT NULL
);

-- this table is going to have 4 columns ID, title of the role,salary of that role and department ID  which will be referenced from the table departments
CREATE TABLE role(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary INT NOT NULL,
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

-- next is the employees table which will hold the ID, the first and last names, roleID, and manager ID, plus references to both tables roles and departments

CREATE TABLE staff(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES staff(id)
);