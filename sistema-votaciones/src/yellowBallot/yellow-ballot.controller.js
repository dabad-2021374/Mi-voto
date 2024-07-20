import YellowBallot from './yellow-ballot.model.js'

export const createYellowBallot = async (req, res) => {
    try {
        const userId = req.user._id
        const { idTeam } = req.params
        const currentYear = new Date().getFullYear()
        const existingBallot = await YellowBallot.findOne({
            user: userId,
            createdAt: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`)
            }
        })

        if (existingBallot) return res.status(400).send({ message: `Sufragio ${currentYear} realizado` })
        
        const yellowBallot = new YellowBallot({ user: userId, yellowTeam: idTeam })
        await yellowBallot.save()
        await yellowBallot.populate({ path: 'yellowTeam', populate: { path: 'partie', select: 'name colorHex acronym' } });
        const count = await YellowBallot.countDocuments({ yellowTeam: idTeam });
        req.io.emit('newYellowBallot', {
            yellowTeam: { idTeam, name: yellowBallot.yellowTeam.partie.name, colorHex: yellowBallot.yellowTeam.partie.colorHex, acronym: yellowBallot.yellowTeam.partie.acronym },
            count
        });
        return res.send({ message: 'Boleta amarilla agregada', yellowBallot })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al agregar la boleta amarilla', error })
    }
}

export const deleteYellowBallot = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID es obligatorio.' });
        }

        const deletedYellowBallot = await YellowBallot.findByIdAndDelete(id);

        if (!deletedYellowBallot) {
            return res.status(404).send({ message: 'YellowBallot no encontrado.' });
        }

        return res.send({ message: 'YellowBallot eliminado exitosamente.', yellowBallot: deletedYellowBallot });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el YellowBallot', error: err.message });
    }
}

export const getAllYellowBallots = async (req, res) => {
    try {
        const yellowBallots = await YellowBallot.find().populate('user').populate('yellowTeam');
        return res.send(yellowBallots);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los YellowBallots', error: err.message });
    }
};

export const updateYellowBallot = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).send({ message: 'ID es obligatorio.' });
        }

        const updatedYellowBallot = await YellowBallot.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedYellowBallot) {
            return res.status(404).send({ message: 'YellowBallot no encontrado.' });
        }

        return res.send({ message: 'YellowBallot actualizado exitosamente.', yellowBallot: updatedYellowBallot });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el YellowBallot', error: err.message });
    }
};

export const getYellowBallot = async(req, res)=>{
    try {
        let yellowBallot = await YellowBallot.find().populate('yellowTeam').select('-user');
        return res.send({yellowBallot});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:  `Error al obtener las papeletas amarillas.`});
    }
}