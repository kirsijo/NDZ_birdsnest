const express = require("express");
const app = express();
const axios = require("axios");
const xml2js = require("xml2js").parseStringPromise;

app.get("/", async (request, response) => {
  const data = await axios.get(
    "https://assignments.reaktor.com/birdnest/drones"
  );
  const parsedData = await xml2js(data.data);
  const drones = parsedData.report.capture[0].drone;
  const XYdifferenceFromCenter = drones.map((drone) => {
    const yDifference = Math.abs(250000 - drone.positionY);
    const xDifference = Math.abs(250000 - drone.positionX);
    const getHypotenuse = (sideA, sideB) => {
      return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    };
    console.log("this should work", getHypotenuse(xDifference, yDifference));
    if (yDifference > 100000 || xDifference > 100000) {
      return drone;
    }
    console.log("Ydifference", yDifference);
    console.log("Xdifference", xDifference);
  });

  const NDZviolators = XYdifferenceFromCenter.filter(
    (drone) => drone !== undefined
  );

  console.log("XYDifference map :", XYdifferenceFromCenter);
  console.log("NDZviolators,", NDZviolators);
  response.send(NDZviolators);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
