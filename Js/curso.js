document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:3001/cursos')
        .then(response => response.json())
        .then(cursos => {
            const cursosContainer = document.querySelector('.cursos');
            cursosContainer.innerHTML = '';
            cursos.forEach(curso => {
                const cursoElement = document.createElement('article');
                cursoElement.classList.add('curso');
                cursoElement.setAttribute('data-id', curso.idCurso);
                cursoElement.innerHTML = `
                    <div class="curso-img">
                        <img src="http://localhost:3001/uploads/${curso.imagenPath}" alt="${curso.nombre}">
                    </div>
                    <div class="curso-detalle">
                        <a href="verCurso.html?id=${curso.idCurso}" class="curso-nombre">${curso.nombre}</a>
                        <p class="curso-instructor">${curso.descripcion}</p>
                        <span class="curso-modalidad">${curso.categoria}</span>
                    </div>
                `;
                cursoElement.addEventListener('click', () => {
                    window.location.href = `verCurso.html?id=${curso.idCurso}`;
                });
                cursosContainer.appendChild(cursoElement);
            });
        })
        .catch(error => console.error('Error al cargar los cursos:', error));
});
