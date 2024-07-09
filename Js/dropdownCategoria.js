document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
});

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3001/categorias');
        if (response.ok) {
            const categorias = await response.json();
            const dropdownCategorias = document.getElementById('dropdown-categorias');

            categorias.forEach(categoria => {
                const dropdownLink = document.createElement('a');
                dropdownLink.href = `cursos.html?categoria=${categoria.idCategoria}`;
                dropdownLink.textContent = categoria.nombre;
                dropdownCategorias.appendChild(dropdownLink);
            });
        } else {
            console.error('Error al cargar las categorías');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}