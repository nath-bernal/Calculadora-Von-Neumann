import React from "react";
import { Card } from "react-bootstrap";
import '../css/cardStyles.css';

const Memory = ({ data, number, highlightedDir, highlightedData }) => {

    const contenidoActual = data.find(item => item.dir === number)?.contenido || "";

    return (
        <Card className="cardp">
            <Card.Body>
                <Card.Title className="fs-4 fw-bold pb-3">Memoria</Card.Title>
                <Card.Text>
                    <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
                        <div className="text-center">
                            <p className="m-0"><strong>Direcciones</strong></p>
                            <div className={`border text-center p-2 ${number === highlightedDir ? "highlight" : ""}`}
                                style={{ width: "100px", height: "40px" }}>
                                {number || "----"}
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="m-0"><strong>Datos</strong></p>
                            <div className={`border text-center p-2 ${contenidoActual === highlightedData ? "highlight" : ""}`}
                                style={{ width: "100px", height: "40px" }}>
                                {contenidoActual || "----"}
                            </div>
                        </div>
                    </div>
                    <table className="table table-sm table-bordered text-center">
                        <thead className="thead-light">
                            <tr>
                                <th>Dir</th>
                                <th>Contenido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className={item.dir === highlightedDir ? "highlight" : ""}>
                                    <td>{item.dir}</td>
                                    <td>{item.contenido}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Memory;