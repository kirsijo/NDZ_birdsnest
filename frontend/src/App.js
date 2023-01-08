import "./App.css";
import DroneCard from "./components/DroneCard";
import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDroneData = async () => {
    const { data } = await axios.get("http://localhost:3001/").catch((err) => {
      console.log(err);
    });
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    getDroneData();
  }, []);

  console.log(data);

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
    </div>
  );
};

export default App;
