USE employees;

-- make up departments for the employees with Insert INTO

INSERT INTO departments(name)
VALUES ('Finance'),
       ('Marketing'),
       ('Human Resources'),
       ('Sales'),
       ('Accounting'),
       ('Engineering');

-- make up roles  and salaries for those roles  and a department id number
INSERT INTO roles (title, salary, department_id)
VALUES ('Finance Manager', 85000, 1),
       ('Marketing Specialist', 65000, 2),
       ('HR Consultant', 40000, 3),
       ('Sales Representative', 55000, 4),
       ('Accountant', 60000, 5),
       ('Software Engineer', 75000, 6);

-- make names for the staff and assign them a role id and a manager id
INSERT INTO staff (first_name, last_name, role_id, manager_id)
VALUES ('Jonathan', 'Goncalves', 1, 1),
       ('Cristiano', 'Ronaldo', 2, 1),
       ('Neymar', 'Junior', 3, 1),
       ('Kylian', 'Mbappe', 4, NULL),
       ('Karim', 'Benzema', 5, 1),
       ('Erling', 'Haaland', 6, 1);   