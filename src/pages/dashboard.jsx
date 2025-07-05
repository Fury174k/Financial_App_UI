import { useState, useEffect } from "react";
import React from "react";


function Dashboard() {
  return (
    <div className="dashboard">
       <div className="sidebar">
        <div className="logo"></div>
        <div className="dashboard-items"></div>
       </div>
       <div className="content">
        <div className="navbar">
        <div className="welcome">

        </div>
        <div className="nav-items"></div>
        </div>
        <div className="main">
            <div className="top-balance"></div>
            <div className="savings"></div>
            <div className="income"></div>
            <div className="expenses"></div>
            <div className="transaction-history"></div>
            <div className="reports"></div>
            <div className="budget"></div>
        </div>
       </div>
    </div>
);
}


export default Dashboard;