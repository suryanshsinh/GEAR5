// JavaScript for toggling the menu and changing the button image
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const menuBtn = document.querySelector('.menu-btn');
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const overlay = document.querySelector('.overlay');

    const isOpen = menu.style.left === '0px';
    overlay.style.display = isOpen ? 'none' : 'block';
    menu.style.left = isOpen ? '-100%' : '0px';
    menu.classList.toggle('open');



    // Toggle the blur effect on main and header
    main.classList.toggle('blur-effect', !isOpen);
    header.classList.toggle('blur-effect', !isOpen);

    // Toggle between open.png and close.png with a transition
    const newImage = isOpen ? 'open.png' : 'close.png';
    menuBtn.style.transition = 'background-image 0.3s ease-out';
    menuBtn.style.backgroundImage = `url('/images/${newImage}')`;

    // Reset the transition after a delay to avoid affecting other styles
    setTimeout(() => {
        menuBtn.style.transition = '';
    }, 300);
}

// Run this code on page load to hide the overlay initially
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
});
