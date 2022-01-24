const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// connects to MySQL Database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Moo222@",
    database: "company_roster"
});

// app initialization 
connection.connect(function (err) {
    if (err) throw err;
    console.log(`
    ██████╗       ██████╗  ██████╗ ███████╗████████╗███████╗██████╗                                                                   
    ██╔══██╗      ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗                                                                  
    ██████╔╝█████╗██████╔╝██║   ██║███████╗   ██║   █████╗  ██████╔╝                                                                  
    ██╔══██╗╚════╝██╔══██╗██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗                                                                  
    ██║  ██║      ██║  ██║╚██████╔╝███████║   ██║   ███████╗██║  ██║                                                                  
    ╚═╝  ╚═╝      ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝                                                                  
                                                                                                                                      
    ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
    ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
    █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗         ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝         ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
    ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗       ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
    ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`);
    init();
});

//Function to view all employees
function viewAllEmployees() {
    connection.query(
   `SELECT CONCAT(e.first_name," ",e.last_name) AS 'Employee Name', r.title AS 'Role', r.salary AS 'Salary', IFNULL(CONCAT(m.first_name," ",m.last_name),'N/A') AS 'Manager Name'
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    INNER JOIN role r ON r.id = e.role_id;`,
    (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
};

// Adds an employee
function addEmployee() {
  connection.query(`SELECT * FROM role;`, (err, data) => {
    if (err) throw err;
    const rolesArray = data.map((role) => {
      return { name: role.title, value: role.id };
    });
    
    connection.query(`SELECT * FROM employee;`, (err, data) => {
      if (err) throw err;
      const employeeArray = data.map((employee) => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id };
      });

      const noneOption = { name: "None", value: null };
      employeeArray.push(noneOption);

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
          },
          {
            type: "list",
            message: "Please select the employee's role",
            choices: rolesArray,
            name: "role"
          },
          {
            type: "list",
            message: "Please select the employee's manager",
            choices: employeeArray,
            name: "manager"
          }
        ])
        .then(({ firstName, lastName, role, manager }) => {
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
             VALUE (?, ?, ?,?);`,
            [firstName, lastName, role, manager],
            (err, data) => {
              if (err) throw err;
              console.log("Employee has been added!");
              init();
            }
          );
        });
    });
  });
};

// Update an employees' role
function updateEmployeeRole() {
  connection.query(`SELECT * FROM role;`, (err, data) => {
    if (err) throw err;
    const rolesArray = data.map((role) => {
      return { name: role.title, value: role.id };
    });

    connection.query(`SELECT * FROM employee;`, (err, data) => {
      if (err) throw err;
      const employeeArray = data.map((employee) => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id };
      });

      const noneOption = { name: "None", value: null };
      const managerArray = employeeArray.concat(noneOption);

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            name: "employee",
            choices: employeeArray
          },
          {
            type: "list",
            message: "Which role would you like to assign the employee?",
            name: "role",
            choices: rolesArray
          },
          {
            type: "list",
            message: "Please select the employee's new manager",
            choices: managerArray,
            name: "manager"
          }
        ])
        .then(({ employee, role, manager }) => {
          connection.query(
         `UPDATE employee
          SET role_id = ?, manager_id = ?
          WHERE id = ?;`, 
          [role, manager, employee], (err, data) => {
            if (err) throw err;
            console.log("Employee's role has been updated!");
            init();
          });
        });
    });
  });
};

// View all roles
function viewRoles() {
  connection.query(
 `SELECT r.id, r.title, r.salary, d.name as 'Department'
  FROM role r
  LEFT JOIN department d
      on r.department_id = d.id;`,
    (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
};

// Add a role
function addRole() {
  connection.query(`SELECT * FROM department;`, (err, data) => {
    if (err) throw err;
    const departmentsArray = data.map((department) => {
      return { name: department.name, value: department.id };
    });

    inquirer
      .prompt([
        {
          type: "input",
          message: "Please enter the role title:",
          name: "title",
        },
        {
          type: "input",
          message: "Please enter the role salary:",
          name: "salary",
        },
        {
          type: "list",
          choices: departmentsArray,
          message: "Please select a department:",
          name: "department_id"
        }
      ])
      .then(({ title, salary, department_id }) => {
        connection.query(
            `INSERT INTO role (title, salary, department_id)
            VALUE (?, ?, ?);`,
            [title, salary, department_id],
            (err, data) => {
                if (err) throw err;
                console.log("Your role has been created.");
                init();
            }
        );
      });
  });
};

// View all departments
function viewDepartments() {
  connection.query(`SELECT * FROM department;`, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  });
};

// Add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the name of the department.",
        name: "department"
      },
    ])
    .then(({ department }) => {
      connection.query(
        `INSERT INTO department (name)
         VALUE (?);`,
        [department], (err, data) => {
        if (err) throw err;
        console.log("Your department has been created.");
        init();
      });
    });
};

function quit() {
  console.log("Thank you for using R-Roster!");
  connection.end();
};

// Function to initialize app
function init() {
    inquirer
      .prompt([
        {
            type: "list",
            name: "userMenu",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee's Role & Manager", "View All Roles", "Add Role", "View All Departments", "Add Department", new inquirer.Separator(), "Quit", new inquirer.Separator()]
        }
      ])
      // Switches to function based on user selection
      .then(({ userMenu }) => {
        switch (userMenu) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee's Role & Manager":
                updateEmployeeRole()
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            default:
                quit();
        };
    });
};
