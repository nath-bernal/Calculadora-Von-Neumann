import React, { useState } from 'react';
import ControlUnit from '../components/ControlUnit';
import Memory from '../components/Memory';
import ALU from '../components/ALU';
import { LuRefreshCw } from "react-icons/lu";
import { GrNext } from "react-icons/gr";
import '../css/Page.css';
import { Modal, Button } from 'react-bootstrap';

function SimulatorOne() {
    const [step, setStep] = useState(0);
    const [pc, setPc] = useState(0);
    const [direccion, setDireccion] = useState(0);
    const [datos, setDatos] = useState(0);
    const [instruccion, setInstruccion] = useState("");
    const [opCode, setOpCode] = useState("");
    const [aluValue, setAluValue] = useState(0);
    const [inputValue, setInputValue] = useState(0);
    const [cycle, setCycle] = useState(1);
    const [shouldContinue, setShouldContinue] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState([
        { dir: "0000", contenido: "00000100" },
        { dir: "0001", contenido: "00000101" },
        { dir: "0010", contenido: "01100111" },
        { dir: "0011", contenido: "01110000" },
        { dir: "0100", contenido: "00000101" },
        { dir: "0101", contenido: "00001011" },
        { dir: "0110", contenido: "00000000" },
        { dir: "0111", contenido: "00000000" }
    ]);

    function toBinary(number, bits) {
        return (number % (1 << bits)).toString(2).padStart(bits, "0");
    }

    function findDato(clave) {
        return (data.find(item => item.dir === toBinary(clave, 4))?.contenido || "")
    }

    const steps = () => {
        setStep(prevStep => prevStep + 1);

        switch (step) {
            case 0:
                setDireccion(pc);
                break;
            case 1:
                setPc(pc + 1);
                break;
            case 2:
                const nuevaInstruccion = findDato(direccion);
                setInstruccion(nuevaInstruccion);
                setOpCode(nuevaInstruccion.length >= 4 ? nuevaInstruccion.substring(0, 4) : "0000");

                if (cycle == 4) {
                    setStep(6);
                }
                break;
            case 3:
                const nuevaDireccion = instruccion.substring(4, 8);
                setDireccion(parseInt(nuevaDireccion, 2));
                const nuevosDatos = findDato(parseInt(nuevaDireccion, 2));
                setDatos(nuevosDatos);

                if (cycle == 3) {
                    setStep(5);
                }

                break
            case 4:
                setStep(0);
                if (cycle === 1) {
                    setInputValue(datos);
                    setAluValue(datos);
                    setCycle(2);
                } else if (cycle == 2) {
                    setInputValue(datos);
                    const valor1 = parseInt(aluValue, 2);
                    const valor2 = parseInt(datos, 2);

                    const resultado = (valor1 + valor2).toString(2).padStart(8, "0");

                    setAluValue(resultado);
                    setCycle(3);
                }
                break;
            case 5:
                const index = data.findIndex(item => item.dir === toBinary(direccion, 4));

                if (index !== -1) {
                    const newData = [...data];
                    newData[index] = { ...newData[index], contenido: aluValue };
                    setData(newData);
                }

                setCycle(4);
                setStep(0);
                break;
            case 6:
                if (shouldContinue) {
                    setStep(0);
                    setCycle(1);
                    setShouldContinue(false);
                } else {
                    return;
                }
                break;
        }
    };

    const reload = () => {
        window.location.reload();
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <>
            <h1 style={{ marginTop: '7%', textAlign: 'center', color: 'white' }}>Arquitectura de Jhon Von Neumann</h1>
            <div className='simulator-container'>
                <ControlUnit pc={toBinary(pc, 4)} instruction={instruccion} opCode={opCode} />
                <Memory data={data} number={toBinary(direccion, 4)} />
                <ALU aluValue={aluValue} inputValue={inputValue} />
                <div className="button-container">
                    <button className="btn btn-white p-2 m-2" onClick={() => shouldContinue && steps()}><GrNext size={25} /></button>
                    <button className="btn btn-white p-2 m-2" onClick={reload}><LuRefreshCw size={25} /></button>
                </div>
            </div>

            {/* Circular Button */}
            <button 
                className="btn btn-primary rounded-circle" 
                style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px' }} 
                onClick={handleShow}
            >
                +
            </button>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Pipelines</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{textAlign: 'center'}}><strong>(7+2)×(4+1)</strong></h5>
                <br/>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Ciclo</th>
                            <th>Fetch (Memoria → Unidad de Control)</th>
                            <th>Decode (Unidad de Control)</th>
                            <th>Execute (ALU)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Obtener (7+2)</td>
                            <td> ---- </td>
                            <td> ---- </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Obtener (4+1)</td>
                            <td>Decodificar (7+2)</td>
                            <td> ---- </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Obtener X</td>
                            <td>Decodificar (4+1)</td>
                            <td>Ejecutar (7+2)</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td> ---- </td>
                            <td>Decodificar X</td>
                            <td> Ejecutar (4+1)</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td> ---- </td>
                            <td> ---- </td>
                            <td>Ejecutar 9 × 5</td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default SimulatorOne;