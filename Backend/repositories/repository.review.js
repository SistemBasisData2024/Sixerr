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
    console.log("💡 Review Connected to PostgreSQL database");
});

async function addReview(req, res) {
    const {buyer_id, seller_id, review, rating} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO reviews (buyer_id, seller_id, review, rating)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [buyer_id, seller_id, review, rating]
        );
        const newReview = result.rows[0];
        const updateRatingQuery = `
            UPDATE sellers
            SET rating_all = rating_all + $1,
            rating_count = rating_count + 1
            WHERE seller_id = $2
        `;
        await pool.query(updateRatingQuery, [rating, seller_id]);
        const updateRatingTotal = `
            UPDATE sellers
            SET rating_total = rating_all / rating_count
            WHERE seller_id = $1
        `;
        await pool.query(updateRatingTotal, [seller_id]);

        res.status(201).send(newReview);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getReviewBySeller(req, res) {
    const { seller_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT reviews.*, accounts.username AS buyer_name
            FROM reviews
            JOIN accounts ON reviews.buyer_id = accounts.user_id
            WHERE reviews.seller_id = $1`,
            [seller_id]
        );
        res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching reviews for seller:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function getReviewByBuyer(req, res) {
    const {buyer_id} = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM reviews
            WHERE buyer_id = $1`,
            [buyer_id]
        );
        res.status(201).send(result.rows);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getReviewByUser(req, res) {
    const { user_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT reviews.*, sellers.seller_name
            FROM reviews
            JOIN sellers ON reviews.seller_id = sellers.seller_id
            WHERE buyer_id = $1`,
            [user_id]
        );
        res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching reviews for buyer:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function editReview(req, res) {
    const {review_id, review, rating} = req.body;

    try {
        const { rows } = await pool.query(
            `SELECT * FROM reviews WHERE review_id = $1`,
            [review_id]
        );
        const oldReview = rows[0];
        if (!oldReview) {
            return res.status(404).send({error: "Review not found"});
        }
        const ratingDifference = rating - oldReview.rating;

        const result = await pool.query(
            `UPDATE reviews SET
            review = $2,
            rating = $3
            WHERE review_id = $1 RETURNING *`,
            [review_id, review, rating]
        );
        const updatedReview = result.rows[0];

        const updateRatingQuery = `
            UPDATE sellers
            SET rating_all = rating_all + $1
            WHERE seller_id = $2
        `;
        await pool.query(updateRatingQuery, [ratingDifference, oldReview.seller_id]);
        const updateRatingTotal = `
            UPDATE sellers
            SET rating_total = rating_all / rating_count
            WHERE seller_id = $1
        `;
        await pool.query(updateRatingTotal, [oldReview.seller_id]);

        res.status(201).send(updatedReview);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function deleteReview(req, res) {
    const {review_id} = req.body;

    try {
        const { rows } = await pool.query(
            `SELECT * FROM reviews WHERE review_id = $1`,
            [review_id]
        );
        const reviewToDelete = rows[0];
        if (!reviewToDelete) {
            return res.status(404).send({error: "Review not found"});
        }

        const result = await pool.query(
            `DELETE FROM reviews
            WHERE review_id = $1`,
            [review_id]
        );

        const updateRatingQuery = `
            UPDATE sellers
            SET rating_all = rating_all - $1,
            rating_count = rating_count - 1
            WHERE seller_id = $2
        `;
        await pool.query(updateRatingQuery, [reviewToDelete.rating, reviewToDelete.seller_id]);
        const updateRatingTotal = `
            UPDATE sellers
            SET rating_total = rating_all / rating_count
            WHERE seller_id = $1
        `;
        await pool.query(updateRatingTotal, [reviewToDelete.seller_id]);

        res.status(201).send({msg: "Review deleted"});
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getRecentReviews(req, res) {
    try {
        const result = await pool.query(`
            SELECT reviews.*, 
                   accounts.username AS buyer_name,
                   sellers.seller_name
            FROM reviews
            JOIN accounts ON reviews.buyer_id = accounts.user_id
            JOIN sellers ON reviews.seller_id = sellers.seller_id
            ORDER BY reviews.review_id DESC
            LIMIT 10
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching recent reviews:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}




module.exports = {
    addReview,
    getReviewByBuyer,
    getReviewBySeller,
    editReview,
    deleteReview,
    getRecentReviews,
    getReviewByUser,
};
