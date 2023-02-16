const menu = document.querySelector(".menu-toggle");
const menuLinks = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links");
const section = document.querySelectorAll('section');

//For openning or closing the side menu
const toggleMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
}

//Open up the menu by clicking the mobile hamburger icon
menu.addEventListener('click', () => {
    toggleMenu();
});

//clicking any section to close the side menu
for (let i = 0; i < section.length; i++) {
    section[i].addEventListener('click', () => {
        toggleMenu();
    })
}

//clicking any menu item to close the side menu
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', () => {
        toggleMenu();
    })
}