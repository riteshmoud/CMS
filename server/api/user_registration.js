const express = require('express')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 3500

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${PORT}`);
})