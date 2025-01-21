require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port : ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed !!", err)
})