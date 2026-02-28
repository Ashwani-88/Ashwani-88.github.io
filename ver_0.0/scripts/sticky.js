const nav = document.querySelector(".navbar-container")
window.addEventListener('scroll',function(){
    if (document.documentElement.scrollTop > 20)  {
        nav.classList.add("sticky");
    }
    else{
        nav.classList.remove("sticky");

    }


})
const navigationheight = document.querySelector('.navbar-container').offsetHeight;
document.documentElement.style.setProperty('--scroll-padding',navigationheight - 1 + "px");