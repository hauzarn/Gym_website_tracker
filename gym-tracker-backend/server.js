// server.js
const fs = require('fs'); // Import fs to read files
const readline = require('readline'); // Import readline module
const express = require('express'); // Import Express framework
const { google } = require('googleapis'); // Import Google API
const multer = require('multer'); // Import multer to upload files
const path = require('path'); // Import path to id paths

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

// Check if token exists
fs.readFile('token.json', (err, token) => {
  if (err) {
    return getAccessToken(oAuth2Client); // If token is not present, prompt user to get it
  } else {
    oAuth2Client.setCredentials(JSON.parse(token)); // Set the credentials if token exists
    console.log('Token loaded from token.json');
  }
});

// Function to get access token
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFileSync('token.json', JSON.stringify(token));
      console.log('Token stored to token.json');
    });
  });
}

// Set up Google Drive API
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Route to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Gym Tracker App!</h1>');
});

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