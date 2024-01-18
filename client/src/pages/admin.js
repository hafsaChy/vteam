import React from "react";
import ScooterMap from "./scootermap";

const Admin = ({ user, handleLogout }) => {
  return (
    <div>
      <div class="navbar">
        <h1>Logged in as {user.role}</h1>
        <hr></hr>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
      <ScooterMap />
    </div>
  );
};

export default Admin;
