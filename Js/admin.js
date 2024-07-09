async function loadUserCourses() {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde el almacenamiento local
    try {
        const response = await fetch(`http://localhost:3001/cursos/user/${userId}`);
        if (response.ok) {
            const cursos = await response.json();
            displayCourses(cursos); // Función para mostrar los cursos en la interfaz
        } else {
            showMessage('Error al cargar los cursos del usuario');
        }
    } catch (error) {
        showMessage('Error en la solicitud: ' + error.message);
    }
}

function displayCourses(cursos) {
    const courseList = document.querySelector('.course-list');
    courseList.innerHTML = '';
    cursos.forEach(curso => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.innerHTML = `
            <img src="http://localhost:3001/uploads/${curso.imagenPath}" alt="${curso.nombre}" class="course-image">
            <h3>${curso.nombre}</h3>
            <p>${curso.descripcion}</p>
            <div class="course-actions">
                <button onclick="editCourse(${curso.idCurso})">Editar</button>
                <button onclick="deleteCourse(${curso.idCurso})">Eliminar</button>
            </div>
            <div class="lesson-list">
                <h4>Lecciones</h4>
                <div class="lesson-item">
                    <!-- Aquí se cargarán dinámicamente las lecciones -->
                </div>
                <button class="añadirLeccion" onclick="showCreateLessonForm(${curso.idCurso})">Añadir Lección</button>
            </div>
        `;
        courseList.appendChild(courseItem);

        // Cargar las lecciones para cada curso
        loadLessons(curso.idCurso, courseItem.querySelector('.lesson-item'));
    });
}

async function editCourse(idCurso) {
    window.location.href = `crearCurso.html?edit=true&idCurso=${idCurso}`;
}

async function deleteCourse(idCurso) {
    try {
        const response = await fetch(`http://localhost:3001/cursos/${idCurso}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Curso eliminado exitosamente');
            loadUserCourses(); // Cargar los cursos nuevamente para actualizar la lista
        } else {
            showMessage('Error al eliminar el curso');
        }
    } catch (error) {
        showMessage('Error en la solicitud: ' + error.message);
    }
}

async function showCreateLessonForm(cursoId) {
    window.location.href = `crearLeccion.html?cursoId=${cursoId}`;
}

async function editLesson(idLeccion) {
    window.location.href = `crearLeccion.html?edit=true&idLeccion=${idLeccion}`;
}

async function deleteLesson(idLeccion) {
    try {
        const response = await fetch(`http://localhost:3001/lecciones/${idLeccion}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Lección eliminada exitosamente');
            const urlParams = new URLSearchParams(window.location.search);
            const cursoId = urlParams.get('cursoId');
            loadLessons(cursoId); // Cargar las lecciones nuevamente para actualizar la lista
        } else {
            showMessage('Error al eliminar la lección');
        }
    } catch (error) {
        showMessage('Error en la solicitud: ' + error.message);
    }
}

async function loadLessons(cursoId, leccionesContainer) {
    try {
        const response = await fetch(`http://localhost:3001/lecciones/curso/${cursoId}`);
        if (response.ok) {
            const lecciones = await response.json();
            leccionesContainer.innerHTML = '';
            lecciones.forEach(leccion => {
                const leccionElement = document.createElement('div');
                leccionElement.className = 'lesson-item';
                leccionElement.innerHTML = `
                    <span>${leccion.nombre}</span>
                    <div class="lesson-actions">
                        <button onclick="editLesson(${leccion.idLeccion})">Editar</button>
                        <button onclick="deleteLesson(${leccion.idLeccion})">Eliminar</button>
                    </div>
                `;
                leccionesContainer.appendChild(leccionElement);
            });
        } else {
            console.error('Error al cargar las lecciones');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

function showMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.innerText = message;
    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', loadUserCourses);
