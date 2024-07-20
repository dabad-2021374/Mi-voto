'use strict'

import Initiative from './initiatives.model.js'

export const addInitiative = async(req, res) =>{
    try {
        let idUser = req.user._id
        let data = req.body
        data.user = idUser
        let initiative = new Initiative(data)
        await initiative.save()
        return res.send({message: 'Iniciativa Agregada'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error el agregar Iniciativa'})
    }
}

export const updateInitiative = async (req, res) =>{
    try {
        let data = req.body
        let {id} = req.params
        let updateInitiative = await Initiative.findOne({_id: id})
        if(!updateInitiative) return res.status(500).send({message: 'Iniciativa no encontrada'})
        if( data.noInitiative || data.date) return res.status(500).send({message: 'No puedes actualizar el No. de iniciativa ni al fecha'})
        
        let updatedIniciative = await Initiative.findOneAndUpdate(
            { _id: id },
            { resume: data.resume },
            { new: true }
        )
        if (!updatedIniciative) return res.status(401).send({ message: 'Iniciativa no encontrada' })
        return res.send({ message: 'Iniciativa Actualizada', updatedIniciative })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error el actualizar la Iniciativa'})
    }
}

export const deleteInitiative = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInitiative = await Initiative.findByIdAndDelete(id);
        if (!deletedInitiative) return res.status(404).send({ message: 'Iniciativa no encontrada' })
        return res.send({ message: 'Iniciativa eliminada', deletedInitiative });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al eliminar la Iniciativa' });
    }
}

export const getAllInitiatives = async(req, res) =>{
    try {
        let initiatives = await Initiative.find()
        if(!initiatives) return res.status(404).send({message: 'No se encontraron iniciativas'})
        return res.send({message: 'Iniciativas encontradas', initiatives})
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener las Iniciativa' });
    }
}

export const getInitiatives = async (req, res) => {
    try {
        let idUser = req.user._id
        const initiatives = await Initiative.find({ user: idUser })
        //if (!initiatives.length)  return res.status(404).send({ message: 'No se encontraron iniciativas para este usuario' });
        return res.send({ message: 'Iniciativas encontradas', initiatives })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener las iniciativas' })
    }
}

export const getInitiativesByUser = async (req, res) => {
    try {
        let {id} = req.params
        console.log(id)
        const initiatives = await Initiative.find({ user: id })
        //if (!initiatives.length)  return res.status(404).send({ message: 'No se encontraron iniciativas para este usuario' });
        return res.send({ message: 'Iniciativas encontradas', initiatives })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener las iniciativas' })
    }
}

export const getInitiativeByNumber = async (req, res) => {
    try {
        const { noInitiative } = req.body
        const initiative = await Initiative.findOne({ noInitiative })
        if (!initiative) return res.status(404).send({ message: 'Iniciativa no encontrada' })
        return res.send({ message: 'Iniciativa encontrada', initiative })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener la iniciativa' })
    }
}
