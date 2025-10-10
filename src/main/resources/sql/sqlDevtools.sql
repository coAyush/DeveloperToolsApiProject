-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: devtools
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `api`
--

DROP TABLE IF EXISTS `api`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api`
--

LOCK TABLES `api` WRITE;
/*!40000 ALTER TABLE `api` DISABLE KEYS */;
INSERT INTO `api` VALUES (1,'Image Placeholder'),(2,'Word to PDF Converter'),(3,'Image to PDF Converter'),(4,'QR Code Generator'),(5,'UUID Generator'),(6,'Password Generator'),(7,'URL Shortener'),(8,'PDF Compressor');
/*!40000 ALTER TABLE `api` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urls`
--

DROP TABLE IF EXISTS `urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_url` varchar(500) DEFAULT NULL,
  `short_code` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `short_code` (`short_code`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urls`
--

LOCK TABLES `urls` WRITE;
/*!40000 ALTER TABLE `urls` DISABLE KEYS */;
INSERT INTO `urls` VALUES (1,'https://example.com','gFHMLN','2025-10-07 11:08:01'),(2,'https://www.bing.com/search?q=http%3A%2F%2Flocalhost%3A127.0.0.1%2Fapartment%2Fregister.php&gs_lcrp=EgRlZGdlKgcIABBFGMIDMgcIABBFGMIDMgcIARBFGMIDMgcIAhBFGMIDMgcIAxBFGMIDMgcIBBBFGMIDMgcIBRBFGMIDMgcIBhBFGMIDMgcIBxBFGMID0gEJOTk5NzdqMGoxqAIIsAIB&FORM=ANNTA1&PC=U531','CUJ4lj','2025-10-07 12:00:42'),(3,'https://www.bing.com/search?q=http%3A%2F%2Flocalhost%3A127.0.0.1%2Fapartment%2Fregister.php&gs_lcrp=EgRlZGdlKgcIABBFGMIDMgcIABBFGMIDMgcIARBFGMIDMgcIAhBFGMIDMgcIAxBFGMIDMgcIBBBFGMIDMgcIBRBFGMIDMgcIBhBFGMIDMgcIBxBFGMID0gEJOTk5NzdqMGoxqAIIsAIB&FORM=ANNTA1&PC=U531','my','2025-10-07 12:01:30'),(4,'https://www.bing.com/search?q=http%3A%2F%2Flocalhost%3A127.0.0.1%2Fapartment%2Fregister.php&gs_lcrp=EgRlZGdlKgcIABBFGMIDMgcIABBFGMIDMgcIARBFGMIDMgcIAhBFGMIDMgcIAxBFGMIDMgcIBBBFGMIDMgcIBRBFGMIDMgcIBhBFGMIDMgcIBxBFGMID0gEJOTk5NzdqMGoxqAIIsAIB&FORM=ANNTA1&PC=U531','yLhecv','2025-10-07 12:02:44'),(5,'https://www.bing.com/search?q=http%3A%2F%2Flocalhost%3A127.0.0.1%2Fapartment%2Fregister.php&gs_lcrp=EgRlZGdlKgcIABBFGMIDMgcIABBFGMIDMgcIARBFGMIDMgcIAhBFGMIDMgcIAxBFGMIDMgcIBBBFGMIDMgcIBRBFGMIDMgcIBhBFGMIDMgcIBxBFGMID0gEJOTk5NzdqMGoxqAIIsAIB&FORM=ANNTA1&PC=U531','h1ty2d','2025-10-07 12:21:21'),(6,'https://www.bing.com/search?q=http%3A%2F%2Flocalhost%3A8080%2Fdevelopertoolsapiproject%2Fr%2Fe58d4b&gs_lcrp=EgRlZGdlKgcIBBBFGMIDMgcIABBFGMIDMgcIARBFGMIDMgcIAhBFGMIDMgcIAxBFGMIDMgcIBBBFGMIDMgcIBRBFGMIDMgcIBhBFGMIDMgcIBxBFGMID0gEJMjI2NDlqMGoxqAIIsAIB&FORM=ANNTA1&PC=U531','wGT5r3','2025-10-07 12:34:03'),(7,'https://www.bing.com/search?q=http%3A%2F%2Flocalhost%3A8080%2Fdevelopertoolsapiproject%2Fr%2Fe58d4b&gs_lcrp=EgRlZGdlKgcIBBBFGMIDMgcIABBFGMIDMgcIARBFGMIDMgcIAhBFGMIDMgcIAxBFGMIDMgcIBBBFGMIDMgcIBRBFGMIDMgcIBhBFGMIDMgcIBxBFGMID0gEJMjI2NDlqMGoxqAIIsAIB&FORM=ANNTA1&PC=U531','UwxS6U','2025-10-07 12:35:41'),(8,'https://www.msn.com/en-in/money/markets/kantara-chapter-1-box-office-collection-day-5-the-rishab-shetty-film-sees-drop-on-monday-crosses-rs-250-crore-net-in-india/ar-AA1NVRgv?ocid=msedgntp&pc=U531&cvid=68e509268c7342f48e2125c30f1fc6c7&ei=7','zI1vpU','2025-10-07 12:36:14'),(9,'https://www.msn.com/en-in/money/markets/kantara-chapter-1-box-office-collection-day-5-the-rishab-shetty-film-sees-drop-on-monday-crosses-rs-250-crore-net-in-india/ar-AA1NVRgv?ocid=msedgntp&pc=U531&cvid=68e509268c7342f48e2125c30f1fc6c7&ei=7','VzWIYQ','2025-10-07 12:36:15'),(10,'https://www.msn.com/en-in/money/markets/kantara-chapter-1-box-office-collection-day-5-the-rishab-shetty-film-sees-drop-on-monday-crosses-rs-250-crore-net-in-india/ar-AA1NVRgv?ocid=msedgntp&pc=U531&cvid=68e509268c7342f48e2125c30f1fc6c7&ei=7','wrsg8Y','2025-10-07 12:57:43'),(11,'https://openai.com','myAlias','2025-10-09 09:11:11'),(12,'https://openai.com','myAlias-xfkmcu','2025-10-09 09:12:46'),(13,'https://www.msn.com/en-in/entertainment/bollywood/saif-ali-khan-addresses-claims-that-knife-attack-was-fake-and-reveals-why-he-walked-out-of-the-hospital-on-foot-it-was-painful/ar-AA1O6kDo','mulla','2025-10-09 09:18:23');
/*!40000 ALTER TABLE `urls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usages`
--

DROP TABLE IF EXISTS `usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `api` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usages`
--

LOCK TABLES `usages` WRITE;
/*!40000 ALTER TABLE `usages` DISABLE KEYS */;
INSERT INTO `usages` VALUES (1,'Ayush','QR Code Generator');
/*!40000 ALTER TABLE `usages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'PowerTest','powertest@example.com','12345','2025-10-10 13:17:14'),(3,'Ayush','chowdhuryayush@gmail.com','ayush52141','2025-10-10 13:20:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-10 20:47:57
