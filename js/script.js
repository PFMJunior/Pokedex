document.addEventListener('DOMContentLoaded', () => {
    const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
    const pokemonGrid = document.querySelector('.pokemon-grid' );
    const paginationContainer = document.querySelector('.pagination');

    let currentUrl = `${POKEMON_API_URL}?limit=24&offset=0`;

    // Função para buscar os dados da API
    async function fetchAndRenderPokemons(url) {
        if (!pokemonGrid) return;

        // guarda URL atual (usada para navegação)
        currentUrl = url;

        pokemonGrid.innerHTML = '<p>Carregando Pokémon...</p>'; // Feedback de carregamento

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Para cada Pokémon na lista, buscamos os detalhes individuais
            const pokemonDetailsPromises = data.results.map(pokemon => fetchPokemonDetails(pokemon.url));
            const pokemons = await Promise.all(pokemonDetailsPromises);

            renderPokemons(pokemons);

            // calcula paginação numerada a partir do URL (limit/offset)
            try {
                const urlObj = new URL(url);
                const limit = parseInt(urlObj.searchParams.get('limit')) || 24;
                const offset = parseInt(urlObj.searchParams.get('offset')) || 0;
                const currentPage = Math.floor(offset / limit) + 1;
                const totalPages = Math.max(1, Math.ceil((data.count || pokemons.length) / limit));
                renderPagination(data.previous, data.next, currentPage, totalPages, limit);
            } catch (e) {
                // fallback: apenas prev/next
                renderPagination(data.previous, data.next, 1, 1, 24);
            }

        } catch (error) {
            console.error('Erro ao buscar a lista de Pokémon:', error);
            pokemonGrid.innerHTML = '<p>Não foi possível carregar os Pokémon. Tente novamente mais tarde.</p>';
        }
    }

    // Função para buscar os detalhes de um Pokémon específico
    async function fetchPokemonDetails(url) {
        const response = await fetch(url);
        return await response.json();
    }

    // Função para criar o HTML do card
    function createPokemonCard(pokemon) {
        const id = pokemon.id.toString().padStart(3, '0');
        const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const type = pokemon.types[0].type.name;
        const typeName = type.charAt(0).toUpperCase() + type.slice(1);
        // prefira artwork oficial, senão sprites padrões
        const imageUrl = (pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && pokemon.sprites.other['official-artwork'].front_default)
            || (pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other.dream_world && pokemon.sprites.other.dream_world.front_default)
            || pokemon.sprites.front_default
            || '';

        // Adiciona uma classe genérica e uma específica para o tipo
        return `
            <div class="pokemon-card">
                <div class="card-header">
                    <span class="pokemon-type type-${type}">${typeName}</span>
                    <span class="pokemon-number">#${id}</span>
                </div>
                <div class="card-image">
                    <img src="${imageUrl}" alt="${name}" onerror="this.onerror=null;this.src='assets/images/bulbasaur.png';">
                </div>
                <div class="card-name">${name}</div>
            </div>
        `;
    }

    // Função para renderizar os cards no grid
    function renderPokemons(pokemons) {
        pokemonGrid.innerHTML = pokemons.map(createPokemonCard).join('');
    }

    // Função para renderizar a paginação
    function renderPagination(prevUrl, nextUrl, currentPage = 1, totalPages = 1, limit = 24) {
        if (!paginationContainer) return;

        paginationContainer.innerHTML = ''; // Limpa a paginação estática

        // botão anterior
        const createBtn = (text, cls = '') => {
            const a = document.createElement('a');
            a.href = '#';
            a.className = cls;
            a.textContent = text;
            return a;
        };

        const prev = createBtn('← Anterior', 'prev-next');
        if (currentPage === 1) prev.classList.add('disabled');
        prev.addEventListener('click', (e) => { e.preventDefault(); if (currentPage > 1) fetchAndRenderPokemons(`${POKEMON_API_URL}?limit=${limit}&offset=${(currentPage-2)*limit}`); });
        paginationContainer.appendChild(prev);

        // números (exibe até 7 botões com deslocamento)
        const maxButtons = 7;
        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let end = Math.min(totalPages, start + maxButtons - 1);
        if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

        if (start > 1) {
            const first = createBtn('1', 'page-number');
            first.addEventListener('click', (e) => { e.preventDefault(); fetchAndRenderPokemons(`${POKEMON_API_URL}?limit=${limit}&offset=0`); });
            paginationContainer.appendChild(first);
            if (start > 2) {
                const dots = document.createElement('span'); dots.textContent = '...'; dots.style.padding = '0 6px'; paginationContainer.appendChild(dots);
            }
        }

        for (let p = start; p <= end; p++) {
            const btn = createBtn(String(p), 'page-number');
            if (p === currentPage) btn.classList.add('active');
            btn.addEventListener('click', (e) => { e.preventDefault(); fetchAndRenderPokemons(`${POKEMON_API_URL}?limit=${limit}&offset=${(p-1)*limit}`); });
            paginationContainer.appendChild(btn);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                const dots = document.createElement('span'); dots.textContent = '...'; dots.style.padding = '0 6px'; paginationContainer.appendChild(dots);
            }
            const last = createBtn(String(totalPages), 'page-number');
            last.addEventListener('click', (e) => { e.preventDefault(); fetchAndRenderPokemons(`${POKEMON_API_URL}?limit=${limit}&offset=${(totalPages-1)*limit}`); });
            paginationContainer.appendChild(last);
        }

        // botão próximo
        const next = createBtn('Próximo →', 'prev-next');
        if (currentPage >= totalPages) next.classList.add('disabled');
        next.addEventListener('click', (e) => { e.preventDefault(); if (currentPage < totalPages) fetchAndRenderPokemons(`${POKEMON_API_URL}?limit=${limit}&offset=${currentPage*limit}`); });
        paginationContainer.appendChild(next);
    }

    // Busca por nome (endpoint /pokemon/{name}) e renderiza um único card
    async function searchByName(name) {
        if (!name || !name.trim()) return loadInitial();
        const q = name.trim().toLowerCase();
        pokemonGrid.innerHTML = '<p>Buscando Pokémon...</p>';
        try {
            const res = await fetch(POKEMON_API_URL + q);
            if (!res.ok) throw new Error('Não encontrado');
            const data = await res.json();
            renderPokemons([data]);

            // mostrar botão para voltar (limpar busca)
            paginationContainer.innerHTML = '';
            const clear = document.createElement('a');
            clear.href = '#';
            clear.className = 'prev-next';
            clear.textContent = 'Voltar';
            clear.addEventListener('click', (e) => { e.preventDefault(); loadInitial(); });
            paginationContainer.appendChild(clear);
        } catch (err) {
            console.error('Erro na busca por nome:', err);
            pokemonGrid.innerHTML = `<p>Pokémon "${name}" não encontrado.</p>`;
            paginationContainer.innerHTML = '';
            const clear = document.createElement('a');
            clear.href = '#';
            clear.className = 'prev-next';
            clear.textContent = 'Voltar';
            clear.addEventListener('click', (e) => { e.preventDefault(); loadInitial(); });
            paginationContainer.appendChild(clear);
        }
    }

    // Recarrega a listagem inicial (página 1)
    function loadInitial() {
        currentUrl = `${POKEMON_API_URL}?limit=24&offset=0`;
        fetchAndRenderPokemons(currentUrl);
        // limpa input de busca se existir
        const input = document.querySelector('.search-bar input');
        if (input) input.value = '';
    }

    // --- carregar lista completa para sugestões e iniciar a listagem inicial ---
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar .fa-search');
    const suggestionsEl = document.getElementById('suggestions');

    // cache com todos os pokémons (name + url)
    let allPokemons = [];
    let debounceTimer = null;
    let highlightedIndex = -1;
    const SUGGEST_LIMIT = 8;

    async function loadAllPokemons() {
        try {
            const res = await fetch(`${POKEMON_API_URL}?limit=2000`);
            const json = await res.json();
            allPokemons = (json.results || []).map(p => ({ name: p.name, url: p.url }));
        } catch (e) {
            console.error('Falha ao carregar lista completa de pokémons:', e);
            allPokemons = [];
        }
    }

    function showSuggestions(items) {
        suggestionsEl.innerHTML = '';
        if (!items.length) { hideSuggestions(); return; }
        items.forEach((it, idx) => {
            const li = document.createElement('li');
            li.className = 'suggestion-item';
            li.setAttribute('role', 'option');
            li.setAttribute('data-name', it.name);
            li.tabIndex = -1;
            // bold the matched part
            const q = (searchInput.value || '').trim().toLowerCase();
            const name = it.name;
            const start = name.indexOf(q);
            if (start >= 0) {
                li.innerHTML = `<strong>${name.slice(0, start + q.length)}</strong>${name.slice(start + q.length)}`;
            } else {
                li.textContent = name;
            }
            li.addEventListener('click', () => {
                searchInput.value = it.name;
                hideSuggestions();
                searchByName(it.name);
            });
            suggestionsEl.appendChild(li);
        });
        highlightedIndex = -1;
        suggestionsEl.hidden = false;
    }

    function hideSuggestions() {
        if (!suggestionsEl) return;
        suggestionsEl.hidden = true;
        suggestionsEl.innerHTML = '';
        highlightedIndex = -1;
    }

    function highlightSuggestion(idx) {
        const items = Array.from(suggestionsEl.children);
        items.forEach((el, i) => el.classList.toggle('highlight', i === idx));
        highlightedIndex = idx;
    }

    // atualiza grid conforme o usuário digita (debounced)
    function handleInputDebounced() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const q = (searchInput.value || '').trim().toLowerCase();
            if (!q) {
                hideSuggestions();
                return loadInitial();
            }

            // filtra lista local
            const matches = allPokemons.filter(p => p.name.includes(q)).slice(0, 100);
            showSuggestions(matches.slice(0, SUGGEST_LIMIT));

            // buscar detalhes dos primeiros matches até PAGE size (para não sobrecarregar)
            const toFetch = matches.slice(0, 24);
            if (!toFetch.length) {
                pokemonGrid.innerHTML = `<p>Nenhum pokémon encontrado para "${q}".</p>`;
                paginationContainer.innerHTML = '';
                return;
            }

            pokemonGrid.innerHTML = '<p>Carregando resultados...</p>';
            try {
                const details = await Promise.all(toFetch.map(it => fetchPokemonDetails(it.url).catch(() => null)));
                renderPokemons(details.filter(Boolean));
                paginationContainer.innerHTML = '';
                const back = document.createElement('a');
                back.href = '#';
                back.className = 'prev-next';
                back.textContent = 'Voltar';
                back.addEventListener('click', (e) => { e.preventDefault(); loadInitial(); });
                paginationContainer.appendChild(back);
            } catch (e) {
                console.error('Erro ao buscar detalhes durante digitação:', e);
            }
        }, 220);
    }

    // carregar lista completa e iniciar listagem
    loadAllPokemons().then(() => fetchAndRenderPokemons(currentUrl));

    // eventos do input para sugestões e live search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (!searchInput.value.trim()) return loadInitial();
            handleInputDebounced();
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = Array.from(suggestionsEl ? suggestionsEl.children : []);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!items.length) return;
                const next = Math.min(items.length - 1, highlightedIndex + 1);
                highlightSuggestion(next);
                items[next].scrollIntoView({ block: 'nearest' });
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!items.length) return;
                const prev = Math.max(0, highlightedIndex - 1);
                highlightSuggestion(prev);
                items[prev].scrollIntoView({ block: 'nearest' });
                return;
            }
            if (e.key === 'Enter') {
                if (highlightedIndex >= 0 && items[highlightedIndex]) {
                    e.preventDefault();
                    const name = items[highlightedIndex].getAttribute('data-name');
                    searchInput.value = name;
                    hideSuggestions();
                    return searchByName(name);
                }
                const q = searchInput.value.trim();
                if (q) { e.preventDefault(); return searchByName(q); }
            }
            if (e.key === 'Escape') {
                hideSuggestions();
                return loadInitial();
            }
        });

        // clique fora fecha sugestões
        document.addEventListener('click', (ev) => {
            if (!ev.target.closest('.search-bar')) hideSuggestions();
        });
    } else {
        // se não houver input, apenas inicia listagem
        fetchAndRenderPokemons(currentUrl);
    }

    if (searchIcon) {
        searchIcon.style.cursor = 'pointer';
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const q = searchInput ? searchInput.value.trim() : '';
            if (!q) return loadInitial();
            searchByName(q);
        });
    }
});