export const API = {
    BASE_URL: 'https://pokeapi.co/api/v2/pokemon/',
    PAGE_SIZE: 24,
    SUGGEST_LIMIT: 8
};

export const DOM = {
    grid: document.querySelector('.pokemon-grid'),
    pagination: document.querySelector('.pagination'),
    searchInput: document.querySelector('.search-bar input'),
    searchIcon: document.querySelector('.search-bar .fa-search'),
    suggestions: document.getElementById('suggestions')
};