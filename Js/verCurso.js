document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');
    const userId = localStorage.getItem('userId'); // Obtener el id del usuario del localStorage

    if (cursoId) {
        fetch(`http://localhost:3001/cursos/${cursoId}`)
            .then(response => response.json())
            .then(curso => {
                document.getElementById('curso-img').src = `http://localhost:3001/uploads/${curso.imagenPath}`;
                document.getElementById('curso-nombre').textContent = curso.nombre;
                document.getElementById('curso-descripcion').textContent = curso.descripcion;
                document.getElementById('curso-categoria').textContent = curso.categoriaNombre;

                return fetch(`http://localhost:3001/lecciones?cursoId=${cursoId}`);
            })
            .then(response => response.json())
            .then(lecciones => {
                const leccionesContainer = document.getElementById('lecciones-lista');
                leccionesContainer.innerHTML = '';
                lecciones.forEach(leccion => {
                    const leccionElement = document.createElement('a');
                    leccionElement.href = `verVideo.html?id=${leccion.idLeccion}`;
                    leccionElement.classList.add('leccion');
                    leccionElement.innerHTML = `
                        <img src="https://img.youtube.com/vi/${leccion.contenidoPath.split('embed/')[1]}/0.jpg" alt="${leccion.nombre}">
                        <h3>${leccion.nombre}</h3>
                        <p>Duración: 10 min</p>
                    `;
                    leccionesContainer.appendChild(leccionElement);
                });
            })
            .catch(error => console.error('Error al cargar el curso y las lecciones:', error));

        // Verificar si el usuario ya está matriculado en el curso
        fetch(`http://localhost:3001/inscripciones?userId=${userId}&cursoId=${cursoId}`)
            .then(response => response.json())
            .then(inscripcion => {
                const btnAddCurso = document.getElementById('btn-add-curso');
                if (inscripcion.length > 0) {
                    btnAddCurso.textContent = 'Ya estás matriculado';
                    btnAddCurso.disabled = true;
                } else {
                    btnAddCurso.textContent = 'Matricularse';
                    btnAddCurso.disabled = false;
                    btnAddCurso.addEventListener('click', matricularCurso);
                }
            })
            .catch(error => console.error('Error al verificar la inscripción:', error));
    }

    function matricularCurso() {
        const currentDate = new Date().toISOString().split('T')[0];
        fetch('http://localhost:3001/inscripciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idCurso: cursoId, idUsuario: userId, fechaInscripcion: currentDate, progreso: 0 })
        })
            .then(response => response.json())
            .then(data => {
                alert('¡Te has matriculado en el curso!');
                actualizarNumeroDeCursos();
                const btnAddCurso = document.getElementById('btn-add-curso');
                btnAddCurso.textContent = 'Ya estás matriculado';
                btnAddCurso.disabled = true;
            })
            .catch(error => console.error('Error al matricularse en el curso:', error));
    }

    function actualizarNumeroDeCursos() {
        const numeroDeCursos = document.querySelector('.numero-de-cursos');
        let numeroActual = parseInt(numeroDeCursos.textContent);
        numeroDeCursos.textContent = (numeroActual + 1).toString();
    }
});
