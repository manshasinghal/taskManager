const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());




const userRouter = require('./router/Userroute');
app.use('/api', userRouter);

const taskRouter = require('./router/taskRouter');
app.use('/api',taskRouter )





app.listen(5000, () => console.log('Server running on port 5000'));