import Parties from './political-parties.model.js'
import User from '../user/user.model.js'
import Department from '../department/department.model.js'

import District from '../districtTeam/districtTeams.model.js'


export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}


export const createPartiesMain = async (req, res) => {
    try {
        let data = req.body;

        if (!data.user || !data.name || !data.creationDate || !data.colorHex) {
            return res.status(400).send({ message: 'Todos los campos (user, name, creationDate, colorHex) son obligatorios.' });
        }

        const existingUser = await User.findById(data.user);
        if (!existingUser) {
            return res.status(400).send({ message: 'El usuario proporcionado no existe.' });
        }

        const existingUserParty = await Parties.findOne({ user: data.user });
        if (existingUserParty) {
            return res.status(400).send({ message: 'El usuario ya está asociado a otro partido.' });
        }

        const existingParty = await Parties.findOne({ name: data.name });
        if (existingParty) {
            return res.status(400).send({ message: 'Ya existe un partido con este nombre.' });
        }

        const party = new Parties(data);
        const savedParty = await party.save();

        // Actualizar el usuario asignado con el ID del nuevo partido
        existingUser.partie = savedParty._id;
        await existingUser.save();

        return res.send({ message: 'El partido se ha creado exitosamente.', party });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el partido', error: err.message });
    }
}

export const addPresidentialTeam = async (req, res) => {
    try {
        const { DPI, role } = req.body;
        //const { id } = req.params;
        let { _id } = req.user


        if (!DPI || !role) {
            return res.status(400).send({ message: 'El id del partido, el id del usuario y el rol son obligatorios.' });
        }

        if (!['PRESIDENTE', 'VICEPRESIDENTE'].includes(role.toUpperCase())) {
            return res.status(400).send({ message: 'El rol debe ser PRESIDENTE o VICEPRESIDENTE.' });
        }

        let findUser = await User.findOne({ DPI: DPI })
        let user = findUser._id
        //const existUser = await User.findById(user);
        if (!findUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }
        let adminPartie = await User.findById(_id)

        const party = await Parties.findById(adminPartie.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const presidentialTeam = party.presidentialTeam;

        if (presidentialTeam.length >= 2) {
            return res.status(400).send({ message: 'El equipo presidencial ya tiene el máximo de dos miembros.' });
        }

        const roleExists = presidentialTeam.some(member => member.role === role.toUpperCase());
        if (roleExists) {
            return res.status(400).send({ message: `Ya existe un miembro con el rol de ${role.toUpperCase()} en el equipo presidencial.` });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === user);

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.presidentialTeam.push({
            user: user,
            role: role.toUpperCase()
        });

        await party.save();

        return res.send({ message: 'Miembro del equipo presidencial agregado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al agregar el miembro al equipo presidencial', error: err.message });
    }
};


export const addNationalListDeputy = async (req, res) => {
    try {
        const { DPI, role, districtId } = req.body;
        //const { id } = req.params;
        let { _id } = req.user

        if (!DPI || !role || !districtId) {
            return res.status(400).send({ message: 'El DPI del usuario, el rol y el distrito son obligatorios.' });
        }

        if (role.toUpperCase() !== 'DIPUTADO') {
            return res.status(400).send({ message: 'El rol debe ser DIPUTADO.' });
        }
        let findUser = await User.findOne({ DPI: DPI })
        let user = findUser._id
        //const userExists = await User.findById(user);
        if (!findUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const districtExists = await District.findById(districtId);
        if (!districtExists) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }
        let adminPartie = await User.findById(_id)

        const party = await Parties.findById(adminPartie.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === user);

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.nationalListDeputies.push({
            user: user,
            role: role.toUpperCase(),
            district: districtId
        });

        await party.save();

        return res.send({ message: 'Miembro de la lista nacional de diputados agregado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al agregar el miembro a la lista nacional de diputados', error: err.message });
    }
};

export const addMayor = async (req, res) => {
    try {
        const { DPI, role, departamento, townName } = req.body;
        //const { id } = req.params;
        let { _id } = req.user

        if (!DPI || !role || !departamento || !townName) {
            return res.status(400).send({ message: 'El DPI del usuario, el rol, el departamento y municipio requeridos.' });
        }

        if (role.toUpperCase() !== 'ALCALDE') {
            return res.status(400).send({ message: 'El rol debe ser ALCALDE.' });
        }
        let findUser = await User.findOne({ DPI: DPI })
        let user = findUser._id
        //const userExists = await User.findById(user);
        if (!findUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        //const districtExists = await District.findById(districtId);
        //if (!districtExists) {
        //    return res.status(404).send({ message: 'Distrito no encontrado.' });
        //}
        let adminPartie = await User.findById(_id)

        const party = await Parties.findById(adminPartie.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === user);

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.mayorTeam.push({
            user: user,
            role: role.toUpperCase(),
            departament: departamento,
            town: town
        });

        await party.save();

        return res.send({ message: 'Alcalde agregado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al agregar el miembro a la lista nacional de diputados', error: err.message });
    }
};

export const addDistrictDeputy = async (req, res) => {
    try {
        const { DPI, role, districtId } = req.body;
        //const { id } = req.params;
        let { _id } = req.user

        if (!DPI || !role || !districtId) {
            return res.status(400).send({ message: 'El  DPI del usuario, el rol y el distrito son obligatorios.' });
        }

        if (role.toUpperCase() !== 'DIPUTADO') {
            return res.status(400).send({ message: 'El rol debe ser DIPUTADO.' });
        }
        let findUser = await User.findOne({ DPI: DPI })
        let user = findUser._id
        //const userExists = await User.findById(user);
        if (!findUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const districtExists = await District.findById(districtId);
        if (!districtExists) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }

        let adminPartie = await User.findById(_id)

        const party = await Parties.findById(adminPartie.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === user);

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.districtDeputies.push({
            user: user,
            role: role.toUpperCase(),
            district: districtId
        });

        await party.save();

        return res.send({ message: 'Miembro de los diputados distritales agregado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al agregar el miembro a los diputados distritales', error: err.message });
    }
};

export const addParlamentDeputy = async (req, res) => {
    try {
        const { DPI, role, districtId } = req.body;
        //const { id } = req.params;
        let { _id } = req.user

        if (!DPI || !role || !districtId) {
            return res.status(400).send({ message: 'El id del usuario, el rol y el distrito son obligatorios.' });
        }

        if (role.toUpperCase() !== 'DIPUTADO') {
            return res.status(400).send({ message: 'El rol debe ser DIPUTADO.' });
        }

        let findUser = await User.findOne({ DPI: DPI })
        let user = findUser._id
        //const userExists = await User.findById(user);
        if (!findUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const districtExists = await District.findById(districtId);
        if (!districtExists) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }

        let adminPartie = await User.findById(_id)

        const party = await Parties.findById(adminPartie.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }


        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === user);

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.parlamentDeputies.push({
            user: user,
            role: role.toUpperCase(),
            district: districtId
        });

        await party.save();

        return res.send({ message: 'Miembro de los diputados parlamentarios agregado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al agregar el miembro a los diputados parlamentarios', error: err.message });
    }
};

export const addMayorTeamMember = async (req, res) => {
    try {
        const { DPI, role, departmentId, town } = req.body;
        const { _id } = req.user;

        if (!DPI || !role || !departmentId || !town) {
            return res.status(400).send({ message: 'El DPI del usuario, el rol, el departamento y la ciudad son obligatorios.' });
        }

        if (role.toUpperCase() != 'ALCALDE') {
            return res.status(400).send({ message: 'El rol debe ser ALCALDE.' });
        }

        const findUser = await User.findOne({ DPI: DPI });
        if (!findUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const user = findUser._id;

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).send({ message: 'Departamento no encontrado.' });
        }

        const townExists = department.town.some(t => t.name == town);
        if (!townExists) {
            return res.status(404).send({ message: 'Ciudad no encontrada en el departamento especificado.' });
        }

        const adminPartie = await User.findById(_id);
        const party = await Parties.findById(adminPartie.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const userAlreadyExistsInMayorTeam = party.mayorTeam.some(member => member.user.toString() == user);
        if (userAlreadyExistsInMayorTeam) {
            return res.status(400).send({ message: 'El usuario ya es miembro del equipo de alcaldes.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.districtDeputies,
            ...party.parlamentDeputies
        ].some(member => member.user.toString() == user);

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.mayorTeam.push({
            user: user,
            role: role.toUpperCase(),
            departament: departmentId,
            town: town
        });

        await party.save();

        return res.send({ message: 'Miembro del equipo de alcaldes agregado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al agregar el miembro al equipo de alcaldes', error: err.message });
    }
};


export const updatePartieMain = async (req, res) => {
    try {
        const data = req.body;

        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'No se encontró el partido asociado al usuario administrador.' });
        }

        const existingPartie = await Parties.findById(party._id);
        if (!existingPartie) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        if (data.user) {
            const existingUser = await User.findById(data.user);
            if (!existingUser) {
                return res.status(400).send({ message: 'El usuario proporcionado no existe.' });
            }

            const existingUserParty = await Parties.findOne({ user: data.user });
            if (existingUserParty && existingUserParty._id.toString() !== party._id.toString()) {
                return res.status(400).send({ message: 'El usuario ya está asociado a otro partido.' });
            }
        }

        // Si se está actualizando el nombre del partido
        if (data.name && data.name !== existingPartie.name) {
            const existingParty = await Parties.findOne({ name: data.name });
            if (existingParty) {
                return res.status(400).send({ message: 'Ya existe un partido con este nombre.' });
            }
        }

        const updatedPartie = await Parties.findByIdAndUpdate(
            party._id,
            data,
            { new: true }
        );

        return res.send({ message: 'Partido actualizado exitosamente.', updatedPartie });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el partido', error: err.message });
    }
};
export const updatePresidentialTeam = async (req, res) => {
    try {
        const { DPI, role, memberId } = req.body;

        if (!DPI || !role || !memberId) {
            return res.status(400).send({ message: 'El DPI, el rol y el memberId son obligatorios.' });
        }

        if (!['PRESIDENTE', 'VICEPRESIDENTE'].includes(role.toUpperCase())) {
            return res.status(400).send({ message: 'El rol debe ser PRESIDENTE o VICEPRESIDENTE.' });
        }

        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const existUser = await User.findOne({ DPI });
        if (!existUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const existingMemberIndex = party.presidentialTeam.findIndex(member => member._id.toString() === memberId);
        if (existingMemberIndex === -1) {
            return res.status(404).send({ message: 'Miembro del equipo presidencial no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam.filter(member => member._id.toString() !== memberId),
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === existUser._id.toString());

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.presidentialTeam[existingMemberIndex] = {
            user: existUser._id,
            role: role.toUpperCase()
        };

        await party.save();

        return res.send({ message: 'Miembro del equipo presidencial actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el miembro del equipo presidencial', error: err.message });
    }
};
export const updateNationalListDeputies = async (req, res) => {
    try {
        const { DPI, role, district, memberId } = req.body;

        if (!DPI || !role || !district || !memberId) {
            return res.status(400).send({ message: 'El DPI, el rol, el district y el memberId son obligatorios.' });
        }

        if (role.toUpperCase() !== 'DIPUTADO') {
            return res.status(400).send({ message: 'El rol debe ser DIPUTADO.' });
        }

        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const existUser = await User.findOne({ DPI });
        if (!existUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const existDistrict = await District.findById(district);
        if (!existDistrict) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }

        const existingMemberIndex = party.nationalListDeputies.findIndex(member => member._id.toString() === memberId);
        if (existingMemberIndex === -1) {
            return res.status(404).send({ message: 'Miembro de la lista nacional de diputados no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies.filter(member => member._id.toString() !== memberId),
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === existUser._id.toString());

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.nationalListDeputies[existingMemberIndex] = {
            user: existUser._id,
            role: role.toUpperCase(),
            district: existDistrict._id
        };

        await party.save();

        return res.send({ message: 'Miembro de la lista nacional de diputados actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el miembro de la lista nacional de diputados', error: err.message });
    }
}

export const updateDistrictDeputies = async (req, res) => {
    try {
        const { DPI, role, district, memberId } = req.body;

        if (!DPI || !role || !district || !memberId) {
            return res.status(400).send({ message: 'El DPI, el rol, el district y el memberId son obligatorios.' });
        }

        if (role.toUpperCase() !== 'DIPUTADO') {
            return res.status(400).send({ message: 'El rol debe ser DIPUTADO.' });
        }

        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const existUser = await User.findOne({ DPI });
        if (!existUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const existDistrict = await District.findById(district);
        if (!existDistrict) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }

        const existingMemberIndex = party.districtDeputies.findIndex(member => member._id.toString() === memberId);
        if (existingMemberIndex === -1) {
            return res.status(404).send({ message: 'Miembro del equipo de distrito no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies.filter(member => member._id.toString() !== memberId),
            ...party.mayorTeam
        ].some(member => member.user.toString() === existUser._id.toString());

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.districtDeputies[existingMemberIndex] = {
            user: existUser._id,
            role: role.toUpperCase(),
            district: existDistrict._id
        };

        await party.save();

        return res.send({ message: 'Miembro del equipo de distrito actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el miembro del equipo de distrito', error: err.message });
    }
}

export const updateParlamentDeputies = async (req, res) => {
    try {
        const { DPI, role, district, memberId } = req.body;

        if (!DPI || !role || !district || !memberId) {
            return res.status(400).send({ message: 'El DPI, el rol, el distrito y el memberId son obligatorios.' });
        }

        if (role.toUpperCase() !== 'DIPUTADO') {
            return res.status(400).send({ message: 'El rol debe ser DIPUTADO.' });
        }

        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const existUser = await User.findOne({ DPI });
        if (!existUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const existDistrict = await District.findById(district);
        if (!existDistrict) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }

        const existingMemberIndex = party.parlamentDeputies.findIndex(member => member._id.toString() === memberId);
        if (existingMemberIndex === -1) {
            return res.status(404).send({ message: 'Miembro del equipo parlamentario no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies.filter(member => member._id.toString() !== memberId),
            ...party.districtDeputies,
            ...party.mayorTeam
        ].some(member => member.user.toString() === existUser._id.toString());

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.parlamentDeputies[existingMemberIndex] = {
            user: existUser._id,
            role: role.toUpperCase(),
            district: existDistrict._id
        };

        await party.save();

        return res.send({ message: 'Miembro del equipo parlamentario actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el miembro del equipo parlamentario', error: err.message });
    }
}

export const updateMayorTeam = async (req, res) => {
    try {
        const { DPI, role, departmentId, townName, memberId } = req.body;

        if (!DPI || !role || !departmentId || !townName || !memberId) {
            return res.status(400).send({ message: 'El DPI, el rol, el departamento, la ciudad y el memberId son obligatorios.' });
        }

        if (role.toUpperCase() !== 'ALCALDE') {
            return res.status(400).send({ message: 'El rol debe ser ALCALDE.' });
        }

        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const existUser = await User.findOne({ DPI });
        if (!existUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).send({ message: 'Departamento no encontrado.' });
        }

        const townExists = department.town.some(town => town.name === townName);
        if (!townExists) {
            return res.status(404).send({ message: 'Ciudad no encontrada en el departamento especificado.' });
        }

        const existingMemberIndex = party.mayorTeam.findIndex(member => member._id.toString() === memberId);
        if (existingMemberIndex === -1) {
            return res.status(404).send({ message: 'Miembro del equipo de alcalde no encontrado.' });
        }

        const userAlreadyExistsInOtherTeams = [
            ...party.presidentialTeam,
            ...party.nationalListDeputies,
            ...party.parlamentDeputies,
            ...party.districtDeputies,
            ...party.mayorTeam.filter(member => member._id.toString() !== memberId)
        ].some(member => member.user.toString() === existUser._id.toString());

        if (userAlreadyExistsInOtherTeams) {
            return res.status(400).send({ message: 'El usuario ya es miembro de otro equipo.' });
        }

        party.mayorTeam[existingMemberIndex] = {
            user: existUser._id,
            role: role.toUpperCase(),
            department: departmentId,
            town: townName
        };

        await party.save();

        return res.send({ message: 'Miembro del equipo de alcalde actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el miembro del equipo de alcalde', error: err.message });
    }
};



export const deactivateParty = async (req, res) => {
    try {
        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const updatedParty = await Parties.findByIdAndUpdate(
            party._id,
            { $set: { state: false } },
            { new: true }
        );

        if (!updatedParty) {
            return res.status(404).send({ message: 'Partido no encontrado' });
        }

        return res.send({ message: 'Partido desactivado exitosamente', party: updatedParty });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al desactivar el partido', error: err.message });
    }
};

export const activateParty = async (req, res) => {
    try {
        const adminUser = await User.findById(req.user._id);
        if (!adminUser || adminUser.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso denegado. No eres administrador de partido.' });
        }

        const party = await Parties.findById(adminUser.partie);
        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const updatedParty = await Parties.findByIdAndUpdate(
            party._id,
            { $set: { state: true } },
            { new: true }
        );

        if (!updatedParty) {
            return res.status(404).send({ message: 'Partido no encontrado' });
        }

        return res.send({ message: 'Partido desactivado exitosamente', party: updatedParty });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al desactivar el partido', error: err.message });
    }
};
export const getAllParties = async (req, res) => {
    try {
        let parties = await Parties.find()
            .populate({
                path: 'presidentialTeam.user',
                select: '-password -code -DPI -phone -address -email',
                populate: [
                    { path: 'profession', select: 'nameProfession' },
                    { path: 'department', select: 'department' }
                ]
            })
            .populate({
                path: 'nationalListDeputies.user',
                select: '-password -code -DPI -phone -address -email',
                populate: [
                    { path: 'profession', select: 'nameProfession' },
                    { path: 'department', select: 'department' }
                ]
            })
            .populate('nationalListDeputies.district')
            .populate({
                path: 'districtDeputies.user',
                select: '-password -code -DPI -phone -address -email',
                populate: [
                    { path: 'profession', select: 'nameProfession' },
                    { path: 'department', select: 'department' }
                ]
            })
            .populate('districtDeputies.district')
            .populate({
                path: 'parlamentDeputies.user',
                select: '-password -code -DPI -phone -address -email',
                populate: [
                    { path: 'profession', select: 'nameProfession' },
                    { path: 'department', select: 'department' }
                ]
            })
            .populate('parlamentDeputies.district')
            .populate({
                path: 'mayorTeam.user',
                select: '-password -code -DPI -phone -address -email',
                populate: [
                    { path: 'profession', select: 'nameProfession' },
                    { path: 'department', select: 'department' }
                ]
            })
            .populate('mayorTeam.town');

        if (!parties || parties.length === 0) {
            return res.status(404).send({ message: 'No se encontraron los partidos' });
        }

        // Filtrar el partido "Voto Nulo"
        parties = parties.filter(partie => partie.name !== 'Voto Nulo');
        parties.sort((a, b) => a.name.localeCompare(b.name));
        const baseUrl = `${req.protocol}://${req.get('host')}/`;

        parties.forEach(partie => {
            partie.logo = `${baseUrl}${partie.logo}`;
            partie.presidentialTeam.forEach(member => {
                if (member.user && member.user.photo) {
                    member.user.photo = `${baseUrl}${member.user.photo}`;
                }
            });
            partie.nationalListDeputies.forEach(member => {
                if (member.user && member.user.photo) {
                    member.user.photo = `${baseUrl}${member.user.photo}`;
                }
            });
            partie.districtDeputies.forEach(member => {
                if (member.user && member.user.photo) {
                    member.user.photo = `${baseUrl}${member.user.photo}`;
                }
            });
            partie.parlamentDeputies.forEach(member => {
                if (member.user && member.user.photo) {
                    member.user.photo = `${baseUrl}${member.user.photo}`;
                }
            });
            partie.mayorTeam.forEach(member => {
                if (member.user && member.user.photo) {
                    member.user.photo = `${baseUrl}${member.user.photo}`;
                }
            });
        });

        return res.send({ parties });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los partidos', error: err });
    }
};

export const getPartyByName = async (req, res) => {
    try {
        const { name } = req.params;

        const regex = new RegExp(name, 'i');
        const party = await Parties.find({ name: regex });

        if (!party || party.length === 0) {
            return res.status(404).send({ message: 'Partido no encontrado' });
        }

        //base url
        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        party.logo = `${baseUrl}${party.logo}`;

        return res.send({ party });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar el partido', error: err });
    }
};

export const getActiveParties = async (req, res) => {
    try {
        const activeParties = await Parties.find({ state: true });
        //base url
        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        activeParties.forEach(partie => {
            partie.logo = `${baseUrl}${partie.logo}`
        })
        return res.send(activeParties);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los partidos activos', error: err });
    }
};

export const getPartiesByUser = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) return res.status(400).send({ message: 'Id del usuario no encontrado' })

        const parties = await Parties.find({ user: userId })
            .populate({
                path: 'presidentialTeam',
                populate: { path: 'user', select: 'name surname' }
            })
            .populate({
                path: 'nationalListDeputies',
                populate: { path: 'user', select: 'name surname' }
            })
            .populate({
                path: 'districtDeputies',
                populate: { path: 'user', select: 'name surname' }
            })
            .populate({
                path: 'parlamentDeputies',
                populate: { path: 'user', select: 'name surname' }
            })
            .populate({
                path: 'mayorTeam',
                populate: { path: 'user', select: 'name surname' }
            })


        if (!parties || parties.length === 0) return res.status(400).send({ message: 'No se encontraron partidos con este usuario' })
        const baseUrl = `${req.protocol}://${req.get('host')}/`
        parties.forEach(party => {
            party.logo = `${baseUrl}${party.logo}`
        })
        return res.send({ parties })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al buscar los partidos del usuario', error: error })
    }
}

export const getMayorsByTown = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const { town } = user;

        const parties = await Parties.find({
            'mayorTeam.town': town
        }, {
            'mayorTeam.$': 1 
        }).populate('mayorTeam.user', 'name surname');

        if (!parties.length) {
            return res.status(404).send({ message: 'No se encontraron alcaldes para el municipio especificado.' });
        }

        const mayors = parties.flatMap(party => party.mayorTeam);

        return res.send({ mayors });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los alcaldes', error: err.message });
    }
}