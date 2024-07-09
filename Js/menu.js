$(document).on('click', '.buscar', function () {
    $('.barra-de-busqueda').addClass('barra-de-busqueda-activa');
});

$(document).on('click', '.cancelar-busqueda', function () {
    $('.barra-de-busqueda').removeClass('barra-de-busqueda-activa');
});

$(window).scroll(function () {
    if ($(document).scrollTop() > 50) {
        $('.navegacion').addClass('navegacion-fija');
    } else {
        $('.navegacion').removeClass('navegacion-fija');
    }
});

$(document).ready(function () {
    $('.menu-hamburguesa').click(function () {
        $('.menu-hamburguesa').toggleClass('activo');
        $('.navegacion').toggleClass('activo');
    });
});




