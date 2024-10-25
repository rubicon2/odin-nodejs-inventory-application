import express from 'express';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// If no prior routes have been matched, show 404.
app.use((req, res) => {
  res.status(404).send('404: page not found.');
});

// Error handling.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('An internal server error has occurred.');
});

app.listen(PORT, () => console.log('Server listening on port', PORT));
