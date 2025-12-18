export async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao buscar: ${url}`);
    }
    return response.json();
}

export function fetchPokemonList(url) {
    return fetchJson(url);
}

export function fetchPokemonDetails(url) {
    return fetchJson(url);
}

export async function loadAllPokemons(baseUrl) {
    const data = await fetchJson(`${baseUrl}?limit=2000`);
    return data.results || [];
}