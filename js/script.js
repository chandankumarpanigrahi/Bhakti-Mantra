// Dark Mode Functions
function initDarkMode() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeButton(darkModeEnabled);
}

function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    // Update button icon
    updateDarkModeButton(isDarkMode);
}

function updateDarkModeButton(isDarkMode) {
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
        darkModeBtn.innerHTML = isDarkMode ? 
            '<i class="bi bi-sun-fill"></i>' : 
            '<i class="bi bi-moon-fill"></i>';
    }
}

// Add dark mode toggle button to navbar
function addDarkModeButton() {
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg navbar-dark bg-dark mb-4';
    nav.innerHTML = `
        <div class="container">
            <a class="navbar-brand" href="index.html">ଓଡ଼ିଆ ଭଜନ</a>
            <button id="dark-mode-toggle" class="btn btn-outline-light" onclick="toggleDarkMode()">
                <i class="bi"></i>
            </button>
        </div>
    `;
    document.body.insertBefore(nav, document.body.firstChild);
}

// Initialize when DOM is ready
$(document).ready(function() {
    // Add Bootstrap Icons
    $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">');
    
    addDarkModeButton();
    initDarkMode();
    
    // Load data from JSON file
    $.getJSON('data/lyrics.json', function(data) {
        window.lyricsData = data;
        
        // Check which page we're on
        const path = window.location.pathname.split('/').pop();
        
        if (path === 'index.html' || path === '') {
            loadCategories();
        } else if (path === 'categories.html') {
            loadCategoryLyrics();
        } else if (path === 'lyric-detail.html') {
            loadLyricDetail();
        }
    }).fail(function() {
        alert('Error loading lyrics data');
    });
});

function loadCategories() {
    const container = $('#categories-container');
    
    window.lyricsData.categories.forEach(category => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <p class="card-text text-muted">${category.lyrics.length} ଭଜନ</p>
                        <a href="categories.html?category=${category.id}" class="btn btn-orange">ଦେଖନ୍ତୁ</a>
                    </div>
                </div>
            </div>
        `;
        container.append(card);
    });
}

function loadCategoryLyrics() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    
    const category = window.lyricsData.categories.find(cat => cat.id === categoryId);
    
    if (!category) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title and heading
    document.title = category.name;
    $('#category-title').text(category.name);
    $('#category-heading').text(category.name);
    
    const container = $('#lyrics-container');
    
    category.lyrics.forEach(lyric => {
        const card = `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${lyric.title}</h5>
                        <a href="lyric-detail.html?category=${categoryId}&lyric=${lyric.id}" class="btn btn-outline-orange">ପଢ଼ନ୍ତୁ</a>
                    </div>
                </div>
            </div>
        `;
        container.append(card);
    });
}

function loadLyricDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const lyricId = urlParams.get('lyric');
    
    const category = window.lyricsData.categories.find(cat => cat.id === categoryId);
    if (!category) {
        window.location.href = 'index.html';
        return;
    }
    
    const lyric = category.lyrics.find(l => l.id === lyricId);
    if (!lyric) {
        window.location.href = 'categories.html?category=' + categoryId;
        return;
    }
    
    // Update page title and heading
    document.title = lyric.title;
    $('#lyric-title').text(lyric.title);
    $('#lyric-heading').text(lyric.title);
    $('#lyric-content').text(lyric.content);
    
    // Set back button URL
    $('#back-button').attr('href', 'categories.html?category=' + categoryId);
}