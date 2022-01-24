const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// connects to MySQL Database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Moo222@",
    database: "company_roster",
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
            name: "firstName",
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName",
          },
          {
            type: "list",
            message: "Please select the employee's role",
            choices: rolesArray,
            name: "role",
          },
          {
            type: "list",
            message: "Please select the employee's manager",
            choices: employeeArray,
            name: "manager",
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
            choices: employeeArray,
          },
          {
            type: "list",
            message: "Which role would you like to assign the employee?",
            name: "role",
            choices: rolesArray,
          },
          {
            type: "list",
            message: "Please select the employee's new manager",
            choices: managerArray,
            name: "manager",
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

// Function to initialize app
function init() {
    inquirer
      .prompt([
        {
            type: "list",
            name: "userMenu",
            message: "What would you like to do?",
            choices: ["View All Employees","Add Employee", "Update Employee Role", "View All Roles","Add Role","View All Departments","Add Department","Quit"]
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
            case "Update Employee Role":
                updateEmployeeRole()
                break;
            default:
                init();
        }
      });
};
