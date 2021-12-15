-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 15, 2021 at 10:56 AM
-- Server version: 8.0.27-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sugam`
--

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int NOT NULL,
  `role_name` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `role_name`) VALUES
(1, 'Super Admin'),
(2, 'Admin'),
(3, 'Users');

-- --------------------------------------------------------

--
-- Table structure for table `scanreport`
--

CREATE TABLE `scanreport` (
  `scan_id` int NOT NULL,
  `websitename` varchar(256) NOT NULL,
  `url` varchar(256) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scan_level` varchar(256) NOT NULL,
  `result` varchar(256) NOT NULL,
  `rules_failed` int NOT NULL,
  `errors` bigint NOT NULL,
  `warnings` bigint NOT NULL,
  `notices` bigint NOT NULL,
  `frequency` varchar(256) NOT NULL,
  `status` varchar(256) NOT NULL,
  `total` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `scanreport`
--

INSERT INTO `scanreport` (`scan_id`, `websitename`, `url`, `date`, `scan_level`, `result`, `rules_failed`, `errors`, `warnings`, `notices`, `frequency`, `status`, `total`) VALUES
(1, 'dummy website', 'http://localhost/dummyurl', '2021-12-10 15:50:09', 'Level A', 'Failed', 1, 121, 25, 666, 'Ad-hoc', 'Completed', 10000),
(2, 'Dummy Website 2', 'http://localhost/dummy2_site', '2021-12-11 15:57:07', 'Level AAA', 'pass', 0, 3, 10, 10001, 'Ad-hoc', 'Completed', 102020),
(4, 'Google', 'https://www.google.com/', '2021-12-11 18:02:22', 'Level A', 'Pass', 0, 3, 6, 85, 'Ad-hoc', 'Completed', 94),
(5, '50 Projects 50 Days | Traversy Media', 'https://traversy.dev/', '2021-12-11 18:14:22', 'Level A', 'Pass', 0, 9, 118, 206, 'Ad-hoc', 'Completed', 333),
(6, '404 - Unique Identification Authority of India | Government of India', 'https://uidai.gov.in/404/', '2021-12-11 18:16:59', 'Level A', 'Pass', 0, 8, 75, 288, 'Ad-hoc', 'In Progress', 371),
(7, 'Guidelines for Indian Government Websites (GIGW) | India', 'https://guidelines.india.gov.in/', '2021-12-11 18:18:56', 'Level A', 'Pass', 0, 8, 16, 144, 'Ad-hoc', 'Completed', 168),
(8, '50 Projects 50 Days | Traversy Media', 'https://traversy.dev/', '2021-12-11 18:23:02', 'Level A', 'Pass', 0, 9, 118, 206, 'Ad-hoc', 'Completed', 333),
(9, 'Guidelines for Indian Government Websites (GIGW) | India', 'https://guidelines.india.gov.in/', '2021-12-11 18:24:03', 'Level A', 'Pass', 0, 8, 16, 144, 'Ad-hoc', 'Completed', 168),
(10, 'Compare and Apply for Loans, Credit Cards, Insurance in India', 'https://www.bankbazaar.com/', '2021-12-13 08:50:17', 'Level A', 'Pass', 0, 54, 70, 418, 'Ad-hoc', 'Completed', 542),
(11, '50 Projects 50 Days | Traversy Media', 'https://traversy.dev/', '2021-12-13 08:51:03', 'Level A', 'Pass', 0, 9, 118, 206, 'Ad-hoc', 'Completed', 333),
(12, 'Axe-core vs PA11Y: Which one should you choose? - craigabbott.co.uk', 'https://www.craigabbott.co.uk/blog/axe-core-vs-pa11y', '2021-12-13 08:56:36', 'Level A', 'Pass', 0, 0, 4, 48, 'Ad-hoc', 'Completed', 52);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `mobile` int NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(15) NOT NULL,
  `id` int NOT NULL,
  `rolename` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`first_name`, `last_name`, `mobile`, `username`, `password`, `id`, `rolename`) VALUES
('priya', 'subramanian', 98989898, 'priya162125', 'Apple@123', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scanreport`
--
ALTER TABLE `scanreport`
  ADD PRIMARY KEY (`scan_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scanreport`
--
ALTER TABLE `scanreport`
  MODIFY `scan_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
