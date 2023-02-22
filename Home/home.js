const getStartBtn = document.querySelector('#get-start-btn'),
    startSection = document.querySelector('.instruction'),
    uploadSection = document.querySelector('#upload'),
    signupBtn = document.querySelector('#sign-up-btn');

getStartBtn.addEventListener('click', () => {
    startSection.classList.add('active');
});

signupBtn.addEventListener('click', () => {
    startSection.classList.add('active');
});

startSection.addEventListener('click', () => {
    startSection.classList.remove('active');
    uploadSection.scrollIntoView();
});