const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { file } = require('googleapis/build/src/apis/file');

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
    const {name, mimeType, dir, file} = req.body;
    const filePath = path.join(dir, file);

    try {
        const result = await drive.files.create({
            requestBody: {
                name: name,
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
        });
        res.status(201).send(result.data);
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