'use strict'
import District from './districtTeams.model.js'


export const addDistrict = async (req, res) =>{
    try {
        let data = req.body
        if(data.nameDistrict === ''){
            return res.status(401).send({ message: 'No pueden venir datos nulos' })
        }
        const districtCount = await District.countDocuments();
        if (districtCount >= 23)  return res.status(400).send({ message: 'No se pueden agregar más de 23 distritos' });

        let dist = District.find(data.nameDistrict)
        if(dist) return res.status(400).send({message: 'Este distrito ya existe'})
        let district = new District(data)
        await district.save()
        return res.send({message: `Distrito agregado`}) 
    } catch (error) {
        console.error(error)
        if (error.keyValue && error.keyValue.name) {
            return res.status(400).send({ message: `Name ${error.keyValue.name} ya está tomado` })
        }
        return res.status(500).send({message: 'Error al agregar el distrito'})
    }
}

export const getDistrict = async(req, res) =>{
    try {
        let district = await District.find()
        if(!district) return res.status(400).send({message: 'No hay distritos'})
        return res.send({message: district}) 
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al listar distrito'})
    }
}

export const deleteDistrict = async(req, res) =>{
    try {
        let { id } = req.params
        let deleteDistrict = await District.findOneAndDelete({ _id: id })
        if (!deleteDistrict) return res.status(404).send({ message: 'Distrito no encontrado' })
        return res.send({ message: `Distrito ${deleteDistrict.nameDistrict} eliminado` })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al Eliminar el distrito'})
        
    }
}

export const updateDistrict = async(req, res) =>{
    try {
        let {id} = req.params
        let data = req.body
        if(data.nameDistrict === ''){
            return res.status(401).send({ message: 'No pueden venir datos nulos' })
        }
        let updatedDistrict = await District.findOneAndUpdate(
            { _id: id },
            data,
            {new: true} 
        )
        if (!updatedDistrict) return res.status(401).send({ message: 'Distrito no encontrado' })
            return res.send({ message: 'Distrito actualizado', updatedDistrict })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al Editar Distrito'});
    }
}