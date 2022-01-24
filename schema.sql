CREATE TABLE `department` (
  `id` INT PRIMARY KEY,
  `name` VARCHAR(30),
);

CREATE TABLE `role` (
  `id` INT PRIMARY KEY,
  `title` VARCHAR(30),
  `salary` DECIMAL(10,2),
  `department_id` INT
);

CREATE TABLE `employee` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(30),
  `last_name` VARCHAR(30),
  `role_id` INT,
  `manager_id` INT
);

ALTER TABLE `role` ADD FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);

ALTER TABLE `employee` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

ALTER TABLE `employee` ADD FOREIGN KEY (`manager_id`) REFERENCES `employee` (`id`);
