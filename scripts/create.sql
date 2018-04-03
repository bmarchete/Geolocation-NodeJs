CREATE DATABASE db
USE db

CREATE TABLE locations(
    id NOT NULL AUTO_INCREMENT PRIMARY KEY,
    location_id VARCHAR(30),
    address TEXT,
    latitude VARCHAR(15),
    longitud VARCHAR(15)
)