import React, { useState } from "react";
import { MdLooksOne, MdLooksTwo } from "react-icons/md";
import SimulatorOne from "../pages/SimulatorOne";
import SimulatorTwo from "../pages/SimulatorTwo";
import "../css/Tabs.css";

export function Tabs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        {/*<div className="tabs-container">
            <div className="tabs-header">
                <button
                    className={`tab-button ${activeTab === 0 ? "active" : ""}`}
                    onClick={() => setActiveTab(0)}
                >
                    <MdLooksOne size={24} />
                    Simulador 1
                </button>
                <button
                    className={`tab-button ${activeTab === 1 ? "active" : ""}`}
                    onClick={() => setActiveTab(1)}
                >
                    <MdLooksTwo size={24} />
                    Simulador 2
                </button>
            </div>
            <div className="tabs-content">
                {activeTab === 0 && <SimulatorOne />}
                {activeTab === 1 && <SimulatorTwo />}
            </div>
        </div>*/}
    );
}