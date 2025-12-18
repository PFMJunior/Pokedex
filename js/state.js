import { API } from './config.js';

export const state = {
    currentUrl: `${API.BASE_URL}?limit=${API.PAGE_SIZE}&offset=0`,
    allPokemons: [],
    debounceTimer: null,
    highlightedIndex: -1
};