import { DOM } from './config.js';

export function showGridMessage(message) {
    if (DOM.grid) {
        DOM.grid.innerHTML = `<p>${message}</p>`;
    }
}

export function createPokemonCard(pokemon) {
    const id = pokemon.id.toString().padStart(3, '0');
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const type = pokemon.types[0].type.name;
    const typeName = type.charAt(0).toUpperCase() + type.slice(1);

    const image =
        pokemon.sprites?.other?.['official-artwork']?.front_default ||
        pokemon.sprites?.other?.dream_world?.front_default ||
        pokemon.sprites?.front_default ||
        '';

    return `
        <div class="pokemon-card">
            <div class="card-header">
                <span class="pokemon-type type-${type}">${typeName}</span>
                <span class="pokemon-number">#${id}</span>
            </div>
            <div class="card-image">
                <img src="${image}" alt="${name}"
                     onerror="this.onerror=null;this.src='assets/images/bulbasaur.png';">
            </div>
            <div class="card-name">${name}</div>
        </div>
    `;
}

export function renderPokemons(pokemons) {
    if (!DOM.grid) return;
    DOM.grid.innerHTML = pokemons.map(createPokemonCard).join('');
}

export function clearPagination() {
    if (DOM.pagination) {
        DOM.pagination.innerHTML = '';
    }
}

export function showLoading(message = 'Carregando Pokémon...') {
    let overlay = document.querySelector('.loading-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        document.body.appendChild(overlay);
    }

    overlay.textContent = message;
}

export function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.remove();
}