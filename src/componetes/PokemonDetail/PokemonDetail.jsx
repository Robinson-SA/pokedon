import './PokemonDetail.css';
import { usePokemon } from '../../hooks/usePokemon';

function PokemonDetail({ pokemonName, onClose }) {
  const { pokemon, loading, error } = usePokemon(pokemonName);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal__loading">Cargando detalles...</div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal__error">Error al cargar los detalles</div>
          <button onClick={onClose} className="modal__close-btn">Cerrar</button>
        </div>
      </div>
    );
  }

  const types = pokemon.types || [];
  const stats = pokemon.stats || [];
  const abilities = pokemon.abilities || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>&times;</button>

        <div className="pokemon-detail">
          <div className="pokemon-detail__image-section">
            {pokemon.sprites?.other?.['official-artwork']?.front_default ? (
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="pokemon-detail__image"
              />
            ) : (
              <div className="pokemon-detail__no-image">Sin imagen disponible</div>
            )}
          </div>

          <div className="pokemon-detail__info-section">
            <h2 className="pokemon-detail__name">{pokemon.name}</h2>

            <div className="pokemon-detail__id-height-weight">
              <span className="detail-item">
                <strong>ID:</strong> #{pokemon.id}
              </span>
              <span className="detail-item">
                <strong>Altura:</strong> {pokemon.height / 10} m
              </span>
              <span className="detail-item">
                <strong>Peso:</strong> {pokemon.weight / 10} kg
              </span>
            </div>

            <div className="pokemon-detail__types">
              <strong>Tipo(s):</strong>
              <div className="types-list">
                {types.map((typeObj) => (
                  <span
                    key={typeObj.type.name}
                    className={`type-badge type-${typeObj.type.name}`}
                  >
                    {typeObj.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pokemon-detail__abilities">
              <strong>Habilidades:</strong>
              <div className="abilities-list">
                {abilities.map((abilityObj) => (
                  <span key={abilityObj.ability.name} className="ability-badge">
                    {abilityObj.ability.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pokemon-detail__stats">
              <strong>Estadísticas:</strong>
              <div className="stats-container">
                {stats.map((statObj) => (
                  <div key={statObj.stat.name} className="stat-item">
                    <span className="stat-name">{statObj.stat.name}</span>
                    <div className="stat-bar">
                      <div
                        className="stat-bar__fill"
                        style={{
                          width: `${Math.min((statObj.base_stat / 150) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="stat-value">{statObj.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
