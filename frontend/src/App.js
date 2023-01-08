import "./App.css";
import DroneCard from "./components/DroneCard";
import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);

  const getDroneData = async () => {
    const { data } = await axios.get("http://localhost:3001/").catch((err) => {
      console.log(err);
    });
    setData(data);
  };

  useEffect(() => {
    getDroneData();
  }, []);

  console.log(data);

  return (
    <div className="App">
      <div className="header">
        <header>NDZ - Operation Bird's Nest</header>
      </div>
      <p>Drone Sightings</p>
      <div className="drone-container"></div>
    </div>
  );
};

export default App;
