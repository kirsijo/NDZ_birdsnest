import "./App.css";
import DroneCard from "./components/DroneCard";
import axios from "axios";

const App = () => {
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
