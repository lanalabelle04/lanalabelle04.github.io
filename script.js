
document.addEventListener('DOMContentLoaded', function() {
    const projectDropdown = document.querySelector('.project-dropdown');
    const projectTitles = document.querySelector('.project-titles');
    
    projectDropdown.addEventListener('click', function() {
        projectTitles.classList.toggle('visible');
        projectDropdown.classList.toggle('active'); 
    });
}); 