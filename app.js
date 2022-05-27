/*
 * This is the API for the post application wherein users can register, login,
 * and create posts.
 *
 * Database schema:
 * users(name VARCHAR(20), email VARCHAR(100) PRIMARY KEY, password VARCHAR(100), loggedIn INT)
 * posts(title VARCHAR(100), description VARCHAR(100), photo VARBINARY(8000), name VARCHAR(20))
 */

"use strict";

const express = require("express");
const multer = require('multer');
const app = express();

const { Client } = require('pg');
const client = new Client();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

// register a new user
app.post("/register", async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!validateEmail(email)) {
      res.status(401).send("Invalid email address!");
    }
    await client.connect();
    if (checkNamerepeated(name)) {
      res.status(402).send("Name already exists!");
    } else if (checkEmailrepeated(email)) {
      res.status(403).send("Email already exists!");
    } else {
      const insertUser = "INSERT INTO users(name, email, password, loggedIn) VALUES($1, $2, $3, 0);";
      await client.query(insertUser, [name, email, password]);
    }
    res.type("text").send("You have successfully registered!");
    await client.end();
  } catch (err) {
    res.status(500).send("Unknown server error!");
  }
});

// log in a user
// TODO: implement password encryption by generating and storing a salt for each user and store
//       the salted password's hashcode in the database instead
// TODO: implement logout feature
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!validateEmail(email)) {
      res.status(401).send("Invalid email address!");
    }

    await client.connect();
    const logIn = "SELECT COUNT(*) AS Count FROM users WHERE email=$1 AND password=$2 AND loggedIn=0;";
    const logInResult = await client.query(logIn, email, password);
    await client.end();

    if (logInResult["Count"] > 0) {
      res.status(400).send("You have already logged in!");
    } else {
      const update = "UPDATE users SET loggedIn=1 WHERE email=$1 AND password=$2;";
      await client.query(update, email, password);
      res.json({"status": "success"});
    }
  } catch (err) {
    res.status(500).send("Unknown server error!");
  }
});

// create a post
app.post("/login", async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();
    const title = req.body.title;
    const description = req.body.description;
    const photo = req.body.photo;

    if (!checkNamerepeated(name)) { // no such name in the database
      res.status(401).send("Invalid name!");
    }

    await client.connect();
    const post = "INSERT INTO posts(title, description, photo, name) VALIES($1, $2, $3, $4);";
    await client.query(post, title, description, photo, name);
    await client.end();

    res.type("text").send("You have successfully created a post!");
  } catch (err) {
    res.status(500).send("Unknown server error!");
  }

})


/**
 * Checks if the given name is valid. Name is only valid
 * if they're not already registered (case insensitive).
 * @param {string} name - username to be registered.
 * @returns {boolean} - whether the given name is repeated.
 */
async function checkNamerepeated(name) {
  try{
    const checkName = "SELECT COUNT(*) AS Count FROM users WHERE name=$1;";
    const nameResult = await client.query(checkName, [name]);

    if (nameResult["Count"] > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Checks if the given email is already registered (case insensitive).
 * @param {string} email - email to be registered.
 * @returns {boolean} - whether the given email is repeated.
 */
 async function checkEmailrepeated(email) {
  try{
    const checkEmail = "SELECT COUNT(*) AS Count FROM users WHERE email=$1;";
    const emailResult = await client.query(checkEmail, [email]);

    if (emailResult["Count"] > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Checks if the given name, email amd password are valid. Name and email are only valid
 * if they're not already registered (case insensitive).
 * @param {string} email - email of the given username.
 * @returns {boolean} - whether the given email is valid.
 */
function validateEmail(email) {
  return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}