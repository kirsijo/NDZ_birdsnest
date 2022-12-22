const express = require('express')
const app = express()
const axios = require('axios');
const xml2js = require('xml2js').parseStringPromise;

app.get('/', async (request, response) => {
    const data = await axios.get('https://assignments.reaktor.com/birdnest/drones')
    const parsedData = await xml2js(data.data);
    console.log(parsedData);
    response.send(parsedData);
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})