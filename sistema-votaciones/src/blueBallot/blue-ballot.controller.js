import BlueBallot from './blue-ballot.model.js'

export const createBlueBallot = async (req, res) => {
    try {
        const userId = req.user._id
        const { idTeam } = req.params
        const currentYear = new Date().getFullYear()
        const existingBallot = await BlueBallot.findOne({
            user: userId,
            createdAt: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`)
            }
        })

        if (existingBallot) return res.status(400).send({ message: `Sufragio ${currentYear} realizado`})
        
        const blueBallot = new BlueBallot({ user: userId, blueTeam: idTeam })
        await blueBallot.save();
        await blueBallot.populate({ path: 'blueTeam', populate: { path: 'partie', select: 'name colorHex acronym' } });
        const count = await BlueBallot.countDocuments({ blueTeam: idTeam });
        req.io.emit('newBlueBallot', {
            blueTeam: { idTeam, name: blueBallot.blueTeam.partie.name, colorHex: blueBallot.blueTeam.partie.colorHex, acronym: blueBallot.blueTeam.partie.acronym },
            count
        });

        return res.send({ message: 'Boleta azul agregada', blueBallot })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al agregar la boleta azul', error })
    }
}

export const deleteBlueBallot = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID es obligatorio .' });
        }

        const deletedBlueBallot = await BlueBallot.findByIdAndDelete(id);

        if (!deletedBlueBallot) {
            return res.status(404).send({ message: 'BlueBallot no encontrado.' });
        }

        return res.send({ message: 'BlueBallot eliminado exitosamente.', blueBallot: deletedBlueBallot });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el YellowBallot', error: err.message });
    }
}

export const getAllBlueBallots = async (req, res) => {
    try {
        const blueBallots = await BlueBallot.find().populate('user').populate('blueTeam');

        return res.send({ message: 'BlueBallots obtenidos exitosamente.', blueBallots });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los BlueBallots', error: err.message });
    }
};


export const updateBlueBallot = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).send({ message: 'ID es obligatorio.' });
        }

        const updatedBlueBallot = await BlueBallot.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBlueBallot) {
            return res.status(404).send({ message: 'BlueBallot no encontrado.' });
        }

        return res.send({ message: 'BlueBallot actualizado exitosamente.', blueBallot: updatedBlueBallot });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el BlueBallot', error: err.message });
    }
};

export const getBlueBallot = async(req, res)=>{
    try {
        let blueBallot = await BlueBallot.find().populate('blueTeam').select('-user');
        return res.send({blueBallot});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:  `Error al obtener las papeletas azules.`});
    }
}