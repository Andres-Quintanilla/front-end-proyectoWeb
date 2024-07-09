
$(document).ready(function(){
    $('#adaptable').lightSlider({
        adaptiveHeight:true,
        item:1 
    });
});


$(document).ready(function(){
    $('#anchoAutomatico').lightSlider({
        adaptiveHeight:true,
        loop:true,
        auto: false,
        onSliderLoad: function(){
            $('#anchoAutomatico').removeClass('css-escondido');
        }
    });
});



