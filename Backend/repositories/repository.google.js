const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const FOLDER_ID = process.env.FOLDER_ID;

const oauth2client = new google.auth.OAuth2 (
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2client,
})

async function uploadFile(req, res) {
    const file = req.file;
    console.log(req.file);
    const directory = path.resolve(__dirname, '..');
    const filePath = path.join(`${directory}/uploads`, file.filename);

    try {
        // upload image to gdrive
        const result = await drive.files.create({
            requestBody: {
                name: file.originalname,
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: file.mimeType,
                body: fs.createReadStream(filePath),
            },
        });
        fs.unlinkSync(filePath); // delete temp file in server
        res.status(201).send(result.data);
        return result.data;
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function deleteFile(req, res) {
    const {fileId} = req.body;

    try {
        const result = await drive.files.delete({
            fileId: fileId,
        });
        res.status(201).send(result.data);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
}

module.exports = {
    uploadFile,
    deleteFile,
};