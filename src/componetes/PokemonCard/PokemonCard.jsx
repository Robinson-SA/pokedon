import './PokemonCard.css';
import { usePokemon } from '../../hooks/usePokemon';

function PokemonCard({ pokemon, onClick }) {
  const { pokemon: details, loading } = usePokemon(pokemon.name);

  return (
    <div className="pokemon-card" onClick={onClick}>
      {loading ? (
        <div className="pokemon-card__placeholder">Cargando...</div>
      ) : (
        <>
          <div className="pokemon-card__image-container">
            {details?.sprites?.other?.['official-artwork']?.front_default ? (
              <img
                src={details.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="pokemon-card__image"
              />
            ) : (
              <div className="pokemon-card__no-image">Sin imagen</div>
            )}
          </div>
          <div className="pokemon-card__info">
            <h3 className="pokemon-card__name">{pokemon.name}</h3>
            <p className="pokemon-card__id">#{details?.id}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default PokemonCard;
