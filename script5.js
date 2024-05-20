const songs = [
    
    {
        title: "Qala-Amit Trivedi-Sagar Desai",
        artist: "Amit TrivediAmitabh BhattacharyaSir...",
        cover: "Ghodey Pe Sawaar.png",
        file: "Ghodey Pe Sawaar.mp3"
    },
    {
        title: "Qala-Amit Trivedi-Rubaaiyaan",
        artist: "Amit TrivediSwanand KirkireShahid...",
        cover: "Rubaaiyaan.png",
        file: "Rubaaiyaan.mp3"
    },
    {
        title: "Qala-Amit Trivedi-Phero Na Najariya",
        artist: "Amit TrivediKausar MunirSireesha...",
        cover: "qala.png",
        file: "Phero Na Najariya.mp3"
    },
    {
        title: "Qala-Amit Trivedi-Shauq",
        artist: "Amit TrivediVarun GroverShahid Mal...",
        cover: "Shauq.png",
        file: "Shauq.mp3"
    },
    {
        title: "Qala-Amit Trivedi-Nirbhau Nirvair",
        artist: "Amit TrivediSant KabirAnvita DuttSh...",
        cover: "qala.png",
        file: "Nirbhau Nirvair.mp3"
    },
    {
        title: "Qala-Amit Trivedi-Udh Jaayega",
        artist: "Amit TrivediAmitabh BhattacharyaSir...",
        cover: "qala.png",
        file: "Udh Jaayega.mp3"
    },
];

let currentSongIndex = 0;
let isPlaying = false;

const audio = new Audio(songs[currentSongIndex].file);
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.querySelector(".progress-container");
const playlist = document.getElementById("playlist");
const searchInput = document.getElementById("search");
const volumeControl = document.getElementById("volume");
const playlistList = document.getElementById("playlist-list");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    cover.src = song.cover;
    audio.src = song.file;
}

function playSong() {
    isPlaying = true;
    audio.play();
    playBtn.innerHTML = "<button id='pause'><i class='fas fa-pause'></i></button>";
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = "<button id='play'><i class='fas fa-play'></i></button>";
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
    updatePlaylist();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
    updatePlaylist();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function updatePlaylist() {
    const allItems = playlist.querySelectorAll("li");
    allItems.forEach((item) => item.classList.remove("active"));
    allItems[currentSongIndex].classList.add("active");
}

function displaySongs(filteredSongs) {
    playlist.innerHTML = "";
    filteredSongs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.innerText = `${song.title} - ${song.artist}`;
        songItem.setAttribute("data-index", index);
        if (index === currentSongIndex) songItem.classList.add("active");
        playlist.appendChild(songItem);
    });
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);

playlist.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "LI") {
        currentSongIndex = parseInt(e.target.getAttribute("data-index"));
        loadSong(songs[currentSongIndex]);
        playSong();
        updatePlaylist();
    }
});

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredSongs = songs.filter((song) => 
        song.title.toLowerCase().includes(searchTerm) || 
        song.artist.toLowerCase().includes(searchTerm)
    );
    displaySongs(filteredSongs);
});

volumeControl.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

playlistList.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "LI") {
        const playlistName = e.target.getAttribute("data-playlist");
        const filteredSongs = playlistName === "favorites" ? songs.filter(song => song.favorite) : songs;
        displaySongs(filteredSongs);
        document.querySelectorAll("#playlist-list li").forEach(item => item.classList.remove("active"));
        e.target.classList.add("active");
    }
});

shuffleBtn.addEventListener("click", () => {
    songs.sort(() => Math.random() - 0.5);
    currentSongIndex = 0;
    loadSong(songs[currentSongIndex]);
    playSong();
    updatePlaylist();
});

repeatBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    repeatBtn.classList.toggle("active", audio.loop);
});

displaySongs(songs);
loadSong(songs[currentSongIndex]);
updatePlaylist();
const addToFavoritesBtn = document.getElementById("addToFavorites");

// Function to toggle favorite status of a song
function toggleFavorite() {
    const currentSong = songs[currentSongIndex];
    currentSong.favorite = !currentSong.favorite;
    // Update button text and icon based on favorite status
    addToFavoritesBtn.innerHTML = `<i class="fas fa-heart${currentSong.favorite ? " active" : ""}"></i> ${currentSong.favorite ? "" : ""}`;
    
    // Toggle the "active" class
    addToFavoritesBtn.classList.toggle("active", currentSong.favorite);
}

// Add event listener for the "Add to Favorites" button
addToFavoritesBtn.addEventListener("click", toggleFavorite);
