const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 50, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Error al obtener lista de Pokémon');
    return await response.json();
  } catch (error) {
    console.error('Error en getPokemonList:', error);
    throw error;
  }
};

export const getPokemonDetails = async (nameOrId) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) throw new Error('Error al obtener detalles del Pokémon');
    return await response.json();
  } catch (error) {
    console.error('Error en getPokemonDetails:', error);
    throw error;
  }
};

export const getPokemonSpecies = async (nameOrId) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
    if (!response.ok) throw new Error('Error al obtener especie del Pokémon');
    return await response.json();
  } catch (error) {
    console.error('Error en getPokemonSpecies:', error);
    throw error;
  }
};
