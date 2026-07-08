import { useState, useEffect } from 'react';
import './PokemonList.css';
import PokemonCard from '../PokemonCard/PokemonCard';
import PokemonDetail from '../PokemonDetail/PokemonDetail';
import {
  getPokemonList,
  getTypeList,
  getGenerationList,
  getPokemonByType,
  getPokemonByGeneration,
} from '../../services/pokemonService';

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayedList, setDisplayedList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [generationOptions, setGenerationOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  const normalizeList = (items) =>
    items.map((item) => ({
      name: item.name,
      url: item.url || `https://pokeapi.co/api/v2/pokemon/${item.name}`,
    }));

  const applySearchFilter = (list) => {
    const query = searchTerm.trim().charAt(0).toLowerCase();
    if (!query) return list;
    return list.filter((pokemon) => pokemon.name.startsWith(query));
  };

  const fetchPokemonList = async (newOffset = 0) => {
    try {
      setLoading(true);
      const data = await getPokemonList(limit, newOffset);
      const updatedList = newOffset === 0 ? data.results : [...pokemonList, ...data.results];
      setPokemonList(updatedList);
      setDisplayedList(applySearchFilter(updatedList));
      setHasMore(data.next !== null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypeAndGenerationOptions = async () => {
    try {
      const [typesData, generationsData] = await Promise.all([getTypeList(), getGenerationList()]);
      setTypeOptions(typesData.results || []);
      setGenerationOptions(generationsData.results || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFilteredPokemon = async () => {
    try {
      setFiltering(true);
      setError(null);

      let results = [];

      if (selectedType && selectedGeneration) {
        const [typeData, generationData] = await Promise.all([
          getPokemonByType(selectedType),
          getPokemonByGeneration(selectedGeneration),
        ]);

        const generationNames = new Set(
          (generationData.pokemon_species || []).map((item) => item.name),
        );

        results = (typeData.pokemon || [])
          .map((item) => ({ name: item.pokemon.name, url: item.pokemon.url }))
          .filter((pokemon) => generationNames.has(pokemon.name));
      } else if (selectedType) {
        const typeData = await getPokemonByType(selectedType);
        results = (typeData.pokemon || []).map((item) => ({ name: item.pokemon.name, url: item.pokemon.url }));
      } else if (selectedGeneration) {
        const generationData = await getPokemonByGeneration(selectedGeneration);
        results = (generationData.pokemon_species || []).map((item) => ({
          name: item.name,
          url: `https://pokeapi.co/api/v2/pokemon/${item.name}`,
        }));
      } else {
        results = pokemonList;
      }

      setDisplayedList(applySearchFilter(results));
    } catch (err) {
      setError(err.message);
    } finally {
      setFiltering(false);
    }
  };

  useEffect(() => {
    fetchTypeAndGenerationOptions();
    fetchPokemonList(0);
  }, []);

  useEffect(() => {
    if (selectedType || selectedGeneration) {
      fetchFilteredPokemon();
    } else {
      setDisplayedList(applySearchFilter(pokemonList));
    }
  }, [searchTerm, selectedType, selectedGeneration, pokemonList]);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchPokemonList(newOffset);
  };

  const isLoading = loading || filtering;

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-list">
        <header className="pokemon-list__header">
          <h1>Pokédex</h1>
          <p>Explora todos los Pokémon</p>
        </header>

        <div className="pokemon-list__controls">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por primera letra"
            className="pokemon-list__search"
          />

          <select
            value={selectedType}
            onChange={(event) => {
              setSelectedType(event.target.value);
              setSelectedGeneration('');
            }}
            className="pokemon-list__select"
          >
            <option value="">Filtrar por tipo elemental</option>
            {typeOptions.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            value={selectedGeneration}
            onChange={(event) => {
              setSelectedGeneration(event.target.value);
              setSelectedType('');
            }}
            className="pokemon-list__select"
          >
            <option value="">Filtrar por generación</option>
            {generationOptions.map((generation) => (
              <option key={generation.name} value={generation.name}>
                {generation.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="pokemon-list__error">Error: {error}</div>}

        <div className="pokemon-grid">
          {displayedList.map((pokemon) => (
            <div key={pokemon.name} onClick={() => setSelectedPokemon(pokemon.name)}>
              <PokemonCard pokemon={pokemon} onClick={() => setSelectedPokemon(pokemon.name)} />
            </div>
          ))}
        </div>

        {isLoading && <div className="pokemon-list__loading">Cargando...</div>}

        {!selectedType && !selectedGeneration && hasMore && !isLoading && (
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
