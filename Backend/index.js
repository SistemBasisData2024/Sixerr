require("dotenv").config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const accountRepo = require('./repositories/repository.account');
const sellerRepo = require('./repositories/repository.seller');
const paymentRepo = require('./repositories/repository.payment');
const reviewRepo = require('./repositories/repository.review');
const googleRepo = require('./repositories/repository.google');

const port = process.env.port;
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage }); // directory for temp files


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Endpoints
app.get('/status', (req, res) => {
    res.status(200).send({ status: "Server is running" });
});

// accounts
app.post('/register', accountRepo.registerAccount);
app.post('/login', accountRepo.loginAccount);
app.get('/getAccounts', accountRepo.getAccounts);
app.get('/getAccountById', accountRepo.getAccountById);
app.put('/editAccount', accountRepo.editAccount);
app.delete('/deleteAccount', accountRepo.deleteAccount);

// sellers
app.post('/registerSeller', sellerRepo.registerSeller);
app.get('/getSellers', sellerRepo.getSellers);
app.get('/getTopSellers', sellerRepo.getTopSellers);
app.get('/getSellerById', sellerRepo.getSellerById);
app.put('/editSeller', sellerRepo.editSeller);
app.delete('/deleteSeller', sellerRepo.deleteSeller);
app.get('/searchSellers', sellerRepo.searchSellers);

// payments
app.post('/makePayment', paymentRepo.makePayment);
app.get('/getPayments', paymentRepo.getAllPayments);
app.get('/getPaymentByBuyer', paymentRepo.getPaymentByBuyer);
app.get('/getPaymentBySeller', paymentRepo.getPaymentBySeller);
app.delete('/cancelPayment', paymentRepo.cancelPayment);
app.put('/markPaymentDone', paymentRepo.markPaymentDone);

//reviews
app.post('/addReview', reviewRepo.addReview);
app.get('/getReviewByBuyer', reviewRepo.getReviewByBuyer);
app.get('/getReviewBySeller', reviewRepo.getReviewBySeller);
app.put('/editReview', reviewRepo.editReview);
app.delete('/deleteReview', reviewRepo.deleteReview);
app.get('/getReviews', reviewRepo.getRecentReviews);
app.get('/getReviewByUser', reviewRepo.getReviewByUser);

// google
app.post('/uploadFile', upload.single('file'), googleRepo.uploadFile);
app.delete('/deleteFile', googleRepo.deleteFile);


app.listen(port, () => {
    console.log("🚀 Server is running and listening on port", port);
});