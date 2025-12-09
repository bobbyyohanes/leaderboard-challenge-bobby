/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - leaderboard_bobby
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`leaderboard_bobby` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;

USE `leaderboard_bobby`;

/*Table structure for table `score` */

DROP TABLE IF EXISTS `score`;

CREATE TABLE `score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `userUserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b50ebf99f0591e1f9597c0e2d3e` (`userUserId`),
  CONSTRAINT `FK_b50ebf99f0591e1f9597c0e2d3e` FOREIGN KEY (`userUserId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `score` */

insert  into `score`(`id`,`value`,`createdAt`,`updatedAt`,`deletedAt`,`userUserId`) values 
(1,1500,'2025-12-09 16:38:49.644680','2025-12-09 16:38:49.644680',NULL,2),
(2,2000,'2025-12-09 16:38:58.165641','2025-12-09 16:38:58.165641',NULL,2),
(3,1300,'2025-12-09 16:39:07.275373','2025-12-09 16:39:07.275373',NULL,1),
(4,150,'2025-12-09 16:42:58.225573','2025-12-09 16:42:58.225573',NULL,1),
(5,150,'2025-12-09 16:44:06.181288','2025-12-09 16:44:06.181288',NULL,3);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `user` */

insert  into `user`(`userId`,`firstName`,`lastName`,`email`,`password`,`role`,`createdAt`,`updatedAt`,`deletedAt`) values 
(1,'bobby','yohanes','bobby@mail.com','$2b$10$7UkB3qEv8ktH93TbOnfU5.GdWYih5lvqYz58qItfz5QyfAtYl3X4K','admin','2025-12-09 15:32:22.898102','2025-12-09 15:32:57.042768',NULL),
(2,'udin','Yohanes','udin@mail.com','$2b$10$gT0.jgGFCTeNZInEpK9v9uryJNsRedVpE4bff.S4dBJKVCf6lIkzK','user','2025-12-09 16:26:20.373332','2025-12-09 16:26:20.373332',NULL),
(3,'nunu','nana','nunu@mail.com','$2b$10$nWpSWElYFJdYDJmkP76Q0ObU6ZUwerCWhaussif1/92H/c1VDbD0q','user','2025-12-09 16:40:02.325771','2025-12-09 16:40:02.325771',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
