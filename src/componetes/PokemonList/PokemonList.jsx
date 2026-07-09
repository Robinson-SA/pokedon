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
  const [favorites, setFavorites] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const FAVORITES_KEY = 'pokedex_favorites';
  const BLOCKED_KEY = 'pokedex_blocked';
  const SEARCH_KEY = 'pokedex_searchTerm';
  const TYPE_KEY = 'pokedex_selectedType';
  const GENERATION_KEY = 'pokedex_selectedGeneration';

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

  const toggleBlocked = (pokemonName) => {
    setBlocked((prevBlocked) => {
      const isBlocked = prevBlocked.includes(pokemonName);
      const nextBlocked = isBlocked
        ? prevBlocked.filter((name) => name !== pokemonName)
        : [pokemonName, ...prevBlocked];
      return nextBlocked;
    });
  };

  const isBlocked = (pokemonName) => blocked.includes(pokemonName);

  const toggleFavorite = (pokemonName) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(pokemonName);
      const nextFavorites = isFavorite
        ? prevFavorites.filter((name) => name !== pokemonName)
        : [pokemonName, ...prevFavorites];
      return nextFavorites;
    });
  };

  const isFavorite = (pokemonName) => favorites.includes(pokemonName);

  const fetchPokemonList = async (newOffset = 0) => {
    try {
      setLoading(true);
      const data = await getPokemonList(limit, newOffset);
      const updatedList = newOffset === 0 ? data.results : [...pokemonList, ...data.results];
      setPokemonList(updatedList);
      setDisplayedList(applySearchFilter(updatedList).filter((pokemon) => !isBlocked(pokemon.name)));
      setHasMore(data.next !== null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial: solicita páginas hasta alcanzar al menos `minCount` ítems
  const loadInitialPokemon = async (minCount = 100) => {
    try {
      setLoading(true);
      let localList = [];
      let localOffset = 0;
      let localHasMore = true;

      while (localList.length < minCount && localHasMore) {
        const data = await getPokemonList(limit, localOffset);
        const pageItems = data.results || [];
        localList = localOffset === 0 ? pageItems : [...localList, ...pageItems];
        localHasMore = data.next !== null;
        localOffset += limit;
        if (!localHasMore) break;
      }

      setPokemonList(localList);
      setDisplayedList(applySearchFilter(localList).filter((pokemon) => !isBlocked(pokemon.name)));
      setHasMore(localHasMore);
      setOffset(localOffset - limit >= 0 ? localOffset - limit : 0);
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
    const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);
    const savedBlocked = window.localStorage.getItem(BLOCKED_KEY);
    const savedSearchTerm = window.localStorage.getItem(SEARCH_KEY);
    const savedType = window.localStorage.getItem(TYPE_KEY);
    const savedGeneration = window.localStorage.getItem(GENERATION_KEY);

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {b
        console.warn('No se pudo parsear favoritos de localStorage:', err);
      }
    }

    if (savedBlocked) {
      try {
        setBlocked(JSON.parse(savedBlocked));
      } catch (err) {
        console.warn('No se pudo parsear bloqueados de localStorage:', err);
      }
    }

    if (savedSearchTerm) setSearchTerm(savedSearchTerm);
    if (savedType) setSelectedType(savedType);
    if (savedGeneration) setSelectedGeneration(savedGeneration);

    fetchTypeAndGenerationOptions();
    loadInitialPokemon(100);
  }, []);

  useEffect(() => {
    if (selectedType || selectedGeneration) {
      fetchFilteredPokemon();
    } else {
      setDisplayedList(applySearchFilter(pokemonList).filter((pokemon) => !isBlocked(pokemon.name)));
    }
  }, [searchTerm, selectedType, selectedGeneration, pokemonList, blocked]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(BLOCKED_KEY, JSON.stringify(blocked));
  }, [blocked]);

  useEffect(() => {
    window.localStorage.setItem(SEARCH_KEY, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    window.localStorage.setItem(TYPE_KEY, selectedType);
  }, [selectedType]);

  useEffect(() => {
    window.localStorage.setItem(GENERATION_KEY, selectedGeneration);
  }, [selectedGeneration]);

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
              <PokemonCard
                pokemon={pokemon}
                onClick={() => setSelectedPokemon(pokemon.name)}
                isFavorite={isFavorite(pokemon.name)}
                isBlocked={isBlocked(pokemon.name)}
                onToggleBlocked={() => toggleBlocked(pokemon.name)}
                onToggleFavorite={() => toggleFavorite(pokemon.name)}
              />
            </div>
          ))}
        </div>

        {isLoading && <div className="pokemon-list__loading">Cargando...</div>}

        {!selectedType && !selectedGeneration && hasMore && !isLoading && pokemonList.length >= 100 && (
          <button className="pokemon-list__load-more" onClick={handleLoadMore}>
            Cargar más
          </button>
        )}
      </div>

      <aside className="pokemon-favorites-panel">
        <div className="pokemon-favorites-panel__header">
          <h2>Favoritos</h2>
          <p>{favorites.length} Pokémon guardados</p>
        </div>

        {favorites.length === 0 ? (
          <div className="pokemon-favorites-panel__empty">
            No hay favoritos aún. Usa la estrella para marcar uno.
          </div>
        ) : (
          <div className="pokemon-favorites-list">
            {favorites.map((name) => (
              <div
                key={name}
                className="pokemon-favorites-item"
                onClick={() => setSelectedPokemon(name)}
              >
                <span>{name}</span>
                <div className="pokemon-favorites-item-actions">
                  <button
                    type="button"
                    className="pokemon-favorites-item__remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(name);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pokemon-blocked-panel">
          <div className="pokemon-blocked-panel__header">
            <h2>Bloqueados</h2>
            <p>{blocked.length} Pokémon bloqueados</p>
          </div>

          {blocked.length === 0 ? (
            <div className="pokemon-blocked-panel__empty">
              Ningún pokémon bloqueado. Presiona el candado para bloquear uno.
            </div>
          ) : (
            <div className="pokemon-blocked-list">
              {blocked.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="pokemon-blocked-item"
                  onClick={() => toggleBlocked(name)}
                >
                  <span>{name}</span>
                  <span className="pokemon-blocked-item__unlock">🔓</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

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
