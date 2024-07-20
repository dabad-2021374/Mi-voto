import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:2657',
    timeout: 6000
})

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = token
        return config
    },
    err => Promise.reject(err)
)

export const loginRequest = async (user) => {
    try {
        return await apiClient.post('/user/', user)
    } catch (error) {
        return {
            err: true,
            error
        }
    }
}

export const registerRequest = async (user) => {
    try {
        return await apiClient.post('/user/register', user,)
    } catch (error) {
        return {
            err: true,
            error
        }
    }
}

export const joinRequest = async (user) => {
    try {
        return await apiClient.put('/user/empadronamiento', user)
    } catch (error) {
        return {
            err: true,
            error
        }
    }
}

export const registerPartyRequest = async (partyData) => {
    try {
        return await apiClient.post('/parties/createPartiesMain', partyData)
    } catch (err) {
        return {
            error: true,
            err
        }

    }
}

export const getProfileRequest = async () => {
    try {
        const response = await apiClient.get('/user/myProfile')
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getPartiesRequest = async () => {
    try {
        const response = await apiClient.get('/parties/getAllParties');
        return response.data
    } catch (error) {
        return {
            error: true,
            err: error,
        }
    }
}

export const getProfessionsRequest = async () => {
    try {
        const response = await apiClient.get('/profession/getProfesions')
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getDeparmentsRequest = async () => {
    try {
        const response = await apiClient.get('/department/getDepartments')
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getTownsByDepartmentRequest = async (id) => {
    try {
        const response = await apiClient.get(`/department/getTownsByDepartment/${id}`)
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

//---------------------->Papeleta verde
export const getAllGreenTeam = async () => {
    try {
        const res = await apiClient.get('/greenTeam/getAllGreenTeams')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addGreenBallotHRequest = async (idTeam) => {
    try {
        return await apiClient.post(`/greenBallot/addGreenBallot/${idTeam}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}


//---------------------->Papeleta Rosa

export const getAllPinkTeam = async () => {
    try {
        const res = await apiClient.get('/pinkTeam/getAllPinkTeams')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addPinkBallotHRequest = async (idTeam) => {
    try {
        return await apiClient.post(`/p-ballot/create/${idTeam}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}



export const getMayorByTown = async () => {
    try {
        return await apiClient.get('/pinkTeam/get');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

//---------------------->Papeleta Azul

export const getAllBlueTeam = async () => {
    try {
        const res = await apiClient.get('/blueTeam/getAllBlueTeams')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addBlueBallotHRequest = async (idTeam) => {
    try {
        return await apiClient.post(`/blueBallot/createBlueBallot/${idTeam}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}



//---------------------->Papeleta Amarilla
export const getAllYellowTeam = async () => {
    try {
        const res = await apiClient.get('/yellowTeam/getAllYellowTeams')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addYellowBallotHRequest = async (idTeam) => {
    try {
        return await apiClient.post(`/yellowBallot/createYellowBallot/${idTeam}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

/* =========== ====================== */
/*             ESTADISTICAS           */
/* =========== ====================== */

//---------------------->ESTADISTICA Papeleta Blanca

export const getWhiteBallotsRequest = async () => {
    try {
        return await apiClient.get('/statistics/getWhiteBallot')
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// ---------------> ESTADISTICA papeleta verde
export const getGreenBallotsRequest = async () => {
    try {
        return await apiClient.get('/statistics/getGreenBallot');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// ----------------> ESTADISTICA Papeleta rosada
export const getPinkBallotsRequest = async () => {
    try {
        return await apiClient.get('/statistics/getPinkBallot');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// --------------> ESTADISTICA papeleta azul
export const getBlueBallotsRequest = async () => {
    try {
        return await apiClient.get('/statistics/getBlueBallot');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// -----------------> ESTADISTICA Papeleta amarilla
export const getYellowBallotsRequest = async () => {
    try {
        return await apiClient.get('/statistics/getYellowBallot');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}






/*----------------------------> */

export const getAllWhiteTeam = async () => {
    try {
        const res = await apiClient.get('/whiteTeam/get')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addWhiteBallotRequest = async (idTeam) => {
    try {
        return await apiClient.post(`/w-ballot/create/${idTeam}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

//----------------------------> Finalizar votación

export const addCitizenVoteRequest = async () => {
    try {
        return await apiClient.post('/vote/new')
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

//----------------------------> Editar Perfil de usuario
export const updateUserRequest = async (data) => {
    try {
        console.log('datos en el api', data)
        return await apiClient.put('/user/update', data, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        })
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const getAdminsPartie = async () => {
    try {
        const response = await apiClient.get('/user/getAdminsPartie')
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getDistrictTeam = async () => {
    try {
        const response = await apiClient.get('/districtTeam/getDistrict')
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getPartiesByLoggedUser = async () => {
    try {
        const response = await apiClient.get('/parties/getPartiesByUser')
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}


export const addPresidentialTeam = async (data) => {
    try {
        console.log('datos en el api', data)
        const response = await apiClient.post(`/parties/addPresidentialTeam`, data)
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addNationalListDeputy = async (data) => {
    try {
        console.log('datos en el api', data)
        const response = await apiClient.post(`/parties/addNationalListDeputy`, data)
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addDistrictDeputy = async (data) => {
    try {
        console.log('datos en el api', data)
        const response = await apiClient.post(`/parties/addDistrictDeputy`, data)
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
//----------------------------------> Iniciativas
export const getInitiatives = async () => {
    try {
        const res = await apiClient.get('/initiative/getInitiatives')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const getInitiativesByUser = async (id) => {
    try {
        const res = await apiClient.get(`/initiative/getInitiativesByUser/${id}`)
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addParlamentDeputy = async (data) => {
    try {
        console.log('datos en el api', data)
        const response = await apiClient.post(`/parties/addParlamentDeputy`, data)
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addInitiativeRequest = async (data) => {
    try {
        return await apiClient.post('/initiative/addInitiative', data)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addMayorTeamMember = async (data) => {
    try {
        console.log('datos en el api', data)
        const response = await apiClient.post(`/parties/addMayorTeamMember`, data)
        return response.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const deleteInitiativeRequest = async (id) => {
    try {
        return await apiClient.delete(`/initiative/deleteInitiative/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const updateInitiativeRequest = async (id, data) => {
    try {
        return await apiClient.put(`/initiative/updateInitiative/${id}`, data)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

//------------------------------------------>Experiences
export const getExperiencesByIdRequest = async (id) => {
    try {
        const res = await apiClient.get(`/experience/getExperiencesById/${id}`)
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getExperiences = async () => {
    try {
        const res = await apiClient.get('/experience/getExperiences')
        return res.data
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addExperienceRequest = async (data) => {
    try {
        return await apiClient.post('/experience/addExperienceTwo', data)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const deleteExperienceRequest = async (id) => {
    try {
        return await apiClient.delete(`/experience/deleteExperienceTwo/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const updateExperienceRequest = async (id, data) => {
    try {
        return await apiClient.put(`/experience/updateExperienceTwo/${id}`, data)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
