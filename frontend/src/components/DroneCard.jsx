import React from "react";

const DroneCard = (props) => {
  const { distance, lastname, firstname, email, phonenumber } = props;
  return (
    <>
      <div className="dronecard">
        <p>
          {firstname} {lastname}
        </p>
        <p>{distance} m</p>
        <p>{email}</p>
        <p>{phonenumber}</p>
      </div>
    </>
  );
};

export default DroneCard;
