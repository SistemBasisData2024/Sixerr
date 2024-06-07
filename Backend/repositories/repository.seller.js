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
    console.log("💡 Seller Connected to PostgreSQL database");
});

async function registerSeller(req, res) {
    const {user_id, seller_name, seller_price, seller_img_id, portfolio_id, location} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO sellers (user_id, seller_name, seller_price, seller_img_id, portfolio_id, location)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, seller_name, seller_price, seller_img_id, portfolio_id, location]
        );
        const newSeller = result.rows[0];
        res.status(201).send(newSeller);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getSellers(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM sellers`
        );
        res.status(201).send(result.rows);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getTopSellers(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM sellers
            WHERE rating_count <> 0
            ORDER BY (rating_total/rating_count) DESC`
        );
        res.status(201).send(result.rows);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getSellerById(req, res) {
    const {seller_id} = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM sellers
            WHERE seller_id = $1`,
            [seller_id]
        );
        const seller = result.rows[0];
        res.status(201).send(seller);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function editSeller(req, res) {
    const {seller_id, seller_name, seller_price, seller_img_id, portfolio_id, location} = req.body;

    try {
        const result = await pool.query(
            `UPDATE sellers SET
            seller_name = $2,
            seller_price = $3,
            seller_img_id = $4,
            portfolio_id = $5,
            location = $6
            WHERE seller_id = $1 RETURNING *`,
            [seller_id, seller_name, seller_price, seller_img_id, portfolio_id, location]
        );
        const seller = result.rows[0];
        res.status(201).send(seller);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function deleteSeller(req, res) {
    const {seller_id} = req.body;

    try {
        const result = await pool.query(
            `DELETE FROM sellers
            WHERE seller_id = $1`,
            [seller_id]
        );
        res.status(201).send({msg: "Seller deleted"});
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

module.exports = {
    registerSeller,
    getSellers,
    getTopSellers,
    getSellerById,
    editSeller,
    deleteSeller,
};