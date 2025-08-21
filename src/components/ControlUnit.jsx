import React from "react";
import { Card } from "react-bootstrap";
import { FaPlus, FaEquals, FaPowerOff, FaDatabase } from "react-icons/fa";
import { MdHourglassTop } from "react-icons/md";
import '../css/cardStyles.css';

const iconMap = {
    "0000": FaPlus, // Suma
    "0110": FaDatabase,  // Carga  
    "0111": FaPowerOff,  // Apagado
};

const InfoBox = ({ opCode }) => {
    const Icon = iconMap[opCode] || MdHourglassTop;

    return (
        <div
            className="d-flex justify-content-center align-items-center border"
            style={{
                width: "80px",
                height: "80px",
                margin: "10px auto",
            }}
        >
            <Icon size={40} />
        </div>
    );
};

function ControlUnit({ pc, instruction, opCode, highlighted }) {
    return (
        <Card className="cardp">
            <Card.Body>
                <Card.Title className="fs-4 fw-bold pb-3">Unidad de Control</Card.Title>
                {/* <p><strong>Decodificador</strong></p>
                <InfoBox opCode={opCode} /> */}
                <Card.Text className="d-flex flex-column align-items-center">
                    <p><strong>Contador</strong></p>
                    <div className={`border p-2 text-center w-75 mb-3 ${pc === highlighted ? "highlight" : ""}`} style={{ height: "40px" }}>
                        {pc}
                    </div>
                    <p><strong>Registro de instrucciones</strong></p>
                    <div className="border p-2 text-center w-75 mb-3" style={{ height: "40px" }}>{instruction}</div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default ControlUnit;