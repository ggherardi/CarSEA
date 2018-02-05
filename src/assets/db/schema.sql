-- phpMyAdmin SQL Dump
-- version 4.7.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Feb 03, 2018 alle 17:30
-- Versione del server: 5.5.45
-- Versione PHP: 7.0.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `carsea`
--
CREATE DATABASE IF NOT EXISTS `carsea` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `carsea`;

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
-- Svuota la tabella prima dell'inserimento `users`
--

TRUNCATE TABLE `users`;
--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`Id`, `Username`, `Email`, `Password`, `Nome`, `Cognome`) VALUES
(12, 'admin', 'admin@admin.it', '$2y$10$2uUOMcImw01Lx5Z8MhKtrex/KFypOejqV1raZkj3lGfbHctWAGSri', 'admin', 'admin'),
(1, 'ggherardi', 'giamalfred@yahoo.it', '$2y$10$13shRAAd3DHYISDs6636YO83O9qd.kmtQcbv/bP3SFzn3nAgJZ9/q', 'Gianmattia', 'Gherardi'),
(13, 'pippopaperino', 'ppi@pii.ti', '$2y$10$KIcNFtVHfNEC6rRgous2guzNQikCnfZVCUwHEZ7rXojVDP7D6WB0O', 'asdafa', 'asdgfasdg'),
(15, 'poll', 'pollo@pollo.i', '$2y$10$aDIaSOsISrxI/3Usmr9DpuubxRuEovOki3oBwyj80wGa1VnXY9nVm', 'pollo', 'pollo'),
(14, 'pollo', 'pollo@pollo.it', '$2y$10$Oa0iLk/NsJPJZMovj1eM0.JxLu.7hSakm3HEkvpBG4YBDwfrlRN/e', 'pollo', 'pollo');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Username`(250)),
  ADD UNIQUE KEY `Id` (`Id`),
  ADD UNIQUE KEY `Email` (`Email`(100)) USING BTREE;

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;
