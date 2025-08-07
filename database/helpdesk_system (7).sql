-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 08, 2024 at 06:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helpdesk_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `chatId` int(11) NOT NULL,
  `ticketId` int(11) DEFAULT NULL,
  `chatLog` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`chatId`, `ticketId`, `chatLog`, `createdAt`) VALUES
(13, 81, 'StaffEM: ผมอยากทราบรหัสเครื่อง pc ของคุณเพื่อแก้ไข', '2024-11-07 05:13:54'),
(14, 81, 'USER: ผมไม่บอกหรอกคุณหาเอาเองเลยผมกลัว', '2024-11-07 05:14:27'),
(15, 82, 'staff: เครื่อง pc ที่มีงูออกมาเครื่องไหนนะครับ', '2024-11-07 05:19:34'),
(16, 82, 'ีuserEM: เครื่องห้อง if001 เครื่องแรกครับ', '2024-11-07 05:19:58'),
(17, 82, 'stafff: ผมเห็นคุณเปิดปัญหาใหม่งูไม่ตายหรือครับ', '2024-11-07 05:21:23'),
(18, 82, 'userEM: ตายแล้วครับแต่มันไข่ไว้', '2024-11-07 05:22:04'),
(19, 83, 'staffM: งูพันอะไรครับ', '2024-11-07 08:05:38'),
(20, 83, 'ีuserAum: งูพันท้ายนรสิงครับ', '2024-11-07 08:05:56'),
(21, 83, 'staffM: โอเครครับ เดี๋ยวเอางูไปกินกับสุกี้นะครับ', '2024-11-07 08:06:26'),
(22, 83, 'staffM: มีอะไรให้แก้ไขอีกครับเห็น reopen มา', '2024-11-07 08:07:20'),
(23, 83, 'userAum: มันไข่เอาไว้ด้วยครับ ทำยังไงดี', '2024-11-07 08:07:45'),
(24, 83, 'staffM: เดี๋ยวผมเอาไปฟักครับ ทำแกงฟัก', '2024-11-07 08:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `knowledgebase`
--

CREATE TABLE `knowledgebase` (
  `articleId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `createdBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knowledgebase`
--

INSERT INTO `knowledgebase` (`articleId`, `title`, `content`, `createdBy`) VALUES
(1, 'How to reset password', 'To reset your password, go to the settings page and click on \"Reset Password\".', NULL),
(2, 'How to create a ticket', 'To create a ticket, click on \"Create Ticket\" and fill out the required fields.', NULL),
(3, 'Project Description', 'asdasdasd', 12),
(4, 'python งูฉก', 'เอาไม้ตี', 12),
(5, 'วิธีการทำมาม่า', 'ต้มหุงนึ่ง', 11),
(6, 'ฟหก', 'ฟหกหก', 11);

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `permissionId` int(11) NOT NULL,
  `permissionName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`permissionId`, `permissionName`) VALUES
(4, 'Assign Ticket'),
(11, 'Chat'),
(1, 'Create Ticket'),
(3, 'Delete Ticket'),
(10, 'editQueue'),
(5, 'GenReport'),
(8, 'knowledgeBase'),
(6, 'ManageUsers'),
(9, 'SolveProblem'),
(7, 'TrackTicket'),
(12, 'Verify'),
(2, 'View Ticket');

-- --------------------------------------------------------

--
-- Table structure for table `queue`
--

CREATE TABLE `queue` (
  `queueId` int(11) NOT NULL,
  `priorityLevel` varchar(50) NOT NULL,
  `ticketId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `reportId` int(11) NOT NULL,
  `reportType` varchar(50) NOT NULL,
  `reportData` text NOT NULL,
  `generatedBy` int(11) NOT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`reportId`, `reportType`, `reportData`, `generatedBy`, `generated_at`) VALUES
(14, 'Ticket Queue', '[]', 10, '2024-11-07 05:27:45'),
(15, 'Ticket Status', '[{\"ticketId\":81,\"status\":\"Closed\"},{\"ticketId\":82,\"status\":\"Closed\"}]', 10, '2024-11-07 05:27:48'),
(16, 'Ticket Status', '[{\"ticketId\":81,\"status\":\"Closed\"},{\"ticketId\":82,\"status\":\"Closed\"},{\"ticketId\":83,\"status\":\"Closed\"}]', 10, '2024-11-07 08:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`roleId`, `roleName`) VALUES
(1, 'Admin'),
(2, 'Customer'),
(3, 'Staff');

-- --------------------------------------------------------

--
-- Table structure for table `rolepermissions`
--

CREATE TABLE `rolepermissions` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rolepermissions`
--

INSERT INTO `rolepermissions` (`roleId`, `permissionId`) VALUES
(1, 5),
(1, 6),
(2, 1),
(2, 7),
(2, 8),
(2, 11),
(2, 12),
(3, 4),
(3, 8),
(3, 9),
(3, 10),
(3, 11);

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticketId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `createdDate` datetime DEFAULT current_timestamp(),
  `queueId` int(11) DEFAULT NULL,
  `assignedBy` int(11) DEFAULT NULL,
  `solution` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`ticketId`, `userId`, `description`, `status`, `createdDate`, `queueId`, `assignedBy`, `solution`) VALUES
(81, 12, 'คอมพิวเตอร์ของผมโดน rick roll ช่วยด้วย', 'Closed', '2024-11-07 11:57:50', NULL, 11, 'ผมได้แก้ไขให้แล้วจากการโดน ไวรัส rickroll ลองเช็คดูนะครับ'),
(82, 12, 'ช่วยด้วยผมใช้ภาษา python แล้วมีงูออกมาฉก', 'Closed', '2024-11-07 12:18:42', NULL, 11, 'ผมเอาไข่มันไปต้มกินแล้วครับกับมาม่า'),
(83, 12, 'เขียน code python แล้วมีงูฉกทำยังไงดีครับ', 'Closed', '2024-11-07 15:05:08', NULL, 11, 'ผมทำการจับงูให้แล้วพร้อมเอาไปกินกับชาบู และ เอาไข่ไปฟักกินกับฟัก');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `username`, `password`, `created_at`, `updated_at`) VALUES
(10, 'admin', '1', '2024-10-26 10:15:49', '2024-10-26 10:15:49'),
(11, 'staff', '1', '2024-10-26 10:16:34', '2024-10-26 10:16:34'),
(12, 'customer', '1', '2024-10-26 10:16:43', '2024-11-07 05:12:31'),
(13, 'Aum', '1', '2024-11-07 08:09:33', '2024-11-07 08:09:33');

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`userId`, `roleId`) VALUES
(10, 1),
(11, 3),
(12, 2),
(13, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`chatId`),
  ADD KEY `ticketId` (`ticketId`);

--
-- Indexes for table `knowledgebase`
--
ALTER TABLE `knowledgebase`
  ADD PRIMARY KEY (`articleId`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`permissionId`),
  ADD UNIQUE KEY `permissionName` (`permissionName`);

--
-- Indexes for table `queue`
--
ALTER TABLE `queue`
  ADD PRIMARY KEY (`queueId`),
  ADD KEY `ticketId` (`ticketId`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`reportId`),
  ADD KEY `generatedBy` (`generatedBy`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleId`),
  ADD UNIQUE KEY `roleName` (`roleName`);

--
-- Indexes for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `permissionId` (`permissionId`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticketId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `queueId` (`queueId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`userId`,`roleId`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `chatId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `knowledgebase`
--
ALTER TABLE `knowledgebase`
  MODIFY `articleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `permissionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `queue`
--
ALTER TABLE `queue`
  MODIFY `queueId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `reportId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `ticketId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`ticketId`);

--
-- Constraints for table `knowledgebase`
--
ALTER TABLE `knowledgebase`
  ADD CONSTRAINT `knowledgebase_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`) ON DELETE SET NULL;

--
-- Constraints for table `queue`
--
ALTER TABLE `queue`
  ADD CONSTRAINT `queue_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`ticketId`) ON DELETE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`generatedBy`) REFERENCES `user` (`userId`);

--
-- Constraints for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD CONSTRAINT `rolepermissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rolepermissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`permissionId`) ON DELETE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE SET NULL,
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`queueId`) REFERENCES `queue` (`queueId`) ON DELETE SET NULL,
  ADD CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`queueId`) REFERENCES `queue` (`queueId`) ON DELETE CASCADE;

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
