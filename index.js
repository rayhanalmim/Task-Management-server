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

const taskData = {
    tasks: [
    ],
    columns: {
        "column-1": {
            id: "column-1",
            title: "TO-DO",
            taskIds: [],
        },
        "column-2": {
            id: "column-2",
            title: "IN-PROGRESS",
            taskIds: [],
        },
        "column-3": {
            id: "column-3",
            title: "COMPLETED",
            taskIds: [],
        },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
};

db.once('open', () => {
  console.log('Connected to MongoDB');

  const userwisetask = mongoose.model('task', new mongoose.Schema({}, { strict: false }));

  app.post('/createtaskschema', async (req, res) =>{
    const email = req.query.email;
    const result = await userwisetask.find({ email: email })
    if(result.length){
        return res.send({message: 'user schema already exists'});
    }
    if(email === 'undefined'){
        return res.send({message: 'no valid user'});
    }
    const newSchema = {...taskData, email: email }
    console.log(newSchema)
    const insert = await userwisetask.create(newSchema);
    res.send(insert);
  });

  app.get('/taskdata', async(req, res)=>{
    const email = req.query.email;
    const result = await userwisetask.find({ email: email })
    res.send(result)
  })

  app.post('/createTask', async (req, res)=>{
    const data = req.body;
    const email = req.query.user;
    console.log(data, email)
    const task = await userwisetask.find({ email: email })
    console.log(task)
    const createId = task[0].tasks.length;
    console.log(createId)

    const newData = {...data, id: createId}

    const update = await userwisetask.updateOne(
      { email: email },
      {
        $push: { tasks: newData, 'columns.column-1.taskIds': createId },
      },
    );

    res.send(update)
  })

});

app.get('/', (req, res) => {
  res.send('task on the way');
});

app.listen(port, () => {
  console.log(`Task Server is running on port ${port}`);
});