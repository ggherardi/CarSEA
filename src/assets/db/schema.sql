-- phpMyAdmin SQL Dump
-- version 4.7.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Feb 15, 2018 alle 01:56
-- Versione del server: 5.5.45
-- Versione PHP: 7.0.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carsea`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) NOT NULL,
  `id_regione` int(11) NOT NULL,
  `id_provincia` int(11) NOT NULL,
  `nome` varchar(500) DEFAULT NULL,
  `latitudine` double DEFAULT NULL,
  `longitudine` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `trips`
--

CREATE TABLE `trips` (
  `id` bigint(20) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `departure_city` bigint(20) NOT NULL,
  `arrival_city` bigint(20) NOT NULL,
  `stopover_city_1` bigint(20) NOT NULL,
  `stopover_city_2` bigint(20) NOT NULL,
  `stopover_city_3` bigint(20) NOT NULL,
  `stopover_city_4` bigint(20) NOT NULL,
  `departure_date` datetime NOT NULL,
  `price` double NOT NULL,
  `seats` int(11) NOT NULL,
  `description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(500) NOT NULL,
  `Email` varchar(500) NOT NULL,
  `Password` varchar(500) NOT NULL,
  `Nome` varchar(500) NOT NULL,
  `Cognome` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `latitudine` (`latitudine`,`longitudine`);

--
-- Indici per le tabelle `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Username`(250)),
  ADD UNIQUE KEY `Id` (`Id`),
  ADD UNIQUE KEY `Email` (`Email`(200)) USING BTREE;

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8621;

--
-- AUTO_INCREMENT per la tabella `trips`
--
ALTER TABLE `trips`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
