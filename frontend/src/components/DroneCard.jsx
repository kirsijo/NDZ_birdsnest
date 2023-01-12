import React from "react";
import { useState, useEffect } from "react";

const DroneCard = (props) => {
  const { distance, lastname, firstname, email, phonenumber } = props;

  console.log(distance);

  const classNames = ["dronecard"];

  if (distance > 50 && distance < 90) {
    classNames.push("50m");
  }
  if (distance > 90) {
    classNames.push("100m");
  }

  return (
    <>
      <div className={classNames.join("")}>
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
