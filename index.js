const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Moo222@",
    database: "company_roster",
});

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

// Function to initialize app
function init() {
    inquirer
      .prompt([
        {
            type: "list",
            name: "userMenu",
            message: "What would you like to do?",
            choices: ["View All Employees","Add Employee","View All Roles","Add Role","View All Departments","Add Department","Quit"]
        }
      ])
      // Switches to function based on user selection
      .then(({ userMenu }) => {
        switch (userMenu) {
            case "View All Employees":
                viewAllEmployees();
                break;
            default:
                init();
        }
      });
};
