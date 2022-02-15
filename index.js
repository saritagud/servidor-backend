const express = require('express');
const app = express();
const morgan = require('morgan');
const funciones = require('./funciones')

app.use(morgan('dev'));
app.use(express.json());

let habitacionesDisponibles = [
        {
            'NumeroHabitacion' : 0,
            'paciente': undefined,
            'idPaciente':undefined,
            'diponible': true 
        },
        {
            'NumeroHabitacion' : 1,
            'paciente': undefined,
            'idPciente':undefined,
            'diponible': true 
        }
]
let pacientes = [
        {
            "id":0,
            "nombre":"andres",
            "sexo":"hombre",
            "edad": 18,
            "Historialmedico":"paciente con antecedentes de neumonia",
            "NumerodeContacto": "04247063127",
            "numerodefamiliar":"02726520566",
            "direccion":"valera, edo. trujillo",
            "TieneHabitacion": false
        }
]


//muestra las habitaciones
app.get('/', (req,res)=>{
    res.status(200).json(habitacionesDisponibles);
});

//muestra los pacientes
app.get('/pacientes', (req, res)=>{
    res.status(200).json(pacientes);
});

//muestraLosPacientesPorId

app.get('/paciente/:id', (req,res)=>{
    let persona = pacientes.find(e => e.id == req.params.id);
    if(persona == undefined){
        res.status(400).send('El paciente que desea buscar no existe');
    }else{
        res.status(200).json(persona);
    }
})

//ingresoPacientes
app.post('/ingresar', (req,res)=>{
    funciones.IngresoPacientes(req,res)
});

//editarPaciente
app.put('/editar/:id', (req, res)=>{
    funciones.editarPaciente(req,res,req.params.id);
});

//SacarPacientedelSistema
app.delete('/eliminar/:id', (req,res)=>{
    funciones.eliminarPaciente(req,res, req.params.id);
})

app.listen(3000, ()=>{
    console.log('server on port 3000');
})
module.exports.pacientes = pacientes;
module.exports.habitacionesDisponibles = habitacionesDisponibles;