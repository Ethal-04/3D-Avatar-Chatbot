const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Setup multer for image upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// AvatarSDK integration for avatar generation from image
const axios = require('axios');

app.post('/api/generate-avatar', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    // Replace with your AvatarSDK API key
    const AVATARSDK_API_KEY = 'YOUR_AVATARS_DK_API_KEY';

    // Upload image to AvatarSDK and create avatar
    const formData = new FormData();
    formData.append('photo', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Step 1: Upload photo
    const uploadResponse = await axios.post('https://api.avatarsdk.com/avatars', formData, {
      headers: {
        'Authorization': `Bearer ${AVATARSDK_API_KEY}`,
        ...formData.getHeaders(),
      },
    });

    const avatarId = uploadResponse.data.id;

    // Step 2: Get avatar model URL (assuming GLB format)
    const avatarModelUrl = `https://api.avatarsdk.com/avatars/${avatarId}/model.glb`;

    res.json({ avatarUrl: avatarModelUrl });
  } catch (error) {
    console.error('AvatarSDK API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate avatar' });
  }
});

// Placeholder endpoint for chatbot conversation
app.post('/api/chat', (req, res) => {
  const { message, personaDescription } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  // TODO: Integrate AI chatbot logic here using personaDescription
  // For now, respond with a canned message
  res.json({ reply: "Hello! This is a placeholder response from your avatar's AI chatbot." });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
