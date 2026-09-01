import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
    cors({
        origin: allowedOrigin
    })
)

app.use(express.json())

app.get('/api/images', async (req, res) => {
    try {
        const images = await prisma.image.findMany({
            select: {
                id: true,
                title: true,
                imageUrl: true
            }
        })
        res.json(images)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching images' });
    }
})

app.get('/api/game/:imageId/start', async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        characters: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Prisma Error:', error);
    res.status(500).json({ error: 'Error starting the game' });
  }
});

app.post('/api/game/validate', async (req, res) => {
    try {
        const { characterId, xPercent, yPercent } = req.body

        const character = await prisma.character.findUnique({
            where: { id: characterId },
        });

        if (!character) return res.status(404).json({ error: 'Character not found' });

        const isCorrect = xPercent >= character.xMin && xPercent <= character.xMax &&
                          yPercent >= character.yMin && yPercent <= character.yMax;

        res.json({ correct: isCorrect, characterId });
    } catch (error) {
        res.status(500).json({ error: 'Error during validation' });
    }
})


app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, username, timeInSeconds, imageId } = req.body;
    const playerName = name || username;

    if (!playerName || timeInSeconds === undefined || !imageId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedTime = Number(timeInSeconds);
    if (isNaN(parsedTime)) {
      return res.status(400).json({ error: 'Invalid time' });
    }

    const score = await prisma.score.create({
      data: {
        username: String(playerName).trim(),
        timeInSeconds: parsedTime,
        imageId: String(imageId),
      },
    });

    console.log('Score saved successfully:', score);
    res.json(score);
  } catch (error) {
    console.error('Prisma error in POST /api/leaderboard:', error);
    res.status(500).json({ error: error.message || 'Error writing to database' });
  }
});

app.get('/api/leaderboard/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: 'Missing imageId' });
    }

    const scores = await prisma.score.findMany({
      where: { imageId: String(imageId) },
      orderBy: { timeInSeconds: 'asc' },
      take: 10,
    });

    res.json(scores);
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error);
    res.status(500).json({ error: 'Server error fetching the leaderboard' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));