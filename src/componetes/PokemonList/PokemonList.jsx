import { useState, useEffect } from 'react';
import './PokemonList.css';
import PokemonCard from '../PokemonCard/PokemonCard';
import PokemonDetail from '../PokemonDetail/PokemonDetail';
import { getPokemonList } from '../../services/pokemonService';

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  const fetchPokemonList = async (newOffset = 0) => {
    try {
      setLoading(true);
      const data = await getPokemonList(limit, newOffset);
      if (newOffset === 0) {
        setPokemonList(data.results);
      } else {
        setPokemonList((prev) => [...prev, ...data.results]);
      }
      setHasMore(data.next !== null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonList(0);
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchPokemonList(newOffset);
  };

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-list">
        <header className="pokemon-list__header">
          <h1>Pokédex</h1>
          <p>Explora todos los Pokémon</p>
        </header>

        {error && <div className="pokemon-list__error">Error: {error}</div>}

        <div className="pokemon-grid">
          {pokemonList.map((pokemon) => (
            <div key={pokemon.name} onClick={() => setSelectedPokemon(pokemon.name)}>
              <PokemonCard pokemon={pokemon} onClick={() => setSelectedPokemon(pokemon.name)} />
            </div>
          ))}
        </div>

        {loading && <div className="pokemon-list__loading">Cargando...</div>}

        {hasMore && !loading && (
          <button className="pokemon-list__load-more" onClick={handleLoadMore}>
            Cargar más
          </button>
        )}
      </div>

      {selectedPokemon && (
        <PokemonDetail
          pokemonName={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}

export default PokemonList;
