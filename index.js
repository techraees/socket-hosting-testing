// server.mjs

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { readFile } from 'fs/promises';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Serve static files (HTML, CSS, etc.) from the 'public' directory
app.use(express.static('public'));

// Route for serving the HTML file containing the quiz
app.get('/quiz', async (req, res) => {
  try {
    const html = await readFile('public/quiz.html', 'utf-8');
    res.send(html);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Event handler when a client connects
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example of sending a quiz question to the client
  const question = {
    text: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswer: 'Paris'
  };

  // Send the question to the client
  socket.emit('question', question);

  // Event handler for when a client submits an answer
  socket.on('answer', (answer) => {
    console.log('Received answer:', answer);
    // Handle the answer
    // Here you can check if the answer is correct and emit appropriate events
  });

  // Event handler when a client disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
