const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { promisify } = require('util');


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("Coneect successfuly");
}).catch((error)=>{
console.log(error)
});

// Redis client setup




// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Models
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});

const URL = mongoose.model('URL', urlSchema);

// Routes
app.post('/shorten', async (req, res) => {
  const  originalUrl  = req.body.url;

  
  const shortUrl = generateShortUrl(); // Implement a function to generate short URL
  const url = new URL({ originalUrl, shortUrl });
  console.log(url)
  await url.save();
  res.json({ originalUrl, shortUrl });
});

app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  
    const url = await URL.findOne({ shortUrl });
    if (url) {
      // Cache the URL
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
  

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Utility functions for URL generation and caching
function generateShortUrl() {
  // Implement a function to generate a short URL
  return Math.random().toString(36).substr(2, 6);
}



