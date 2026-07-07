# 💻 Documentación Técnica - Pokédex

## Archivos Creados

### Componentes React

#### 1. PokemonList - Listado Principal
**Archivo**: `src/componetes/PokemonList/PokemonList.jsx`

```jsx
// Responsable de:
- Obtener listado paginado de PokeAPI
- Renderizar grid de tarjetas
- Manejar paginación
- Mostrar modal de detalles

// Estado:
- pokemonList: Array de pokémon
- loading: boolean para estado de carga
- error: mensaje de error
- selectedPokemon: nombre del pokémon seleccionado
- offset: para paginación
- hasMore: si hay más páginas
```

**Características importantes**:
- Carga inicial 20 Pokémon
- Botón "Cargar más" agrega 20 más
- Efecto hover en tarjetas
- Diseño responsive (grid dinámico)
- Gradient púrpura de fondo

---

#### 2. PokemonCard - Tarjeta Individual
**Archivo**: `src/componetes/PokemonCard/PokemonCard.jsx`

```jsx
// Props:
- pokemon: { name: string, url: string }
- onClick: function

// Características:
- Obtiene detalles del Pokémon con usePokemon
- Muestra imagen oficial
- Muestra nombre e ID
- Efecto hover (translateY)
- Estado de "Cargando..."
```

**Imagen usada**:
- `sprites.other['official-artwork'].front_default` (imagen oficial)

---

#### 3. PokemonDetail - Modal de Detalles
**Archivo**: `src/componetes/PokemonDetail/PokemonDetail.jsx`

```jsx
// Props:
- pokemonName: string (nombre del Pokémon)
- onClose: function

// Muestra:
1. Imagen grande del Pokémon
2. Nombre y ID
3. Altura y Peso
4. Tipos (con colores)
5. Habilidades
6. Estadísticas (con barras)
   - HP
   - Ataque
   - Defensa
   - Ataque Especial
   - Defensa Especial
   - Velocidad
```

**Características técnicas**:
- Modal overlay con click-outside para cerrar
- Barras de estadísticas escaladas a 150
- Colores codificados por tipo de Pokémon
- Responsivo (2 columnas en desktop, 1 en móvil)

---

### Servicios

#### pokemonService.js
**Archivo**: `src/services/pokemonService.js`

```javascript
// 1. getPokemonList(limit, offset)
// - Obtiene lista paginada de Pokémon
// - Parámetros: limit=50, offset=0 (números)
// - Retorna: { results: [...], next: URL|null, previous: URL|null }
const data = await getPokemonList(20, 0);

// 2. getPokemonDetails(nameOrId)
// - Obtiene detalles completos de un Pokémon
// - Parámetro: nombre (string) o ID (number)
// - Retorna: Objeto con toda la información
const pokemon = await getPokemonDetails('pikachu');
const pokemon = await getPokemonDetails(25);

// 3. getPokemonSpecies(nameOrId)
// - Obtiene información de la especie
// - Parámetro: nombre o ID
// - Retorna: Información taxonómica
const species = await getPokemonSpecies('pikachu');

// Manejo de errores:
// Todas las funciones lanzan excepciones que deben ser capturadas
try {
  const data = await getPokemonList();
} catch (error) {
  console.error('Error:', error.message);
}
```

---

### Hooks Personalizados

#### usePokemon
**Archivo**: `src/hooks/usePokemon.js`

```javascript
// Sintaxis:
const { pokemon, loading, error } = usePokemon(nameOrId);

// Retorna:
{
  pokemon: {
    id, name, height, weight,
    sprites, types, stats, abilities, ...
  },
  loading: boolean,    // true mientras carga
  error: string|null   // mensaje de error o null
}

// Comportamiento:
- Se ejecuta cuando nameOrId cambia
- Cachea automáticamente (setState prev)
- Maneja loading y error states
- Limpia efectos al desmontar

// Ejemplo:
function MiComponente() {
  const [pokemonName, setPokemonName] = useState('pikachu');
  const { pokemon, loading, error } = usePokemon(pokemonName);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return <h2>{pokemon.name}</h2>;
}
```

---

## 🎨 Estilos CSS

### Variables de Color
**Archivo**: `src/index.css`

```css
:root {
  --primary: #667eea;      /* Azul-púrpura */
  --primary-dark: #764ba2; /* Púrpura oscuro */
  --text: #333;
  --text-light: #666;
  --bg: #fff;
  --border: #e5e4e7;
  --shadow: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, ...;
}
```

### Grid Responsivo
**Archivo**: `src/componetes/PokemonList/PokemonList.css`

```css
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}
```

### Modal Overlay
**Archivo**: `src/componetes/PokemonDetail/PokemonDetail.css`

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
```

---

## 📊 Flujo de Datos

```
User interacción
    ↓
App.jsx (componente raíz)
    ↓
PokemonList (obtiene listado)
    ↓
  ├─→ pokemonService.getPokemonList()
  │     ↓
  │   PokeAPI Response
  │     ↓
  │   return Datos
  │
  └─→ Renderiza N × PokemonCard
        ├─→ usePokemon (obtiene detalles)
        │     ├─→ pokemonService.getPokemonDetails()
        │     ├─→ PokeAPI Response
        │     └─→ return Estado actualizado
        │
        └─→ PokemonCard renderiza tarjeta
              ↓
          Click en tarjeta
              ↓
          setSelectedPokemon(name)
              ↓
          PokemonDetail en modal (usa usePokemon)
              ↓
          Muestra detalles del Pokémon
```

---

## 🔧 Configuración de Vite

**Archivo**: `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: 'localhost'
  }
});
```

---

## 📦 Dependencias

```json
{
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "vite": "^8.1.1",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^10.6.0"
  }
}
```

---

## 🚀 Procesos

### Build para Producción
```bash
npm run build
# Genera /dist con archivos optimizados
```

### Linting
```bash
npm run lint
# Valida código con ESLint
```

### Preview
```bash
npm run preview
# Previsualiza el build producción
```

---

## 🐛 Casos de Uso

### 1. Agregar búsqueda
```jsx
// En PokemonList.jsx, modificar:
const [search, setSearch] = useState('');

const displayed = pokemonList.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
);
```

### 2. Agregar filtro por tipo
```jsx
// En PokemonList.jsx:
const [selectedType, setSelectedType] = useState(null);

const filtered = pokemonList.filter(p => {
  if (!selectedType) return true;
  return pokemon.types.some(t => t.type.name === selectedType);
});
```

### 3. Guardar favoritos
```jsx
// En PokemonCard.jsx:
const saveFavorite = (pokemonName) => {
  const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!saved.includes(pokemonName)) {
    saved.push(pokemonName);
    localStorage.setItem('favorites', JSON.stringify(saved));
  }
};
```

---

## 📚 Estructura de Carpetas Final

```
d:\visual_estudio\pokedon
├── src/
│   ├── componetes/
│   │   ├── PokemonList/
│   │   │   ├── PokemonList.jsx
│   │   │   └── PokemonList.css
│   │   ├── PokemonCard/
│   │   │   ├── PokemonCard.jsx
│   │   │   └── PokemonCard.css
│   │   ├── PokemonDetail/
│   │   │   ├── PokemonDetail.jsx
│   │   │   └── PokemonDetail.css
│   │   ├── lista_pokemon.jsx (legacy)
│   │   └── index.js
│   ├── services/
│   │   ├── pokemonService.js
│   │   └── index.js
│   ├── hooks/
│   │   ├── usePokemon.js
│   │   └── index.js
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
├── ESTRUCTURA.md
└── GUIA_RAPIDA.md
```

---

## ✅ Checklist de Implementación

- ✅ Componente PokemonList (listado + paginación)
- ✅ Componente PokemonCard (tarjeta con imagen)
- ✅ Componente PokemonDetail (modal con detalles)
- ✅ Service pokemonService (llamadas a API)
- ✅ Hook usePokemon (lógica de fetch reutilizable)
- ✅ Estilos responsivos
- ✅ Colores por tipo de Pokémon
- ✅ Estadísticas con barras visuales
- ✅ Manejo de errores
- ✅ Cargar más (paginación)
- ✅ Documentación completa

---

**¡Proyecto completado exitosamente!** 🎉
