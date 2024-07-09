function extractYouTubeVideoId(url) {
    let videoId = null;
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com') {
            videoId = parsedUrl.searchParams.get('v');
        } else if (parsedUrl.hostname === 'youtu.be') {
            videoId = parsedUrl.pathname.slice(1);
        } else if (parsedUrl.pathname.includes('/embed/')) {
            videoId = parsedUrl.pathname.split('/embed/')[1];
        }
    } catch (error) {
        console.error('URL de video no válida:', url);
    }
    return videoId;
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('idCurso');
    const leccionId = urlParams.get('id');
    const userId = localStorage.getItem('userId'); // Obtener el id del usuario del localStorage
    const videoFrame = document.getElementById('video-frame');

    if (cursoId) {
        // Obtener el curso para recuperar la URL del video
        fetch(`http://localhost:3001/cursos/${cursoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener el curso: ${response.statusText}`);
                }
                return response.json();
            })
            .then(curso => {
                const videoId = extractYouTubeVideoId(curso.videoLink);
                if (videoId) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
                } else {
                    videoFrame.src = ''; // Clear the src if invalid
                    console.error('URL de video no válida:', curso.videoLink);
                }
            })
            .catch(error => console.error('Error al cargar el curso:', error));
        
        // Obtener las lecciones del curso
        fetch(`http://localhost:3001/lecciones?cursoId=${cursoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener las lecciones: ${response.statusText}`);
                }
                return response.json();
            })
            .then(lecciones => {
                const leccionesContainer = document.getElementById('lecciones-lista');
                leccionesContainer.innerHTML = '';
                lecciones.forEach(leccion => {
                    let videoId = extractYouTubeVideoId(leccion.contenidoPath);

                    if (videoId) {
                        const leccionElement = document.createElement('div');
                        leccionElement.classList.add('leccion');
                        leccionElement.innerHTML = `
                            <a href="verVideo.html?id=${leccion.idLeccion}&idCurso=${cursoId}">
                                <img src="https://img.youtube.com/vi/${videoId}/0.jpg" alt="${leccion.nombre}">
                                <h3>${leccion.nombre}</h3>
                            </a>
                        `;
                        leccionesContainer.appendChild(leccionElement);
                    } else {
                        console.error('ID de video no válido para la lección:', leccion);
                    }
                });

                // Inicializar el carrusel
                if (window.innerWidth > 1010) {
                    $('#lecciones-lista').lightSlider({
                        item: 3,
                        slideMargin: 10,
                        loop: false,
                        pager: false,
                        prevHtml: '<i class="fas fa-chevron-left"></i>',
                        nextHtml: '<i class:: fas fa-chevron-right"></i>'
                    });
                }
            })
            .catch(error => console.error('Error al cargar las lecciones del curso:', error));
    }
});
