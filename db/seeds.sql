INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'), 
  ('Legal'),
  ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 100000, 1),
  ('Saleperson', 80000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Lawyer', 150000, 3),
  ('Accountant', 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doeber', 1, NULL),
  ('Mike', 'Jones', 2, 1),
  ('Mike', 'Hawk', 2, 1),
  ('Linda', 'Nyguen', 5, NULL),
  ('Sam', 'Smith', 3, NULL),
  ('Axel', 'Daisy', 4, 5);
  