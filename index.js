const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://taskmanagement:d7npvOhTNuLMQ3LE@cluster0.tdvw5wt.mongodb.net/taskMng?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');

  const userwisetask = mongoose.model('task', new mongoose.Schema({}, { strict: false }));

});

app.get('/', (req, res) => {
  res.send('task on the way');
});

app.listen(port, () => {
  console.log(`Task Server is running on port ${port}`);
});