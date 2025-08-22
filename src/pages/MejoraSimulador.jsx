import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function numberToBinaryWithNBits(number, n) {
    return number.toString(2).padStart(n, '0').slice(-n);
}

// Memoria inicial
const memoriaInicial = [
    [0, 4], // 0000
    [0, 5], // 0001
    [2, 6], // 0010
    [3, 0], // 0011
    [0, 5], // 0100
    [0, 6], // 0101
    [0, 0], // 0110
    [0, 0], // 0111
];

function MejoraSimulador() {
    // Estados principales
    const [memoria, setMemoria] = useState([...memoriaInicial]);
    const [contador, setContador] = useState(0);
    const [paso, setPaso] = useState(0);
    const [registroDirecciones, setRegistroDirecciones] = useState(0);
    const [registroDatos, setRegistroDatos] = useState([0, 0]);
    const [instruccionActual, setInstruccionActual] = useState([0, 0]);
    const [acumulador, setAcumulador] = useState(0);
    const [entrada, setEntrada] = useState(0);
    const [destacados, setDestacados] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);


    const pasos = [
        // 0: registroDirecciones = contador; destacar contador-programa y registro-direcciones
        () => {
            setRegistroDirecciones(contador);
            setDestacados(['contador-programa', 'registro-direcciones']);
        },
        // 1: contador++; destacar contador-programa
        () => {
            setContador(c => c + 1);
            setDestacados(['contador-programa']);
        },
        // 2: registroDatos = memoria[registroDirecciones]; destacar registro-direcciones, registro-datos, memoria-X
        () => {
            setRegistroDatos(memoria[registroDirecciones] || [0, 0]);
            setDestacados(['registro-direcciones', 'registro-datos', `memoria-${registroDirecciones}`]);
        },
        // 3: instruccionActual = registroDatos; destacar registro-datos, registro-instrucciones
        () => {
            setInstruccionActual(registroDatos);
            setDestacados(['registro-datos', 'registro-instrucciones']);
        },
        // 4: registroDirecciones = instruccionActual[1]; destacar registro-instrucciones, registro-direcciones
        () => {
            setRegistroDirecciones(instruccionActual[1]);
            setDestacados(['registro-instrucciones', 'registro-direcciones']);
        },
        // 5: registroDatos = memoria[registroDirecciones]; destacar registro-direcciones, registro-datos, memoria-X
        () => {
            setRegistroDatos(memoria[registroDirecciones] || [0, 0]);
            setDestacados(['registro-direcciones', 'registro-datos', `memoria-${registroDirecciones}`]);
        },
        // 6: entrada = registroDatos[1]; destacar registro-datos, registro-entrada
        () => {
            setEntrada(registroDatos[1]);
            setDestacados(['registro-datos', 'registro-entrada']);
        },
        // 7: ejecutar operación; destacar acumulador y registro-entrada
        () => {
            let operacion = instruccionActual[0];
            let nuevoAcumulador = acumulador;
            let nuevaMemoria = [...memoria];
            if (operacion === 0) {
                nuevoAcumulador += entrada;
            } else if (operacion === 1) {
                nuevoAcumulador -= entrada;
            } else if (operacion === 2) {
                nuevaMemoria[7] = [0, nuevoAcumulador];
                setDestacados(['memoria-7']);
            }
            setAcumulador(nuevoAcumulador);
            setMemoria(nuevaMemoria);
            setDestacados(['acumulador', 'registro-entrada']);
        }
    ];

    // Control de pasos
    const continuar = () => {
        if (paso < pasos.length && contador < 4) {
            pasos[paso]();
            setPaso(paso + 1);
        } else {
            setPaso(0);
            setDestacados([]);
        }
    };

    const reiniciar = () => {
        setMemoria([...memoriaInicial]);
        setContador(0);
        setPaso(0);
        setRegistroDirecciones(0);
        setRegistroDatos([0, 0]);
        setInstruccionActual([0, 0]);
        setAcumulador(0);
        setEntrada(0);
        setDestacados([]);
    };

    // Utilidad para destacar
    const getHighlight = (key) => destacados.includes(key) ? {
        boxShadow: '0 0 0 3px #eae70eff',
        background: '#fffde7'
    } : {};

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f4f4f9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 0'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '18px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
                padding: '32px',
                width: '800px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
            }}>
                {/* Bloques superiores */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '24px'
                }}>
                    {/* Unidad de Control */}
                    <div style={{
                        flex: 1,
                        background: '#e3f2fd',
                        border: '2px solid #90caf9',
                        borderRadius: '12px',
                        padding: '18px',
                        boxSizing: 'border-box',
                        minWidth: '220px'
                    }}>
                        <h3 style={{margin: 0, color: '#1976d2'}}>Unidad de control</h3>
                        <div style={{marginTop: '18px'}}>
                            <div>Decodificador</div>
                            <div style={{margin: '10px 0'}}>
                                <span>Cont. Programa</span>
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #90caf9',
                                    borderRadius: '6px',
                                    padding: '4px 12px',
                                    display: 'inline-block',
                                    marginLeft: '8px',
                                    ...getHighlight('contador-programa')
                                }}>{numberToBinaryWithNBits(contador, 4)}</div>
                            </div>
                            <div>
                                <span>R. Instrucciones</span>
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #90caf9',
                                    borderRadius: '6px',
                                    padding: '4px 12px',
                                    display: 'inline-block',
                                    marginLeft: '8px',
                                    ...getHighlight('registro-instrucciones')
                                }}>
                                    {numberToBinaryWithNBits(instruccionActual[0], 4)}
                                    {numberToBinaryWithNBits(instruccionActual[1], 4)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ALU */}
                    <div style={{
                        flex: 1,
                        background: '#deacf4ff',
                        border: '2px solid #873089ff',
                        borderRadius: '12px',
                        padding: '18px',
                        boxSizing: 'border-box',
                        minWidth: '220px'
                    }}>
                        <h3 style={{margin: 0, color: '#47265bff'}}>Unidad aritmético-lógica (ALU)</h3>
                        <div style={{marginTop: '18px'}}>
                            <div>
                                <span>Acumulador</span>
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #82328dff',
                                    borderRadius: '6px',
                                    padding: '4px 12px',
                                    display: 'inline-block',
                                    marginLeft: '8px',
                                    ...getHighlight('acumulador')
                                }}>{numberToBinaryWithNBits(acumulador, 8)}</div>
                            </div>
                            <div style={{marginTop: '10px'}}>
                                <span>R. Entrada</span>
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #bd73ddff',
                                    borderRadius: '6px',
                                    padding: '4px 12px',
                                    display: 'inline-block',
                                    marginLeft: '8px',
                                    ...getHighlight('registro-entrada')
                                }}>{numberToBinaryWithNBits(entrada, 8)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Memoria */}
                <div style={{
                    background: '#f8cef1ff',
                    border: '2px solid #d05bbaff',
                    borderRadius: '12px',
                    padding: '18px',
                    boxSizing: 'border-box',
                    marginTop: '0'
                }}>
                    <h3 style={{margin: 0, color: '#a11a86ff'}}>Memoria</h3>
                    <div style={{display: 'flex', gap: '32px', marginTop: '18px', alignItems: 'flex-start'}}>
                        <div>
                            <span>R. Direcciones</span>
                            <div style={{
                                background: '#fff',
                                border: '1px solid #811569ff',
                                borderRadius: '6px',
                                padding: '4px 12px',
                                display: 'inline-block',
                                marginLeft: '8px',
                                ...getHighlight('registro-direcciones')
                            }}>{numberToBinaryWithNBits(registroDirecciones, 4)}</div>
                        </div>
                        <div>
                            <span>R. Datos</span>
                            <div style={{
                                background: '#fff',
                                border: '1px solid #a6227aff',
                                borderRadius: '6px',
                                padding: '4px 12px',
                                display: 'inline-block',
                                marginLeft: '8px',
                                ...getHighlight('registro-datos')
                            }}>
                                {numberToBinaryWithNBits(registroDatos[0], 4)}
                                {numberToBinaryWithNBits(registroDatos[1], 4)}
                            </div>
                        </div>
                        <div>
                            <span>Tabla de memoria</span>
                            <table style={{
                                marginTop: '8px',
                                borderCollapse: 'collapse',
                                background: '#fff',
                                fontSize: '14px'
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{border: '1px solid #de46c5ff', padding: '2px 8px'}}>Dir.</th>
                                        <th style={{border: '1px solid #d05bbaff', padding: '2px 8px'}}>Contenido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memoria.map((dato, idx) => (
                                        <tr key={idx}>
                                            <td style={{
                                                border: '1px solid #ac318dff',
                                                padding: '2px 8px',
                                                ...(destacados.includes(`memoria-${idx}`) ? {
                                                    background: '#f3f350ff',
                                                    fontWeight: 'bold'
                                                } : {})
                                            }}>{numberToBinaryWithNBits(idx, 4)}</td>
                                            <td style={{
                                                border: '1px solid #b63090ff',
                                                padding: '2px 8px',
                                                ...(destacados.includes(`memoria-${idx}`) ? {
                                                    background: '#f3f350ff',
                                                    fontWeight: 'bold'
                                                } : {})
                                            }}>
                                                {numberToBinaryWithNBits(dato[0], 4)}
                                                {numberToBinaryWithNBits(dato[1], 4)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Botones funcionales */}
                <div style={{marginTop: '8px', width: '100%', display: 'flex', justifyContent: 'center', gap: '16px'}}>
                    <button onClick={continuar} style={{
                        padding: '10px 24px',
                        borderRadius: '6px',
                        border: '1px solid #007bff',
                        background: '#fff',
                        color: '#007bff',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Continuar
                    </button>
                    <button onClick={reiniciar} style={{
                        padding: '10px 24px',
                        borderRadius: '6px',
                        border: '1px solid #f57c00',
                        background: '#fff',
                        color: '#f57c00',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Reiniciar
                    </button>
                </div>
            </div>
            {/* <button 
                className="btn btn-primary rounded-circle" 
                style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px' }} 
                onClick={handleShow}
            >
                +
            </button> */}

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Pipelines</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{textAlign: 'center'}}><strong>(3+5)×(2+4)</strong></h5>
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
                                <td>Obtener (3+5)</td>
                                <td> ---- </td>
                                <td> ---- </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Obtener (2+4)</td>
                                <td>Decodificar (3+5)</td>
                                <td> ---- </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Obtener X</td>
                                <td>Decodificar (2+4)</td>
                                <td>Ejecutar (3+5)</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td> ---- </td>
                                <td>Decodificar X</td>
                                <td> Ejecutar (2+4)</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td> ---- </td>
                                <td> ---- </td>
                                <td>Ejecutar 8 × 6</td>
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
        </div>
    );
}

export default MejoraSimulador;
