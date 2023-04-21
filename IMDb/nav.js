$("#nav-button").click(function(){
    if($("#nav-button").attr('aria-expanded') == "false"){
        $("#nav-button").attr('aria-expanded','true');
        $("#nav-menu").slideDown(800);
    }
    else{
        $("#nav-button").attr('aria-expanded','false');
        $("#nav-menu").slideUp(800);
    }
    
});

// const navbar = document.querySelector('#nav-button');

// navbar.addEventListener('click',() => {
//     const isOpened = navbar.getAttribute('aria-expanded');
//     if(isOpened === 'false'){
//         navbar.setAttribute('aria-expanded','true');

//     }
//     else{
//         navbar.setAttribute('aria-expanded','false');

//     }
// })
