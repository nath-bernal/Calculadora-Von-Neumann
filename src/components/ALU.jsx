import React from "react";
import { Card } from "react-bootstrap";
import '../css/cardStyles.css';

const ALU = ({ aluValue, inputValue, highlighted }) => {
    return (
        <Card className="cardp">
            <Card.Body>
                <Card.Title className="fs-4 fw-bold pb-3">Unidad Aritmético-Lógica (ALU)</Card.Title>
                <Card.Text className="d-flex flex-column gap-2 mt-3 justify-content-center align-items-center">
                    <p className="m-2"><strong>Acumulador</strong></p>
                    <div className={`border text-center pb-4 w-75 ${aluValue === highlighted ? "highlight" : ""}`} style={{ height: "40px" }}>
                        {aluValue}
                    </div>
                    <p className="m-2"><strong>Registro de entrada</strong></p>
                    <div className="border text-center pb-4 w-75" style={{ height: "40px" }}>
                        {inputValue}
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ALU;