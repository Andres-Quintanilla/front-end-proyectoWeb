async function loadCategorias() {
    try {
        const response = await fetch('http://localhost:3001/categorias');
        const categorias = await response.json();
        const dropdownContent = document.querySelector('.dropdown-content');

        categorias.forEach(categoria => {
            const link = document.createElement('a');
            link.href = `cursos.html?categoria=${categoria.id}`;
            link.textContent = categoria.nombre;
            dropdownContent.appendChild(link);
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadCategorias);
