const express = require("express");
const app = express();
const axios = require("axios");
const xml2js = require("xml2js").parseStringPromise;

const droneDistance = [];
const contactDetails = [];

app.get("/", async (request, response) => {
  const data = await axios.get(
    "https://assignments.reaktor.com/birdnest/drones"
  );
  const parsedData = await xml2js(data.data);
  const drones = parsedData.report.capture[0].drone;
  const dronesWithinNDZ = drones.map((drone) => {
    const yDifference = Math.abs(250000 - drone.positionY);
    const xDifference = Math.abs(250000 - drone.positionX);
    const getHypotenuse = (sideA, sideB) => {
      return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    };
    const distance = getHypotenuse(xDifference, yDifference);
    const distanceInMeters = (distance / 1000).toFixed(2);
    if (distance < 100000) {
      const singleViolator = {
        distanceInMeters: distanceInMeters,
        time: parsedData.report.capture[0]["$"].snapshotTimestamp,
      };
      droneDistance.push(singleViolator);
      return drone;
    }
  });

  const NDZviolators = dronesWithinNDZ.filter((drone) => drone !== undefined);

  const serialNumbers = NDZviolators.map((e) => {
    return e.serialNumber[0];
  });

  const NDZviolatorsContact = await Promise.all(
    serialNumbers.map(async (serialNumber) => {
      const response = await axios.get(
        `https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
      );
      const contact = response.data;
      contactDetails.push(contact);
      return data;
    })
  );

  const violators = droneDistance.map((drone, index) => {
    return {
      distance: drone.distanceInMeters,
      time: drone.time,
      contact: contactDetails[index],
    };
  });

  const violatorsWithin10Minutes = violators.filter((violator) => {
    const timeNow = new Date();
    const MSperMinute = 60000;
    const tenMinsago = new Date(timeNow - 10 * MSperMinute);
    const formatViolatorDate = new Date(violator.time);
    if (formatViolatorDate > tenMinsago) {
      return violator;
    }
  });

  const dronesSortedByDistance = violatorsWithin10Minutes.sort(
    (a, b) => a.distance - b.distance
  );

  const droneData = dronesSortedByDistance.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (item) => item.contact.pilotId === current.contact.pilotId
      )
    ) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  response.send(droneData);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
