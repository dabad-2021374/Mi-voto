'use strict'

import Profession from './professions.model.js'

export const addProfesion = async(req, res) =>{
    try {
        let data = req.body
        let profe = await Profession.findOne({nameProfession: data.nameProfession})
        if(profe) return res.status(400).send({message: `Está profesión ya existe ${profe}`})
        let profesion = new Profession(data)
        await profesion.save()
        res.send({message: 'Profesión agregada'})
    } catch (error) {
        console.error(error)
        if(error.keyValue.nameProfession ) return res.status(400).send({message: `Name ${error.keyValue.nameProfession} is alredy taken ` })
        return res.status(500).send({message: 'Error al agregar la profesión'})
    }
}

export const editProfession = async(req, res) =>{
    try {
        let data = req.body
        let {id} = req.params
        let updateProfesion = await Profession.findOneAndUpdate(
            { _id: id },
            data,
            {new: true} 
        ) 
        if (!updateProfesion) return res.status(401).send({ message: 'Profesión no encontrada' })
        return res.send({ message: 'Profesion actualizada', updateProfesion })
    } catch (error) {
        console.error(error)
        if(error.keyValue.nameProfession ) return res.status(400).send({message: `Name ${error.keyValue.nameProfession} is alredy taken ` })
        return res.status(500).send({message: 'Error al editar profesión'});
        
    }
}

export const getProfesions = async(req, res) =>{
    try {
        let profe = await Profession.find()
        if(!profe) return res.status(404).send({message: 'No se encontraron profesiones'})
        return res.send( profe) 
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al obtener las profesiones'})
    }
}

export const deleteProfesion = async(req, res) =>{
    try {
        let {id} = req.params
        let deleteProfe =  await Profession.findOneAndDelete({_id: id})
        if(!deleteProfe) return res.status(404).send({message: 'Profesión no encontrada'})
        return res.send({message: `Profesión ${deleteProfe.nameProfession} Eliminada`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al eliminar la profesión'})
    }
}