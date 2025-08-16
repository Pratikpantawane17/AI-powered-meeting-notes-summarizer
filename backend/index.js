const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const multer = require('multer');
const { generateAiResponse } = require('./generateAiResponse');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed!'), false);
    }
  }
});


app.post('/api/generate-summary', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Read the uploaded file
    const filePath = path.join(__dirname, file.path);
    const transcriptContent = fs.readFileSync(filePath, 'utf8');

    
    const aiPrompt = `
Please analyze the following meeting transcript and create a summary based on these instructions: "${prompt}"

Meeting Transcript:
${transcriptContent}

Please format your response in Markdown with appropriate headings, bullet points, and formatting.
`;


    const summary = await generateAiResponse(aiPrompt);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ 
      success: true, 
      summary: summary 
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Clean up file if it exists
    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
});


// Route to send email
app.post('/api/send-email', async (req, res) => {
  try {
    const { emails, summary } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'No email addresses provided' });
    }

    if (!summary) {
      return res.status(400).json({ error: 'No summary provided' });
    }

    // Convert markdown to HTML
    const htmlSummary = summary
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');

    const msg = {
      to: emails, // array of recipients
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: 'Meeting Summary - AI Generated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Meeting Summary
          </h2>
          <div style="line-height: 1.6; color: #555;">
            ${htmlSummary}
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888; text-align: center;">
            This summary was generated automatically using AI technology.
          </p>
        </div>
      `
    };

    await sgMail.sendMultiple(msg); // send to multiple recipients

    res.json({
      success: true,
      message: 'Email sent successfully',
      recipients: emails
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
});


// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);

});

module.exports = app;