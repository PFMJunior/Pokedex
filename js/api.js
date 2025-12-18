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
    const response = await fetch(`${baseUrl}?limit=2000`);
    const data = await response.json();

    const detailed = await Promise.all(
        data.results.map(async p => {
            const res = await fetch(p.url);
            const details = await res.json();

            return {
                name: p.name,
                url: p.url,
                types: details.types.map(t => t.type.name),
                generation: Math.ceil(details.id / 151) // gen 1, 2, 3...
            };
        })
    );

    return detailed;
}