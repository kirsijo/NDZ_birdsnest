import "./index.css";
import DroneCard from "./components/DroneCard";
import NoSightings from "./components/NoSightings";
import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const Url = process.env.REACT_APP_URL;

  useEffect(() => {
    const getDroneData = async () => {
      const { data } = await axios.get(Url).catch((err) => {
        console.log(err);
      });
      setData(data);
      setLoading(false);
    };
    getDroneData();
    const interval = setInterval(() => getDroneData(), 35000);
    return () => {
      clearInterval(interval);
    };
  }, [Url]);

  return (
    <div className="App">
      <div className="header">
        <header>
          <h1>NDZ - Operation Bird's Nest</h1>
        </header>
      </div>
      <p>Drone Sightings</p>
      <div className="drone-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((d) => (
            <DroneCard
              key={d.contact.pilotId}
              distance={d.distance}
              firstname={d.contact.firstName}
              lastname={d.contact.lastName}
              email={d.contact.email}
              phonenumber={d.contact.phoneNumber}
            />
          ))
        )}
      </div>
      <div>{data.length === 0 && <NoSightings />}</div>
    </div>
  );
};

export default App;
