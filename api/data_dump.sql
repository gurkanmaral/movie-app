/* MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
/*
/* Host: localhost    Database: movie
/* ------------------------------------------------------
/* Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` varchar(300) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `mediaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `commentUserId` (`userId`),
  CONSTRAINT `commentUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (4,'hey','2023-07-16 16:41:44',1,385687),(5,'hey','2023-07-17 14:25:53',1,71912),(7,'hey','2023-07-18 16:42:24',2,114472),(8,'nice','2023-07-18 17:03:34',2,30984),(9,'rte','2023-07-18 17:04:19',2,125988),(10,'test2','2023-07-18 17:06:01',2,125988),(11,'comment','2023-07-18 17:46:08',1,114472),(16,'a','2023-07-18 19:23:30',1,667538),(17,'nice movie','2023-07-29 15:13:25',1,872585),(23,'test','2023-07-29 18:25:37',1,872585),(30,'test','2023-08-01 18:18:35',2,447365),(31,'testtttttt','2023-08-01 18:18:51',2,872585),(37,'nice','2023-08-01 21:29:38',2,667538),(38,'nice movie','2023-08-05 11:15:53',2,667538),(39,'nice movie','2023-08-31 21:38:05',2,569094),(49,'not the best transformers movie but i\'ve enjoyed it. I guess they will never stop making transformers movies and i will continue to watch ahahahaha','2023-08-31 22:14:29',1,447365);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `mediaId` int DEFAULT NULL,
  `media_type` enum('movies','series') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_user_media` (`userId`,`media_type`,`mediaId`),
  CONSTRAINT `favoritesUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (22,1,615656,'movies'),(20,1,872585,'movies'),(23,1,37854,'series'),(19,1,71912,'series'),(1,2,346698,'movies'),(8,2,385687,'movies'),(9,2,447365,'movies'),(6,2,569094,'movies'),(10,2,667538,'movies'),(14,2,30984,'series'),(15,2,37854,'series'),(16,2,42009,'series'),(13,2,93740,'series'),(12,2,114472,'series');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `mediaId` int NOT NULL,
  `likedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `media_type` enum('movies','series') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `likedUserId` (`userId`),
  CONSTRAINT `likedUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (6,1,667538,'2023-07-16 14:03:23','movies'),(13,1,71912,'2023-07-17 14:02:14','series'),(14,2,447365,'2023-07-17 15:33:17','movies'),(15,2,254128,'2023-07-17 15:33:25','movies'),(16,2,30984,'2023-07-17 15:33:32','series'),(17,2,385687,'2023-07-18 16:26:01','movies'),(18,1,447365,'2023-07-18 16:26:45','movies'),(19,1,125988,'2023-07-18 16:27:06','series'),(24,1,298618,'2023-08-01 14:47:52','movies'),(25,2,346698,'2023-08-01 18:35:02','movies'),(26,2,872585,'2023-08-01 18:36:00','movies'),(27,2,667538,'2023-08-01 20:09:03','movies'),(28,2,71912,'2023-08-01 21:17:17','series'),(29,1,37854,'2023-08-31 23:02:55','series');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `media_type` enum('movies','series') NOT NULL,
  `mediaId` int NOT NULL,
  `rating` int NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `uc_user_media` (`userId`,`media_type`,`mediaId`),
  CONSTRAINT `ratingUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (3,2,'movies',455476,3,'2023-07-18 14:40:59'),(4,2,'movies',447365,5,'2023-07-18 14:54:37'),(9,2,'series',95479,9,'2023-07-18 15:54:04'),(10,2,'series',71912,5,'2023-07-18 15:54:17'),(11,2,'series',114472,3,'2023-07-18 15:57:18'),(12,2,'movies',385687,8,'2023-07-18 16:26:03'),(13,2,'series',30984,6,'2023-07-18 16:26:14'),(14,1,'movies',447365,4,'2023-07-18 16:26:47'),(15,1,'movies',667538,5,'2023-07-18 16:26:54'),(16,1,'series',30984,8,'2023-07-18 16:27:00'),(17,1,'series',125988,8,'2023-07-18 16:27:08'),(18,1,'series',71912,7,'2023-07-18 16:28:49'),(19,1,'series',114472,9,'2023-07-18 17:46:15'),(20,2,'movies',254128,5,'2023-07-18 18:27:39'),(22,2,'movies',872585,8,'2023-07-29 15:37:19'),(26,1,'movies',872585,8,'2023-07-31 21:37:54'),(28,2,'movies',667538,8,'2023-08-05 11:15:36'),(29,2,'movies',569094,9,'2023-08-31 21:37:34'),(31,1,'series',37854,9,'2023-08-31 23:03:00');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationships`
--

DROP TABLE IF EXISTS `relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relationships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `followerUserId` int DEFAULT NULL,
  `followedUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `followerUser` (`followerUserId`),
  KEY `followedUser` (`followedUserId`),
  CONSTRAINT `followedUser` FOREIGN KEY (`followedUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `followerUser` FOREIGN KEY (`followerUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationships`
--

LOCK TABLES `relationships` WRITE;
/*!40000 ALTER TABLE `relationships` DISABLE KEYS */;
INSERT INTO `relationships` VALUES (2,1,2),(9,2,1);
/*!40000 ALTER TABLE `relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `profilePic` varchar(400) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test1','test1@gmail.com','$2a$10$9fqdOK2v1t3o9lXglAsXrO3yPyKHRfe7OWQvz4bMQlSSvqo9Xlu8G','test1','1689697387694avtr-0-1000-0-1000-crop.jpg',NULL,NULL),(2,'test2','test2@gmail.com','$2a$10$dFjYy0TzmMICe.O8fu6UpuSoUv5ssOlJVO1xobb7c4q9gMs53ZcC6','test2','16896968951907197be9c7fe0c523b1862e2623f03024.jpg',NULL,'www.github.com/gurkanmaral');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watched`
--

DROP TABLE IF EXISTS `watched`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watched` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `mediaId` int NOT NULL,
  `media_type` enum('movies','series') DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `watchedUserId` (`userId`),
  CONSTRAINT `watchedUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watched`
--

LOCK TABLES `watched` WRITE;
/*!40000 ALTER TABLE `watched` DISABLE KEYS */;
INSERT INTO `watched` VALUES (12,2,447365,'movies','2023-07-17 14:52:30'),(13,2,667538,'movies','2023-07-17 14:55:02'),(14,2,455476,'movies','2023-07-17 14:57:32'),(15,2,71912,'series','2023-07-17 15:00:48'),(16,2,385687,'movies','2023-07-17 16:23:17'),(17,2,114472,'series','2023-07-18 15:57:14'),(18,1,30984,'series','2023-07-18 16:27:01'),(19,1,125988,'series','2023-07-18 16:27:15'),(20,1,447365,'movies','2023-07-18 16:27:28'),(21,1,667538,'movies','2023-07-18 16:27:36'),(22,1,71912,'series','2023-07-18 16:28:56'),(23,2,30984,'series','2023-07-18 16:30:02'),(24,1,114472,'series','2023-07-18 17:46:12'),(25,2,254128,'movies','2023-07-18 18:27:39'),(27,2,872585,'movies','2023-07-29 15:37:19'),(29,1,872585,'movies','2023-07-29 16:22:47'),(30,2,569094,'movies','2023-08-31 21:37:34'),(31,1,615656,'movies','2023-08-31 23:02:13'),(32,1,37854,'series','2023-08-31 23:02:54');
/*!40000 ALTER TABLE `watched` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `mediaId` int NOT NULL,
  `media_type` enum('movies','series') DEFAULT NULL,
  `addedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `watchlistUserId` (`userId`),
  CONSTRAINT `watchlistUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchlist`
--

LOCK TABLES `watchlist` WRITE;
/*!40000 ALTER TABLE `watchlist` DISABLE KEYS */;
INSERT INTO `watchlist` VALUES (8,2,346698,'movies','2023-07-17 15:41:24'),(9,2,125988,'series','2023-07-17 15:41:31'),(10,2,447365,'movies','2023-07-18 14:10:26'),(11,2,254128,'movies','2023-07-18 15:08:17'),(34,1,298618,'movies','2023-08-01 12:46:00'),(35,1,113962,'series','2023-08-01 12:46:07'),(36,2,569094,'movies','2023-08-01 18:36:19'),(37,2,667538,'movies','2023-08-01 20:09:06'),(38,2,71912,'series','2023-08-01 21:17:19');
/*!40000 ALTER TABLE `watchlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-06 17:57:32
