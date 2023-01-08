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
  console.log(parsedData.report.capture);
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
  console.log("serialNumbers", serialNumbers);
  const violators = droneDistance.map((drone, index) => {
    return {
      distance: drone.distanceInMeters,
      time: drone.time,
      contact: contactDetails[index],
    };
  });

  console.log(violators);

  const violatorsWithin10Minutes = violators.filter((violator) => {
    const timeNow = new Date();
    const MSperMinute = 60000;
    const tenMinsago = new Date(timeNow - 10 * MSperMinute);
    console.log("ten mins ago", tenMinsago);
    const formatViolatorDate = new Date(violator.time);
    if (formatViolatorDate > tenMinsago) {
      return violator;
    }
  });

  console.log(violatorsWithin10Minutes);

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

  console.log("by distance", dronesSortedByDistance);
  console.log("final data", droneData);

  response.send(droneData);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const testData = [
  {
    distance: "6.78",
    time: "2023-01-08T13:18:51.077Z",
    contact: {
      pilotId: "P-kF9jPK4vbn",
      firstName: "Brooks",
      lastName: "Hermann",
      phoneNumber: "+210942978606",
      createdDt: "2022-12-07T06:29:50.389Z",
      email: "brooks.hermann@example.com",
    },
  },
  {
    distance: "22.43",
    time: "2023-01-08T13:13:20.269Z",
    contact: {
      pilotId: "P-ASQhuo6Z-Y",
      firstName: "Russel",
      lastName: "Gusikowski",
      phoneNumber: "+210561472709",
      createdDt: "2022-04-12T13:05:22.809Z",
      email: "russel.gusikowski@example.com",
    },
  },
  {
    distance: "48.20",
    time: "2023-01-08T13:18:51.077Z",
    contact: {
      pilotId: "P-L--BfkHYgv",
      firstName: "Odessa",
      lastName: "McLaughlin",
      phoneNumber: "+210745941911",
      createdDt: "2022-05-28T02:37:40.973Z",
      email: "odessa.mclaughlin@example.com",
    },
  },
  {
    distance: "52.04",
    time: "2023-01-08T13:15:50.390Z",
    contact: {
      pilotId: "P-AC03TjBCp1",
      firstName: "Fredrick",
      lastName: "Pouros",
      phoneNumber: "+210876871418",
      createdDt: "2022-03-24T16:50:50.048Z",
      email: "fredrick.pouros@example.com",
    },
  },
  {
    distance: "58.26",
    time: "2023-01-08T13:11:14.155Z",
    contact: {
      pilotId: "P-m_HMbv1plo",
      firstName: "Juvenal",
      lastName: "Wiegand",
      phoneNumber: "+210244038680",
      createdDt: "2022-07-08T03:55:28.213Z",
      email: "juvenal.wiegand@example.com",
    },
  },
  {
    distance: "60.26",
    time: "2023-01-08T13:11:14.155Z",
    contact: {
      pilotId: "P-m_HMbv1plo",
      firstName: "Juvenal",
      lastName: "Wiegand",
      phoneNumber: "+210244038680",
      createdDt: "2022-07-08T03:55:28.213Z",
      email: "juvenal.wiegand@example.com",
    },
  },
];
