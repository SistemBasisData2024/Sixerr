const { Pool } = require("pg");

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
    console.log("💡 Payment Connected to PostgreSQL database");
});

async function makePayment(req, res) {
    const {buyer_id, seller_id} = req.body;


    // Add Payment to Database
    try {
        const result = await pool.query(
            `INSERT INTO payments (buyer_id, seller_id)
            VALUES ($1, $2) RETURNING *`,
            [buyer_id, seller_id]
        );
        const newPayment = result.rows[0];
        res.status(201).send(newPayment);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getAllPayments(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM payments`
        );
        res.status(201).send(result.rows);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getPaymentByBuyer(req, res) {
    const {buyer_id} = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM payments
            WHERE buyer_id = $1`,
            [buyer_id]
        );
        res.status(201).send(result.rows);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getPaymentBySeller(req, res) {
    const {seller_id} = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM payments
            WHERE seller_id = $1`,
            [seller_id]
        );
        res.status(201).send(result.rows);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function cancelPayment(req, res) {
    const {payment_id} = req.body;

    try {
        const result = await pool.query(
            `DELETE FROM payments
            WHERE payment_id = $1`,
            [payment_id]
        );
        res.status(201).send({msg: "Payment cancelled"});
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

module.exports = {
    makePayment,
    getAllPayments,
    getPaymentByBuyer,
    getPaymentBySeller,
    cancelPayment,
};