const menu = document.querySelector(".menu-toggle");
const menuLinks = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links");

menu.addEventListener('click', () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');

    //Not all browsers support forEach on NodeLists
    //Reference: https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
    // for (let i = 0; i < navLinks.length; i++) {
    //     navLinks[i].classList.toggle('nav-border-bottom');
    // }
});