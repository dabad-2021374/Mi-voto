'use strict'

import { hash, compare } from 'bcrypt';

/*====================== */
/*       ENCRYPT         */
/*====================== */

//encriptar cualquier cosa
export const encrypt = (value) => {
    try {
        return hash(value, 10);
    } catch (err) {
        console.error(err);
        return err;
    }
}

/*====================== */
/*      VALIDATE         */
/*====================== */

//Validar encriptaciones

export const checkEncrypt = async (value, valueEncrypt) => {
    try {
        return await compare(value, valueEncrypt);
    } catch (err) {
        console.error(err);
        return err;
    }
}

//validar actualizacion
export const checkUpdate = (data, role) => {
    
    if (role == 'ADMINISTRADOR-PLATAFORMA') {
        if (
            Object.entries(data).length === 0 ||
            data.password || //si cambia la password devuelve false
            data.password == '' //si envia la password vacia
        ) return false;
        return true;
    } else {
        if (
            Object.entries(data).length === 0 ||
            data.password || //si cambia la password devuelve false
            data.password == '' || //si envia la password vacia
            data.role || //si modifica el rol
            data.role == '' //si deja el rol vacio.
        ) return false;
        return true;
    }

}

export const validateModel = (data) => {
    const missingFields = [];

    // Verifica si falta algún campo requerido
    if (!data.name) {
        missingFields.push('name');
    }

    if (!data.logo || data.logo.length === 0) {
        missingFields.push('logo');
    }

    if (!data.creationDate) {
        missingFields.push('creationDate');
    }

    if (typeof data.state === 'undefined') {
        missingFields.push('state');
    }

    if (!data.colorHex) {
        missingFields.push('colorHex');
    }

    if (!data.presidentialTeam || data.presidentialTeam.length === 0) {
        missingFields.push('presidentialTeam');
    } else {
        data.presidentialTeam.forEach((member, index) => {
            if (!member.user) {
                missingFields.push(`presidentialTeam[${index}].user`);
            }
            if (!member.role) {
                missingFields.push(`presidentialTeam[${index}].role`);
            }
        });
    }

    if (!data.nationalListDeputies || data.nationalListDeputies.length === 0) {
        missingFields.push('nationalListDeputies');
    } else {
        data.nationalListDeputies.forEach((deputy, index) => {
            if (!deputy.user) {
                missingFields.push(`nationalListDeputies[${index}].user`);
            }
            if (!deputy.role) {
                missingFields.push(`nationalListDeputies[${index}].role`);
            }
            if (!deputy.district) {
                missingFields.push(`nationalListDeputies[${index}].district`);
            }
        });
    }

    if (!data.districtDeputies || data.districtDeputies.length === 0) {
        missingFields.push('districtDeputies');
    } else {
        data.districtDeputies.forEach((deputy, index) => {
            if (!deputy.user) {
                missingFields.push(`districtDeputies[${index}].user`);
            }
            if (!deputy.role) {
                missingFields.push(`districtDeputies[${index}].role`);
            }
            if (!deputy.district) {
                missingFields.push(`districtDeputies[${index}].district`);
            }
        });
    }

    if (!data.parlamentDeputies || data.parlamentDeputies.length === 0) {
        missingFields.push('parlamentDeputies');
    } else {
        data.parlamentDeputies.forEach((deputy, index) => {
            if (!deputy.user) {
                missingFields.push(`parlamentDeputies[${index}].user`);
            }
            if (!deputy.role) {
                missingFields.push(`parlamentDeputies[${index}].role`);
            }
            if (!deputy.district) {
                missingFields.push(`parlamentDeputies[${index}].district`);
            }
        });
    }

    if (!data.mayorTeam || data.mayorTeam.length === 0) {
        missingFields.push('mayorTeam');
    } else {
        data.mayorTeam.forEach((member, index) => {
            if (!member.user) {
                missingFields.push(`mayorTeam[${index}].user`);
            }
            if (!member.role) {
                missingFields.push(`mayorTeam[${index}].role`);
            }
            if (!member.district) {
                missingFields.push(`mayorTeam[${index}].district`);
            }
        });
    }

    return missingFields;
};