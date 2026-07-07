# 📚 Guía de Referencia Rápida - Pokédex

## ⚡ Inicio Rápido

```bash
# 1. Navegar al proyecto
cd d:\visual_estudio\pokedon

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir navegador en
http://localhost:5174/
```

## 🎯 Componentes Principales

### 1️⃣ PokemonList
**Función**: Listado principal con paginación
**Ubicación**: [src/componetes/PokemonList/PokemonList.jsx](src/componetes/PokemonList/PokemonList.jsx)
**Props**: Ninguna (es el componente raíz)
**Características**:
- Carga 20 Pokémon por página
- Botón "Cargar más" para paginación
- Maneja estado de selección de Pokémon
- Abre modal al seleccionar

```jsx
<PokemonList />
```

### 2️⃣ PokemonCard
**Función**: Tarjeta individual de Pokémon
**Ubicación**: [src/componetes/PokemonCard/PokemonCard.jsx](src/componetes/PokemonCard/PokemonCard.jsx)
**Props**:
```jsx
<PokemonCard
  pokemon={{ name: 'bulbasaur' }}
  onClick={() => {}}
/>
```

### 3️⃣ PokemonDetail
**Función**: Modal con detalles completos
**Ubicación**: [src/componetes/PokemonDetail/PokemonDetail.jsx](src/componetes/PokemonDetail/PokemonDetail.jsx)
**Props**:
```jsx
<PokemonDetail
  pokemonName="pikachu"
  onClose={() => {}}
/>
```

## 🔗 Servicios de API

### pokemonService.js

```javascript
import { getPokemonList, getPokemonDetails } from '@/services';

// Obtener listado paginado
const data = await getPokemonList(50, 0);
// Retorna: { results: [...], next: '...', previous: null }

// Obtener detalles de un Pokémon
const pokemon = await getPokemonDetails('pikachu');
// Retorna: { id, name, sprites, types, stats, abilities, ... }

// Obtener información de especie
const species = await getPokemonSpecies('pikachu');
```

## 🪝 Hooks Personalizados

### usePokemon

```javascript
import { usePokemon } from '@/hooks';

// Uso en componente
const { pokemon, loading, error } = usePokemon('charizard');

if (loading) return <div>Cargando...</div>;
if (error) return <div>Error: {error}</div>;

return <div>{pokemon.name}</div>;
```

## 🎨 Sistema de Colores

### Colores Principales
```css
--primary: #667eea;      /* Azul-púrpura */
--primary-dark: #764ba2; /* Púrpura oscuro */
--text: #333;            /* Texto oscuro */
--bg: #fff;              /* Fondo blanco */
```

### Colores de Tipos
Cada tipo de Pokémon tiene un color específico:
- **Normal**: #A8A878
- **Fire**: #F08030
- **Water**: #6890F0
- **Grass**: #78C850
- **Electric**: #F8D030
- **Ice**: #98D8D8
- **Fighting**: #C03028
- **Poison**: #A040A0
- **Ground**: #E0C068
- **Flying**: #A890F0
- **Psychic**: #F85888
- **Bug**: #A8B820
- **Rock**: #B8A038
- **Ghost**: #705898
- **Dragon**: #7038F8
- **Dark**: #705848
- **Steel**: #B8B8D0
- **Fairy**: #EE99AC

## 📊 Estructura de Datos

### Objeto Pokémon (listado)
```javascript
{
  name: "bulbasaur",      // Nombre en minúsculas
  url: "https://..."      // URL de la API
}
```

### Objeto Pokémon Detallado
```javascript
{
  id: 1,
  name: "bulbasaur",
  height: 7,              // En decímetros (0.7m)
  weight: 69,             // En hectogramos (6.9kg)
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://..."
      }
    }
  },
  types: [
    {
      type: { name: "grass" },
      slot: 1
    }
  ],
  stats: [
    { base_stat: 45, stat: { name: "hp" } },
    // más stats...
  ],
  abilities: [
    { ability: { name: "overgrow" } },
    // más habilidades...
  ]
}
```

## 🛠️ Cómo Modificar Componentes

### Cambiar cantidad de Pokémon por página
**Archivo**: [src/componetes/PokemonList/PokemonList.jsx](src/componetes/PokemonList/PokemonList.jsx)
**Línea**: `const limit = 20;`
**Cambiar**: `const limit = 50;`

### Cambiar colores de la app
**Archivo**: [src/index.css](src/index.css)
**Buscar**: `:root { --primary: #667eea; }`
**Cambiar**: A cualquier color hex

### Agregar nuevo tipo de Pokémon
**Archivo**: [src/componetes/PokemonDetail/PokemonDetail.css](src/componetes/PokemonDetail/PokemonDetail.css)
**Agregar**: `.type-nuevo { background: #XXXXXX; }`

## 📱 Responsive Design

La aplicación se adapta automáticamente:
- **Desktop**: Grid de 5 columnas
- **Tablet**: Grid de 3 columnas
- **Móvil**: Grid de 2-3 columnas

## 🐛 Debugging

### Ver solicitudes a API
1. Abre DevTools (F12)
2. Ve a pestaña Network
3. Filtra por "pokeapi.co"

### Ver estado de componentes
1. Instala React DevTools extension
2. Abre React tab en DevTools
3. Navega por el árbol de componentes

## 📖 Ejemplos de Uso

### Agregar búsqueda por nombre
```jsx
// En PokemonList.jsx
const [search, setSearch] = useState('');

const filtered = pokemonList.filter(p =>
  p.name.includes(search.toLowerCase())
);
```

### Guardar favoritos en localStorage
```jsx
// En PokemonCard.jsx
const toggleFavorite = (name) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
};
```

## 🚀 Deployment

```bash
# Build para producción
npm run build

# Los archivos compilados estarán en /dist

# Previsualizar build
npm run preview
```

## 📞 Recursos

- **PokeAPI Docs**: https://pokeapi.co/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vite.dev
- **MDN Web Docs**: https://developer.mozilla.org

---

**¡Diviértete desarrollando!** 🚀✨
