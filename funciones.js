//importacion de las variables que almacenan los datos
let hospital = require('./index');
//ingreso pacientes
function IngresoPacientes(req, res) {
    if (isNaN(req.body.edad) == true ||
        isNaN(req.body.NumerodeContacto) == true ||
        isNaN(req.body.NumerodeFamiliar) == true ||
        req.body == undefined ||
        req.body.nombre == undefined ||
        req.body.nombre.length < 3) {
        res.status(400).send('Usted Ingreso mal un dato, intente de nuevo');
    } else {
        let habDisponible = hospital.habitacionesDisponibles.find(i => i.diponible == true);

        if (habDisponible == undefined && hospital.habitacionesDisponibles.length == 25) {
            hospital.pacientes.push(req.body);
            hospital.pacientes[hospital.pacientes.length - 1].id = hospital.pacientes.length - 1;
            hospital.pacientes[hospital.pacientes.length - 1].TieneHabitacion = false;
            res.status(200).send('No hay habitaciones disponibles, se pondrá en lista de espera');
        } else if (habDisponible == undefined && hospital.habitacionesDisponibles.length < 25) {
            hospital.pacientes.push(req.body)
            hospital.pacientes[hospital.pacientes.length - 1].id = hospital.pacientes.length - 1;
            hospital.pacientes[hospital.pacientes.length - 1].TieneHabitacion = true;
            hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.length] = {
                'NumeroHabitacion': hospital.habitacionesDisponibles.length,
                'paciente': req.body.nombre,
                'idPaciente': hospital.pacientes.length - 1,
                'diponible': false
            }
            res.status(200).send(`El paciente se agrego correctamente con el id ${hospital.pacientes[hospital.pacientes.length - 1].id}, en la habitación numero ${hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.length - 1].NumeroHabitacion}`)
        } else {
            let a = hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habDisponible)].NumeroHabitacion;
            hospital.pacientes.push(req.body)
            hospital.pacientes[hospital.pacientes.length - 1].id = hospital.pacientes.length - 1;
            hospital.pacientes[hospital.pacientes.length - 1].TieneHabitacion = true;
            hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habDisponible)] = {
                'NumeroHabitacion': hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habDisponible)].NumeroHabitacion,
                'paciente': req.body.nombre,
                'idPaciente': hospital.pacientes.length - 1,
                'diponible': false
            }
            res.status(200).send(`El paciente se agrego correctamente con el id ${hospital.pacientes[hospital.pacientes.length - 1].id}, en la habitación número ${a}`)
        }
    }
}


//editar infor del paciente

function editarPaciente(req, res, id) {

    if (isNaN(req.body.edad) == true ||
        isNaN(req.body.NumerodeContacto) == true ||
        isNaN(req.body.NumerodeFamiliar) == true ||
        req.body == undefined ||
        req.body.nombre == undefined ||
        req.body.nombre.length < 3) {
        res.status(400).send('Usted Ingreso mal un dato, intente de nuevo');
    } else {
        hospital.pacientes.forEach(i => {

            if (id == i.id) {
                if (i.TieneHabitacion == true) {

                    hospital.pacientes[hospital.pacientes.indexOf(i)] = req.body;
                    hospital.pacientes[hospital.pacientes.indexOf(req.body)].id = id;
                    hospital.pacientes[hospital.pacientes.indexOf(req.body)].TieneHabitacion = true;
                    hospital.habitacionesDisponibles.forEach(e => {
                        if (e.idPaciente == id) {
                            hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(e)].paciente = req.body.nombre;

                        }
                    });
                } else {
                    hospital.pacientes[hospital.pacientes.indexOf(i)] = req.body;
                    hospital.pacientes[hospital.pacientes.indexOf(req.body)].id = id;
                    hospital.pacientes[hospital.pacientes.indexOf(req.body)].TieneHabitacion = false;

                }
                res.status(200).send(`Se ha editado la información del paciente con el id ${id} de manera correcta`)
            } else if (hospital.pacientes[hospital.pacientes.length - 1] == hospital.pacientes[hospital.pacientes.indexOf(i)]) {
                res.status(400).send("El paciente que desea editar no existe.")
            }
        });
    }
}

//FuncionParaSacarPacientedelSistema

function eliminarPaciente(req, res, id) {

    let encontrado = hospital.pacientes.find(e => e.id == id)
    if (encontrado == undefined) {
        res.status(400).send("El paciente que desea sacar del sistema no existe");
    } else {
        if (encontrado.TieneHabitacion == true) {
            let siguiente = hospital.pacientes.find(e => e.TieneHabitacion == false);
            let habitacion = hospital.habitacionesDisponibles.find(e => e.idPaciente == id);
            if (siguiente == undefined) {
                hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habitacion)] = {

                    'NumeroHabitacion': hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habitacion)].NumeroHabitacion,
                    'paciente': undefined,
                    'idPaciente': undefined,
                    'diponible': true

                }
                hospital.pacientes.splice(hospital.pacientes.indexOf(encontrado), 1);
                res.status(200).send('Se ha eliminado correctamente el paciente, queda una habitacion disponible');
            } else {
                hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habitacion)].paciente = siguiente.nombre;
                hospital.habitacionesDisponibles[hospital.habitacionesDisponibles.indexOf(habitacion)].idPaciente = siguiente.id;
                hospital.pacientes[hospital.pacientes.indexOf(siguiente)].TieneHabitacion = true;
                hospital.pacientes.splice(hospital.pacientes.indexOf(encontrado), 1);
                res.status(200).send("se elimino el paciente correctamente y su habitacion se le asigno al siguiente de la lista");
            }
        } else {
            hospital.pacientes.splice(hospital.pacientes.indexOf(encontrado), 1);
            res.status(200).send('Se elimino correctamente el paciente');
        }
    }
}




module.exports.IngresoPacientes = IngresoPacientes;
module.exports.editarPaciente = editarPaciente;
module.exports.eliminarPaciente = eliminarPaciente;