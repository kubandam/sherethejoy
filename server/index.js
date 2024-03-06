const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());


const baseDirectory = 'uploads';
if (!fs.existsSync(baseDirectory)) {
  fs.mkdirSync(baseDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const token = req.params.token;
    const dest = path.join(baseDirectory, token);
    fs.mkdirSync(dest, { recursive: true }); // Ensure the directory exists
    cb(null, dest);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/sherethejoy', { useNewUrlParser: true, useUnifiedTopology: true });

const Collection = require('./models/Collection'); // Assuming you have a User model

const generateRandomString = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.post('/collection/new',async(req,res)=>{
  try {
    const newCollection = new Collection(req.body);
    newCollection.token = generateRandomString();
    await newCollection.save();
    res.status(201).json({ message: 'Collection created successfully', token: newCollection.token });
  } catch (error) {
    res.status(500).send(error.message);
  }
})

app.get('/collection/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const collection = await Collection.findOne({ token: token });
    if (collection) {
      res.json({ message: 'Collection found', collection: collection });
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/collection/verify', async (req, res) => {
  try {
    const collection = await Collection.findOne({ email: req.body.email,password: req.body.password });
    if (collection){ //&& bcrypt.compareSync(req.body.password, collection.password)) {
      res.json({ token: collection.token });
    } else {
      res.status(401).json({ message: 'Incorrect email or password.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/collection/:token/upload', upload.array('files'), async (req, res) => {
  try {
    let filePaths = req.files.map(file => {
      return `/uploads/${req.params.token}/${file.filename}`;
    });
    console.log('Uploaded file paths:', filePaths);
    res.send({ message: 'Files uploaded successfully', filePaths: filePaths });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading files', error: error.toString() });
  }
});

app.listen(8080, '0.0.0.0', () => console.log(`Server is listening on port 8080`));
