import { state } from './state.js';
import { API, DOM } from './config.js';
import { renderPagination } from './pagination.js';
import { searchByName, handleInputDebounced } from './search.js';
import { showLoading, hideLoading, renderPokemons } from './render.js';
import { fetchPokemonList, fetchPokemonDetails, loadAllPokemons } from './api.js';

export async function loadPokemonPage(url) {
    state.currentUrl = url;
    showLoading();

    const data = await fetchPokemonList(url);
    const pokemons = await Promise.all(
        data.results.map(p => fetchPokemonDetails(p.url))
    );

    renderPokemons(pokemons);
    hideLoading();

    const params = new URL(url).searchParams;
    const limit = Number(params.get('limit')) || API.PAGE_SIZE;
    const offset = Number(params.get('offset')) || 0;

    renderPagination(
        Math.floor(offset / limit) + 1,
        Math.ceil(data.count / limit),
        limit
    );
}

export function loadInitialPage() {
    if (DOM.searchInput) DOM.searchInput.value = '';
    loadPokemonPage(`${API.BASE_URL}?limit=${API.PAGE_SIZE}&offset=0`);
}

document.addEventListener('DOMContentLoaded', async () => {
    state.allPokemons = await loadAllPokemons(API.BASE_URL);

    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', handleInputDebounced);
        DOM.searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchByName(DOM.searchInput.value);
            }
        });
    }

    if (DOM.searchIcon) {
        DOM.searchIcon.onclick = () => searchByName(DOM.searchInput.value);
    }

    loadInitialPage();
});