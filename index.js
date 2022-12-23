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
  const NDZviolators = drones.filter(
    (drone) => drone.positionY[0] > 150000 && drone.positionY[0] < 350000
  );
  console.log(parsedData);
  console.log(drones);
  response.send(NDZviolators);
});

// {"report":{"deviceInformation":[{"$":{"deviceId":"GUARDB1RD"},"listenRange":["500000"],"deviceStarted":["2022-12-22T11:00:35.166Z"],"uptimeSeconds":["18859"],"updateIntervalMs":["2000"]}],"capture":[{"$":{"snapshotTimestamp":"2022-12-22T16:14:53.890Z"},"drone":[{"serialNumber":["SN-XTOOE3JBDS"],"model":["Falcon"],"manufacturer":["MegaBuzzer Corp"],"mac":["96:29:ec:80:75:40"],"ipv4":["225.70.11.21"],"ipv6":["7e63:42da:b27f:ae29:c5e4:6a07:9874:bcf7"],"firmware":["2.1.5"],"positionY":["299932.35980180063"],"positionX":["365750.5012276276"],"altitude":["4910.114028309655"]},{"serialNumber":["SN-a_eRd8Dc1M"],"model":["Falcon"],"manufacturer":["MegaBuzzer Corp"],"mac":["0c:bc:2a:67:69:45"],"ipv4":["233.52.6.186"],"ipv6":["746b:9373:16c0:1823:ea62:7945:a5f9:10e0"],"firmware":["8.3.0"],"positionY":["252404.7212733"],"positionX":["178359.20902348738"],"altitude":["4231.479486342058"]},{"serialNumber":["SN-LP-FI208O9"],"model":["Altitude X"],"manufacturer":["DroneGoat Inc"],"mac":["86:cb:c4:3b:9f:fa"],"ipv4":["35.36.207.133"],"ipv6":["9edc:3f05:bca4:0585:5001:e954:0f3f:3e97"],"firmware":["3.9.9"],"positionY":["246595.0186260107"],"positionX":["227407.46204823014"],"altitude":["4183.406470948901"]}]}]}}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
