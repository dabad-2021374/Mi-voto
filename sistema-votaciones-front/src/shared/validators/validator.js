
/*--------------------- VALIDACIÓN DE CODIGO DE USUARIO ---------------------------- */
export const validateCodeUser = (user)=>{
    const regex =  /^\S{8}$/
    return regex.test(user)
}

/*--------------------- VALIDACIÓN DE NOMBRE DE USUARIO ---------------------------- */
export const validateUsername = (username)=>{
    const regex =  /^\S{6,8}$/
    return regex.test(username)
}


/*--------------------- VALIDACIÓN DE USUARIO ---------------------------- */
export const validateUser = (user)=>{
    const regex = /\S+/
    return regex.test(user)
}

/*--------------------- VALIDACIÓN DE CONTRASEÑA ---------------------------- */
export const validatePassword = (password)=>{
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    return regex.test(password)
}

/*--------------------- VALIDACIÓN DE CONFIRMACIÓN DE CONTRASEÑA ---------------------------- */
export const validatePassConfirm = (password, passConfirm)=>{
    return password === passConfirm
}

/*--------------------- VALIDACIÓN DE DPI ---------------------------- */
export const validateDPI = (dpi)=>{
    const regex = /^\d{13}$/;
    return regex.test(dpi)
}

/*--------------------- VALIDACIÓN DE CORREO ---------------------------- */
export const validateEmail = (email)=>{
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
}

/*--------------------- VALIDACIÓN DE CAMPOS VACÍOS ---------------------------- */
export const validateEmpty = (value)=>{
    const regex = /\S+/
    return regex.test(value)
}

/*--------------------- VALIDACIÓN DE CELULAR ---------------------------- */
export const validatePhone = (phone)=>{
    const regex = /^\d{8}$/;
    return regex.test(phone)
}
/*--------------------- VALIDACIÓN DE SELECTS VACÍOS ---------------------------- */
export const validateSelect = (value) => {
    return value !== ''; 
}


/* --------------------- MENSAJES DE VALIDACIÓN DE CAMPOS ------------------------------ */
export const userValidationMessage = 'Debes agregar información'
export const usernameValidationMessage = 'El nombre usuario debe contener entre seis y ocho caracteres'
export const passwordValidationMessage = 'La contraseña debe contener al menos ocho caracteres, una letra minuscúla, una letra mayúscula y un caracter especial'
export const codeValidationMessage = 'El código debe tener al menos ocho digitos'
export const confirmPasswordValidationMessage = 'Las contraseñas no coinciden'
export const confirmDPIValidationMessage = 'El DPI debe contener 13 caractares los cuales deben ser númericos'
export const emailValidationMessage = 'Este no es un correo válido'
export const emptyValidationMessage = 'Por favor llena este campo'
export const phoneValidationMessage = 'El núnero telefonico debe contener únicamente 8 caracteres sin espacios'
export const selectValidationMessage = 'Es necesario que selecciones algún dato'

/* --------------------- MENSAJES DE VALIDACIÓN DE CAMPOS ------------------------------ */

/* ------------------------- FIN DE LAS VALIDACIONES PARA AUTH -------------------------- */