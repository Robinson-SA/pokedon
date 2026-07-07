import { useState, useEffect } from 'react';
import { getPokemonDetails } from '../services/pokemonService';

export const usePokemon = (nameOrId) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nameOrId) return;

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const data = await getPokemonDetails(nameOrId);
        setPokemon(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [nameOrId]);

  return { pokemon, loading, error };
};
