document.addEventListener('DOMContentLoaded', function() {
    let videos = document.querySelectorAll('.videos iframe');
    let randomButton = document.getElementById('randomButton');

    randomButton.addEventListener('click', function() {
        videos.forEach(function(video) {
            video.style.display = 'none';
        });

        let randomIndex = Math.floor(Math.random() * videos.length);
        let randomVideo = videos[randomIndex];
        
        randomVideo.style.display = 'block';
    });
});


