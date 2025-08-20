-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.3.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for api-attendance-app
CREATE DATABASE IF NOT EXISTS `api-attendance-app` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `api-attendance-app`;

-- Dumping structure for table api-attendance-app.attendances
CREATE TABLE IF NOT EXISTS `attendances` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `datetime` timestamp NOT NULL,
  `attendance_list_id` int unsigned NOT NULL,
  `user_grade_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_user_grade1_idx` (`user_grade_id`),
  KEY `fk_attendance_attendance_lists1_idx` (`attendance_list_id`),
  CONSTRAINT `fk_attendance_attendance_lists1` FOREIGN KEY (`attendance_list_id`) REFERENCES `attendance_lists` (`id`),
  CONSTRAINT `fk_attendance_user_grade1` FOREIGN KEY (`user_grade_id`) REFERENCES `user_grade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.attendances: ~0 rows (approximately)
INSERT INTO `attendances` (`id`, `datetime`, `attendance_list_id`, `user_grade_id`, `created_at`, `updated_at`) VALUES
	(5, '2025-08-16 23:28:34', 1, 1, '2025-08-16 23:28:34', '2025-08-16 23:28:34');

-- Dumping structure for table api-attendance-app.attendance_lists
CREATE TABLE IF NOT EXISTS `attendance_lists` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.attendance_lists: ~15 rows (approximately)
INSERT INTO `attendance_lists` (`id`, `name`, `created_at`, `updated_at`) VALUES
	(1, 'my list 1', '2025-08-16 21:27:00', '2025-08-16 21:27:00'),
	(2, 'my list 2', '2025-08-16 21:27:48', '2025-08-16 21:27:48'),
	(3, 'my list 3', '2025-08-16 22:00:35', '2025-08-16 22:00:35'),
	(4, 'my list 4', '2025-08-16 22:00:42', '2025-08-16 22:00:42'),
	(5, 'my list 5', '2025-08-16 22:00:46', '2025-08-16 22:00:46'),
	(6, 'my list 6', '2025-08-16 22:00:50', '2025-08-16 22:00:50'),
	(7, 'my list 7', '2025-08-16 22:00:53', '2025-08-16 22:00:53'),
	(8, 'my list 8', '2025-08-16 22:00:56', '2025-08-16 22:00:56'),
	(9, 'my list 9', '2025-08-16 22:01:00', '2025-08-16 22:01:00'),
	(10, 'my list 10', '2025-08-16 22:01:04', '2025-08-16 22:01:04'),
	(11, 'my list 11', '2025-08-16 22:01:08', '2025-08-16 22:01:08'),
	(12, 'my list 12', '2025-08-16 22:01:11', '2025-08-16 22:01:11'),
	(13, 'my list 13', '2025-08-16 22:01:15', '2025-08-16 22:01:15'),
	(14, 'my list 14', '2025-08-16 22:01:21', '2025-08-16 22:01:21'),
	(15, 'my list 15', '2025-08-16 22:01:24', '2025-08-16 22:01:24'),
	(16, 'my list 16', '2025-08-16 22:01:27', '2025-08-16 22:01:27');

-- Dumping structure for table api-attendance-app.grades
CREATE TABLE IF NOT EXISTS `grades` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `section_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grades_sections1_idx` (`section_id`),
  CONSTRAINT `fk_grades_sections1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.grades: ~2 rows (approximately)
INSERT INTO `grades` (`id`, `name`, `section_id`, `created_at`, `updated_at`) VALUES
	(1, 'Primer Grado Primaria', 1, '2025-08-16 17:51:22', '2025-08-16 17:51:23'),
	(2, 'Primer Grado Primaria', 2, '2025-08-16 17:51:36', '2025-08-16 17:51:37');

-- Dumping structure for table api-attendance-app.sections
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.sections: ~2 rows (approximately)
INSERT INTO `sections` (`id`, `name`, `created_at`, `updated_at`) VALUES
	(1, 'A', '2025-08-16 17:50:45', '2025-08-16 17:50:46'),
	(2, 'B', '2025-08-16 17:50:51', '2025-08-16 17:50:52');

-- Dumping structure for table api-attendance-app.states
CREATE TABLE IF NOT EXISTS `states` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.states: ~2 rows (approximately)
INSERT INTO `states` (`id`, `name`, `created_at`, `updated_at`) VALUES
	(1, 'ACTIVE', '2025-08-16 17:49:09', '2025-08-16 17:49:11'),
	(2, 'INACTIVE', '2025-08-16 17:49:20', '2025-08-16 17:49:21'),
	(3, 'DELETED', '2025-08-16 17:49:29', '2025-08-16 17:49:30');

-- Dumping structure for table api-attendance-app.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dni` text NOT NULL,
  `name` text,
  `father_last_name` text,
  `mother_last_name` text,
  `state_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_states1_idx` (`state_id`),
  CONSTRAINT `fk_users_states1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.users: ~3 rows (approximately)
INSERT INTO `users` (`id`, `dni`, `name`, `father_last_name`, `mother_last_name`, `state_id`, `created_at`, `updated_at`) VALUES
	(1, '123', 'User name', 'Father Last Name', 'Mother Last Name', 1, '2025-08-16 17:49:41', '2025-08-16 17:49:43'),
	(2, '321', 'my user name', 'my father last name', 'my mother last name', 1, '2025-08-17 00:19:02', '2025-08-17 00:19:02'),
	(3, '12345678', 'nombreuno', 'nombreuno', 'nombreuno', 1, '2025-08-17 22:18:47', '2025-08-17 22:18:47');

-- Dumping structure for table api-attendance-app.user_grade
CREATE TABLE IF NOT EXISTS `user_grade` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `year` varchar(45) DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `grade_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_grade_users1_idx` (`user_id`),
  KEY `fk_user_grade_grades1_idx` (`grade_id`),
  CONSTRAINT `fk_user_grade_grades1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`),
  CONSTRAINT `fk_user_grade_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table api-attendance-app.user_grade: ~3 rows (approximately)
INSERT INTO `user_grade` (`id`, `year`, `user_id`, `grade_id`, `created_at`, `updated_at`) VALUES
	(1, '2025', 1, 1, '2025-08-16 17:51:51', '2025-08-16 17:51:52'),
	(2, '2025', 2, 1, '2025-08-17 00:19:02', '2025-08-17 00:19:02'),
	(3, '2025', 3, 2, '2025-08-17 22:18:47', '2025-08-17 22:18:47');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
