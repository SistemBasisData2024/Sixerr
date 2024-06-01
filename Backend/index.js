require("dotenv").config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const accountRepo = require('./repositories/repository.account');
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


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//Endpoint
app.get('/status', (req, res) => {
    res.status(200).send({ status: "Server is running" });
});
app.post('/register', accountRepo.registerAccount);
app.post('/login', accountRepo.loginAccount);

app.post('/uploadFile', upload.single('file'), googleRepo.uploadFile);
app.delete('/deleteFile', googleRepo.deleteFile);


app.listen(port, () => {
    console.log("🚀 Server is running and listening on port", port);
});