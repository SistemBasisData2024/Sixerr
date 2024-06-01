const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    
    ssl: {
        require: true,
    }
});

pool.connect().then(() => {
    console.log("💡 Account Connected to PostgreSQL database");
});

async function registerAccount(req, res) {
    const {username, email, password} = req.body;


    // hashing
    generatedPassword = null;
    try {
        const hash = crypto.createHash('md5');
        hash.update(password);
        generatedPassword = hash.digest('hex');
    } catch (error) {
        console.log("failed to hash password");
    }


    // Post Account to Database
    try {
        const result = await pool.query(
            `INSERT INTO accounts (username, email, password)
            VALUES ($1, $2, $3) RETURNING *`,
            [username, email, generatedPassword]
        );
        const newAccount = result.rows[0];
        res.status(201).send(newAccount);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function loginAccount(req, res) {
    const {email, password} = req.body;


    // hashing
    generatedPassword = null;
    try {
        const hash = crypto.createHash('md5');
        hash.update(password);
        generatedPassword = hash.digest('hex');
    } catch (error) {
        console.log("failed to hash password");
    }


    // Search Account in Database
    try {
        const result = await pool.query(
            `SELECT * FROM accounts
            WHERE email = $1
            AND password = $2`,
            [email, generatedPassword]
        );
        const loggedAccount = result.rows[0];
        res.status(201).send(loggedAccount);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    registerAccount,
    loginAccount,
};