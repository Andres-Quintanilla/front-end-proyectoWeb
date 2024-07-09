document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('userId');
    const iconUser = document.getElementById('icon-user');
    const userMenu = document.querySelector('.user-menu');

    if (userId) {
        document.getElementById('btn-login').style.display = 'none';
        document.getElementById('btn-register').style.display = 'none';
        iconUser.style.display = 'block';
        document.getElementById('menu-mis-cursos').style.display = 'list-item';
        document.getElementById('menu-crear-curso').style.display = 'list-item';
        actualizarNumeroDeCursosEnMenu(); // Llamada a la función para actualizar el número de cursos en el menú

        // Mostrar/ocultar menú del usuario
        iconUser.addEventListener('click', function (event) {
            userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation();
        });

        // Cerrar el menú del usuario si se hace clic fuera de él
        document.addEventListener('click', function () {
            userMenu.style.display = 'none';
        });

        userMenu.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        // Manejar la acción de cerrar sesión
        document.getElementById('logout').addEventListener('click', function () {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    } else {
        iconUser.style.display = 'none';
        document.getElementById('menu-mis-cursos').style.display = 'none';
        document.getElementById('menu-crear-curso').style.display = 'none';
    }
});

function actualizarNumeroDeCursosEnMenu() {
    const numeroDeCursos = document.querySelector('.numero-de-cursos');
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetch(`http://localhost:3001/inscripciones/count/${userId}`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('numeroDeCursos', data.total);
                numeroDeCursos.textContent = data.total;
            })
            .catch(error => {
                console.error('Error al obtener el número de cursos:', error);
                numeroDeCursos.textContent = '0';
            });
    } else {
        numeroDeCursos.textContent = '0';
    }
}

function mostrarMensaje(elemento, mensaje, tipo) {
    const mensajeElemento = document.createElement('p');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.className = tipo === 'error' ? 'mensaje-error' : 'mensaje-exito';
    elemento.innerHTML = '';
    elemento.appendChild(mensajeElemento);
    setTimeout(() => {
        mensajeElemento.remove();
    }, 5000);
}

function validarLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const form = document.getElementById("mensaje-login");

    let isValid = true;

    if (!email) {
        mostrarError('email-error', "Por favor ingrese su correo");
        isValid = false;
    } else {
        ocultarError('email-error');
    }

    if (!password) {
        mostrarError('password-error', "Por favor ingrese su contraseña");
        isValid = false;
    } else {
        ocultarError('password-error');
    }

    if (!email.includes("@")) {
        mostrarError('email-error', "Por favor ingrese un correo válido");
        isValid = false;
    } else {
        ocultarError('email-error');
    }

    if (password.length < 6) {
        mostrarError('password-error', "La contraseña debe tener al menos 6 caracteres");
        isValid = false;
    } else {
        ocultarError('password-error');
    }

    if (isValid) {
        iniciarSesion(email, password);
    }
}

function mostrarError(elementoId, mensaje) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
}

function ocultarError(elementoId) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = '';
    elemento.style.display = 'none';
}

async function iniciarSesion(email, password) {
    const form = document.getElementById("mensaje-login");
    try {
        const response = await fetch('http://localhost:3001/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userName', data.nombreUsuario);
            mostrarMensaje(form, `Bienvenido, ${data.nombreUsuario}`, "exito");
            actualizarNumeroDeCursosEnMenu(); // Actualizar el número de cursos después de iniciar sesión
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            mostrarMensaje(form, "Correo o contraseña incorrectos", "error");
        }
    } catch (error) {
        mostrarMensaje(form, "Hubo un problema con el inicio de sesión. Inténtalo de nuevo más tarde.", "error");
    }
}

function validarRegistro() {
    const nombreUsuario = document.getElementById("nombreUsuario").value;
    const email = document.getElementById("registro-email").value;
    const password = document.getElementById("registro-password").value;
    const form = document.getElementById("mensaje-registro");

    let isValid = true;

    if (!nombreUsuario) {
        mostrarError('nombreUsuario-error', "Por favor ingrese su nombre de usuario");
        isValid = false;
    } else {
        ocultarError('nombreUsuario-error');
    }

    if (!email) {
        mostrarError('email-error', "Por favor ingrese su correo");
        isValid = false;
    } else {
        ocultarError('email-error');
    }

    if (!password) {
        mostrarError('password-error', "Por favor ingrese su contraseña");
        isValid = false;
    } else {
        ocultarError('password-error');
    }

    if (!email.includes("@")) {
        mostrarError('email-error', "Por favor ingrese un correo válido");
        isValid = false;
    } else {
        ocultarError('email-error');
    }

    if (password.length < 6) {
        mostrarError('password-error', "La contraseña debe tener al menos 6 caracteres");
        isValid = false;
    } else {
        ocultarError('password-error');
    }

    if (isValid) {
        registrarUsuario(nombreUsuario, email, password);
    }
}

async function registrarUsuario(nombreUsuario, email, password) {
    const form = document.getElementById("mensaje-registro");
    try {
        const response = await fetch('http://localhost:3001/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreUsuario, email, password, tipoUsuario: 1 })
        });

        if (response.ok) {
            mostrarMensaje(form, "Usuario registrado exitosamente", "exito");
            document.getElementById("form-registro").reset();
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else if (response.status === 409) {
            mostrarMensaje(form, "El correo ya está registrado", "error");
        } else {
            const errorData = await response.json();
            mostrarMensaje(form, `Error: ${errorData.message}`, "error");
        }
    } catch (error) {
        mostrarMensaje(form, "Hubo un problema al registrar el usuario. Inténtalo de nuevo más tarde.", "error");
    }
}
