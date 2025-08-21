import React, { useEffect } from 'react';
import '../css/Simulador.css'

function numberToBinaryWithNBits(number, n) {
    return number.toString(2).padStart(n, '0').slice(-n);
}

class UnidadDeControl {
    constructor(memoria) {
        this._memoria = new Memoria(memoria);
        this._alu = new ALU();
        this._contador = 0;
        this._paso = 0;
        this._instruccionActual = null;
        this._registroDirecciones = 0;
        this._registroDatos = [0, 0];
    }

    continuar() {
        this.limpiarDestacados();

        let pasos = [
            () => {
                this._registroDirecciones = this._contador;
                this.destacar('contador-programa', 'registro-direcciones');
                this.actualizarVista();
            },
            () => {
                this._contador++;
                this.destacar('contador-programa');
                this.actualizarVista();
            },
            () => {
                this._registroDatos = this._memoria.leer(this._registroDirecciones);
                this.destacar('registro-direcciones', 'registro-datos', `memoria-${this._registroDirecciones}`);
                this.actualizarVista();
            },
            () => {
                this._instruccionActual = this._registroDatos;
                this.destacar('registro-datos', 'registro-instrucciones');
                this.actualizarVista();
            },
            () => {
                let operacion = this._instruccionActual[0];
                let operando = this._instruccionActual[1];
                this._registroDirecciones = operando;
                this.destacar('registro-instrucciones', 'registro-direcciones');
                this.actualizarVista();
            },
            () => {
                this._registroDatos = this._memoria.leer(this._registroDirecciones);
                this.destacar('registro-direcciones', 'registro-datos', `memoria-${this._registroDirecciones}`);
                this.actualizarVista();
            },
            () => {
                this._alu.setEntrada(this._registroDatos[1]);
                this.destacar('registro-datos', 'registro-entrada');
                this.actualizarVista();
            },
            () => {
                let operacion = this._instruccionActual[0];
                if (operacion === 0) {
                    this._alu.sumar();
                } else if (operacion === 1) {
                    this._alu.restar();
                } else if (operacion === 2) {
                    this._memoria.escribir(7, [0, this._alu.getAcumulador()]); // Guardar en la posición 0111
                    this.destacar(`memoria-7`);
                }
                this.actualizarDecodificador();
                this.destacar('acumulador', 'registro-entrada');
                this.actualizarVista();
            }
        ];

        if (this._paso < pasos.length && this._contador < 4) {
            pasos[this._paso++]();
        } else {
            this._paso = 0;
        }
    }

    actualizarVista() {
        document.getElementById('contador-programa').textContent = `Contador: ${numberToBinaryWithNBits(this._contador, 4)}`;
        document.getElementById('registro-direcciones').textContent = `Direcciones: ${numberToBinaryWithNBits(this._registroDirecciones, 4)}`;
        document.getElementById('registro-datos').textContent = `Datos: ${numberToBinaryWithNBits(this._registroDatos[1], 8)}`;
        document.getElementById('registro-instrucciones').textContent = `Instrucciones: ${numberToBinaryWithNBits(this._instruccionActual ? this._instruccionActual[0] : 0, 4)}${numberToBinaryWithNBits(this._instruccionActual ? this._instruccionActual[1] : 0, 4)}`;
        document.getElementById('acumulador').textContent = `Acumulador: ${numberToBinaryWithNBits(this._alu.getAcumulador(), 8)}`;
        document.getElementById('registro-entrada').textContent = `Entrada: ${numberToBinaryWithNBits(this._alu.getEntrada(), 8)}`;
    }

    destacar(...ids) {
        ids.forEach(id => document.getElementById(id)?.classList.add('destacado'));
    }

    limpiarDestacados() {
        document.querySelectorAll('.destacado').forEach(el => el.classList.remove('destacado'));
    }
}

class Memoria {
    constructor(memoria) {
        this._memoria = memoria;
        this.actualizarVista();
    }

    leer(direccion) {
        return this._memoria[direccion] || [0, 0];
    }

    escribir(direccion, dato) {
        this._memoria[direccion] = dato;
        this.actualizarVista();
    }

    actualizarVista() {
        let tabla = document.getElementById('tabla-memoria');
        tabla.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            let dato = this._memoria[i] || [0, 0];
            let row = `<tr id="memoria-${i}"><td>${numberToBinaryWithNBits(i, 4)}</td><td>${numberToBinaryWithNBits(dato[0], 4)}${numberToBinaryWithNBits(dato[1], 4)}</td></tr>`;
            tabla.innerHTML += row;
        }
    }
}

class ALU {
    constructor() {
        this._acumulador = 0;
        this._entrada = 0;
    }

    setEntrada(valor) {
        this._entrada = valor;
    }

    getEntrada() { return this._entrada; }

    sumar() { this._acumulador += this._entrada; }

    restar() { this._acumulador -= this._entrada; }

    getAcumulador() { return this._acumulador; }
}

const Simulador = () => {
    useEffect(() => {
        let memoria = [[0, 4], [0, 5], [2, 6], [3, 0], [0, 5], [0, 6], [0, 0]];
        let uc = new UnidadDeControl(memoria);
        document.getElementById('continuar').addEventListener('click', () => uc.continuar());
        document.getElementById('reiniciar').addEventListener('click', () => window.location.reload());
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Arquitectura de Von Neumann</h1>

            <div className="container" style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <div className="unidad-control">
                    <h2>Unidad de Control</h2>
                    <div id="decodificador" className="decodificador">+</div>
                    <div id="contador-programa" className="registro">0000</div>
                    <div id="registro-instrucciones" className="registro">00000000</div>
                </div>

                <div className="memoria">
                    <h2>Memoria</h2>
                    <div id="registro-direcciones" className="registro">0000</div>
                    <div id="registro-datos" className="registro">00000000</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Dir</th>
                                <th>Contenido</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-memoria"></tbody>
                    </table>
                </div>

                <div className="alu">
                    <h2>Unidad Aritmético-Lógica (ALU)</h2>
                    <div id="acumulador" className="registro">00000000</div>
                    <div id="registro-entrada" className="registro">00000000</div>
                </div>
            </div>
            <div style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                <button id="continuar">Continuar</button>
                <button id="reiniciar">Reiniciar</button>
            </div>
        </div>
    );
};

export default Simulador;