// server.js
const fs = require('fs');
const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5500;

// Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the storage location for uploaded files using multer
const upload = multer({ dest: 'uploads/' });

// Load credentials.json
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// Load the web app credentials
const { client_secret, client_id, redirect_uris } = credentials.web;

// Set up OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uris[0],
  'http://localhost:5500' // using port 5500 for testing 
);

// Set up Google Drive API
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Route to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

  // Upload file to Google Drive
  const fileMetadata = {
    name: req.file.originalname,
    parents: ['Gym_tracker_data'] // To a specific folder in my Google drive
    
  };

  const media = {
    mimeType: 'text/csv',
    body: fs.createReadStream(filePath),
  };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    (err, file) => {
      if (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file to Google Drive');
      } else {
        console.log('File uploaded successfully:', file.data.id);
        res.status(200).send('File uploaded successfully');
      }
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});