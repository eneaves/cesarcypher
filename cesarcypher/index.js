const readlinesync = require('readline-sync');
const fs = require('fs');
const path = require('path');

function cesarcypher(str, idx) {
    let result = "";
    let alphabetLower = "abcdefghijklmnopqrstuvwxyz";
    let alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let letter of str) {
        if (alphabetLower.includes(letter)) {
            let index = alphabetLower.indexOf(letter);
            let newIndex = (index + idx) % 26;
            let newLetter = alphabetLower[newIndex];
            result += newLetter;
        } else if (alphabetUpper.includes(letter)) {
            let index = alphabetUpper.indexOf(letter);
            let newIndex = (index + idx) % 26;
            let newLetter = alphabetUpper[newIndex];
            result += newLetter;
        } else {
            result += letter; 
        }
    }
    return result;
}

function registerUser() {
    let username = readlinesync.question("Enter username: ");
    let password = readlinesync.question("Enter password: ");

    let password_cypher = cesarcypher(password, 7);
    addUser(username, password_cypher);

    console.log("username: ", username);
    console.log("password: ", password);
    console.log("password_cypher: ", password_cypher);
}

function addUser(username, password_cypher) {
    const filePath = path.join(__dirname, 'users.json');
    let users = [];
    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath);
        users = JSON.parse(data);
    } else {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    users.push({
        username: username,
        password: password_cypher
    });

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User registered successfully");
        }
    });
}

function loginUser() {
    let username = readlinesync.question("Enter username: ");
    let password = readlinesync.question("Enter password: ");

    const filePath = path.join(__dirname, 'users.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        let users = JSON.parse(data);
        let userFound = false;

        for (let user of users) {
            if (username === user.username && cesarcypher(password, 7) === user.password) {
                console.log("Login successful");
                userFound = true;
                break;
            }
        }

        if (!userFound) {
            console.log("Login failed");
        }
    });
}

const action = readlinesync.question("Do you want to register or login? (register/login): ").toLowerCase();
if (action === "register") {
    registerUser();
} else if (action === "login") {
    loginUser();
} else {
    console.log("Invalid action. Please enter 'register' or 'login'.");
}
