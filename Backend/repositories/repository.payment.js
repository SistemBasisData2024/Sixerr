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
    const {buyer_id, seller_id, order_details} = req.body;

    // Add Payment to Database
    try {
        const result = await pool.query(
            `INSERT INTO payments (buyer_id, seller_id, order_details)
            VALUES ($1, $2, $3) RETURNING *`,
            [buyer_id, seller_id, order_details]
        );
        const newPayment = result.rows[0];
        res.status(201).send(newPayment);
    } catch (error) {
        console.error('Error making payment:', error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getAllPayments(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM payments`
        );
        res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error getting all payments:', error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getPaymentByBuyer(req, res) {
    const { buyer_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT payments.*, sellers.seller_name
             FROM payments
             JOIN sellers ON payments.seller_id = sellers.seller_id
             WHERE payments.buyer_id = $1`,
            [buyer_id]
        );
        res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error getting payments by buyer:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}


async function getPaymentBySeller(req, res) {
    const { seller_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT payments.*, accounts.username AS buyer_name
             FROM payments
             JOIN accounts ON payments.buyer_id = accounts.user_id
             WHERE payments.seller_id = $1`,
            [seller_id]
        );
        res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error getting payments by seller:', error);
        res.status(500).send({ error: "Internal Server Error" });
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
        console.log(payment_id);
        res.status(200).send({msg: "Payment cancelled"});
    } catch (error) {
        console.error('Error cancelling payment:', error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function markPaymentDone(req, res) {
    const { payment_id } = req.body;

    try {
        await pool.query('BEGIN');

        const paymentResult = await pool.query(
            `SELECT * FROM payments WHERE payment_id = $1`,
            [payment_id]
        );

        if (paymentResult.rows.length === 0) {
            throw new Error('Payment not found');
        }

        const payment = paymentResult.rows[0];

        await pool.query(
            `UPDATE payments SET done = true WHERE payment_id = $1`,
            [payment_id]
        );

        const sellerResult = await pool.query(
            `SELECT seller_price FROM sellers WHERE seller_id = $1`,
            [payment.seller_id]
        );

        if (sellerResult.rows.length === 0) {
            throw new Error('Seller not found');
        }

        const sellerPrice = sellerResult.rows[0].seller_price;

        await pool.query(
            `UPDATE sellers SET earnings = earnings + $1 WHERE seller_id = $2`,
            [sellerPrice, payment.seller_id]
        );

        await pool.query('COMMIT');

        res.status(200).send({ msg: "Payment marked as done and earnings updated" });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error marking payment as done:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}


module.exports = {
    makePayment,
    getAllPayments,
    getPaymentByBuyer,
    getPaymentBySeller,
    cancelPayment,
    markPaymentDone,
};
