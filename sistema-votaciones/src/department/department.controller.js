import fs from 'fs';
import path from 'path';
import Department from './department.model.js';


/*====================*/
/*      CREATE        */
/*====================*/
export const createDepartments = async (req, res)=> {
    try {
        //recuperamos la informacion
        let data = req.body;

        //agregamos los datos al modelo.
        let department = new Department(data);

        //guardamos el departamento en la base de datos.
        await department.save();
        return res.send({message: `Departamento guardado correctamente.`, department: department});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: `Error al crear departamentos.`});
    }
}

/*====================*/
/*       READ         */
/*====================*/
export const get = async(req, res)=>{
    try {
        
        let departments = await Department.find();
        return res.send({departments});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: `Error al obtener los departamentos.`});
    }
}

/*====================*/
/*       UPDATE       */
/*====================*/

/* GET DE TODOS LOS DEPARTAMENTOS */

export const getDepartments = async (req, res) =>{
    try {
        const departments = await Department.find({}, 'department')
        return res.send(departments)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error el obtener los departamentos'})
    }
}

export const getMunicipios = async(req, res) =>{
    try {
        // Proyección para obtener solo el campo "town"
        const departments = await Department.find({}, 'town');
        const towns = departments.map(department => department.town).flat();
        return res.send(towns)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error el obtener los municipios'})
    }

}

export const getTownsByDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const department = await Department.findById(id, 'town')
        if (!department) {
            return res.status(404).send('Departamento no encontrado')
        }
        return res.send(department.town)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error el obtener los municipios'})
    }
};
