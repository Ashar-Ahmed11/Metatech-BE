const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const cors = require('cors')
const connectToMongo = require('./db')
connectToMongo()
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles: true
}));
app.use(express.json())
app.use(cors({ origin: true }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/post'))
app.use('/api/portfolio', require('./routes/portfolio'))  // ← NEW LINE

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})