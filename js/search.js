import { fetchPokemonDetails } from './api.js';
import { showLoading, hideLoading, renderPokemons } from './render.js';
import { loadInitialPage } from './main.js';
import { DOM } from './config.js';
import { state } from './state.js';

let debounceTimer;
const SUGGEST_LIMIT = 8;

/* Input com debounce */

export function handleInputDebounced() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        const query = DOM.searchInput.value.trim().toLowerCase();

        // 🔄 Input limpo → volta para listagem inicial
        if (!query) {
            hideSuggestions();
            hideLoading();
            return loadInitialPage();
        }

        // Filtragem local
        const matches = state.allPokemons.filter(pokemon => {
            const q = query.toLowerCase();

            const matchName = pokemon.name.includes(q);
            const matchType = pokemon.types.some(type => type.includes(q));
            const matchGen =
                q === `gen${pokemon.generation}` ||
                q === `generation ${pokemon.generation}`;

            return matchName || matchType || matchGen;
        });

        // Sugestões
        showSuggestions(matches.slice(0, SUGGEST_LIMIT), query);

        // Atualiza grid em tempo real
        showLoading('Buscando Pokémon...');
        DOM.pagination.innerHTML = '';

        const toRender = matches.slice(0, 24);

        const details = await Promise.all(
            toRender.map(p =>
                fetchPokemonDetails(p.url).catch(() => null)
            )
        );

        hideLoading();
        renderPokemons(details.filter(Boolean));
    }, 200);
}

/* Busca direta (Enter)   */

export async function searchByName(name) {
    const query = name.trim().toLowerCase();
    if (!query) return loadInitialPage();

    hideSuggestions();
    showLoading('Buscando Pokémon...');
    DOM.pagination.innerHTML = '';

    try {
        const pokemon = await fetchPokemonDetails(
            `https://pokeapi.co/api/v2/pokemon/${query}`
        );

        hideLoading();
        renderPokemons([pokemon]);
    } catch {
        hideLoading();
        DOM.grid.innerHTML = `<p>Pokémon "${name}" não encontrado.</p>`;
    }
}

/* Suggestions helpers    */

function showSuggestions(items, query) {
    DOM.suggestions.innerHTML = '';

    if (!items.length) return hideSuggestions();

    items.forEach(pokemon => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        li.dataset.name = pokemon.name;

        const start = pokemon.name.indexOf(query);

        li.innerHTML =
            start >= 0
                ? `<strong>${pokemon.name.slice(0, start + query.length)}</strong>${pokemon.name.slice(start + query.length)}`
                : pokemon.name;

        li.onclick = () => {
            DOM.searchInput.value = pokemon.name;
            hideSuggestions();
            searchByName(pokemon.name);
        };

        DOM.suggestions.appendChild(li);
    });

    DOM.suggestions.hidden = false;
}

function hideSuggestions() {
    DOM.suggestions.hidden = true;
    DOM.suggestions.innerHTML = '';
}
