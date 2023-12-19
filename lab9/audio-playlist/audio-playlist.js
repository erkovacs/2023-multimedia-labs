'use strict';

const app = {
    audio: null,
    tracks: [], //track list
    currentUrl: null,
    scrubber: null,
    volume: null
};

/** Plays a song 
 * @param {string} url - The url of the song 
 */
app.play = function (url) {
    // Remove the `active` class from the li corresponding to the previous song
    let element = document.querySelector('[data-url].active');
    if (element !== null)
        element.classList.remove('active');

    // Change the song
    app.audio.src = app.currentUrl = url;
    app.audio.play();

    // Add the `active` class to the li corresponding to the current song
    element = document.querySelector('[data-url="' + url + '"]');
    element.classList.add('active');

    app.scrubber.disabled = false;
}

/** Changes the current song */
app.next = function () {
    let index = app.tracks.indexOf(app.currentUrl) + 1;
    if (index >= app.tracks.length) {
        index = 0;
    }

    app.play(app.tracks[index]);
}

app.load = function () {
    app.audio = document.getElementById('audio');
    const btnPlayPause = document.getElementById('btnPlayPause');

    const currentVolume = localStorage.getItem('currentVolume');
    if (currentVolume) {
        app.audio.volume = parseFloat(currentVolume);
    }

    const currentTime = localStorage.getItem('currentTime');
    if (currentTime) {
        app.audio.currentTime = parseFloat(currentTime);
    }

    const currentSong = localStorage.getItem('currentSong');
    if (currentSong) {
        app.audio.play(currentSong);
    }

    // Iterate over the playlist in order to associate events
    const elements = document.querySelectorAll('[data-url]');
    for (let i = 0; i < elements.length; i++) {

        const url = elements[i].dataset.url;
        app.tracks.push(url);

        elements[i].addEventListener('click', function () {
            app.play(this.dataset.url);
        });
    }

    // Initialise the scrubber 
    app.scrubber = document.getElementById('scrubber');

    // Initialize the volume control
    app.volume = document.getElementById('volume');

    // Handle the timeupdate event
    app.audio.addEventListener('durationchange', function(){
        const duration = document.querySelector('#duration');
        duration.textContent = app.secondsToString(app.audio.duration);
    });

    app.audio.addEventListener('timeupdate', function () {
        const currentTime = document.getElementById("currentTime");

        // Set scrubber position
        app.scrubber.value = app.audio.currentTime / app.audio.duration * app.scrubber.max;

        if (app.audio.duration) {
            currentTime.textContent = app.secondsToString(app.audio.currentTime);
        }
        else {
            //innerText can also be used
            //differences https://www.w3schools.com/jsref/prop_html_innerhtml.asp
            currentTime.textContent = '...';
        };
    });

    // Handle the play event
    app.audio.addEventListener('play', function () {
        //alternative: btnPlayPause.children[0].classList.replace('fa-play', 'fa-pause');
        btnPlayPause.children[0].classList.remove('fa-play');
        btnPlayPause.children[0].classList.add('fa-pause');
    });

    // Handle the pause event
    app.audio.addEventListener('pause', function () {
        btnPlayPause.children[0].classList.add('fa-play');
        btnPlayPause.children[0].classList.remove('fa-pause');
    });

    // Handle the ended event
    app.audio.addEventListener('ended', app.next);

    // Handle the click event btnPlayPause
    document.getElementById('btnPlayPause').addEventListener('click', function () {
        if (app.audio.src === "") {
            app.play(app.tracks[0]);
        } else {
            if (app.audio.paused) {
                app.audio.play();
            }
            else {
                app.audio.pause();
            }
        }
    });

    // Handle the click event on btnForward
    document.getElementById('btnForward').addEventListener('click', function () {
        app.audio.currentTime += 10;
    });

    // Handle the click event on btnNext
    document.getElementById('btnNext').addEventListener('click', app.next);

    // Handle the change (user scrubbing) event on the scrubber
    app.scrubber.addEventListener('change', e => {
        app.audio.currentTime =  app.scrubber.value / app.scrubber.max * app.audio.duration;
    });

    // Handle the change event for the volume
    app.volume.addEventListener('change', e => {
        // app.audio.volume = app.volume.value / app.volume.max * app.audio.volume;
        app.audio.volume = app.volume.value;
        console.log(app.audio.volume);
    });

    window.addEventListener('beforeunload', e => {
        const currentActiveItem = document.querySelector('.list-group-item.active');
        if (currentActiveItem) {
            localStorage.setItem('currentSong', currentActiveItem.dataset.url);
        } else {
            localStorage.removeItem('currentSong');
        }

        localStorage.setItem('currentTime', app.audio.currentTime);
        localStorage.setItem('currentVolume', app.audio.volume);
    });
};

/**
* A utility function for converting a time in miliseconds to a readable time of minutes and seconds.
* @param {number} seconds The time in seconds.
* @return {string} The time in minutes and/or seconds.
**/
app.secondsToString = function (seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    min = min >= 10 ? min : '0' + min;
    sec = sec >= 10 ? sec : '0' + sec;
    
    const time = min + ':' + sec;

    return time;
};