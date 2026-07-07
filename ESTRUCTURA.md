# Pokédex - Aplicación React con Vite

Una aplicación moderna para explorar Pokémon desde la PokeAPI, con componentes bien organizados en carpetas.

## 🏗️ Estructura del Proyecto

```
src/
├── componetes/                   # Componentes React
│   ├── PokemonList/             # Listado principal de Pokémon
│   │   ├── PokemonList.jsx      # Componente principal del listado
│   │   └── PokemonList.css      # Estilos del listado
│   ├── PokemonCard/             # Tarjeta individual de Pokémon
│   │   ├── PokemonCard.jsx      # Componente de tarjeta
│   │   └── PokemonCard.css      # Estilos de tarjeta
│   ├── PokemonDetail/           # Modal de detalles del Pokémon
│   │   ├── PokemonDetail.jsx    # Componente de detalles
│   │   └── PokemonDetail.css    # Estilos del modal
│   ├── lista_pokemon.jsx        # (Archivo legacy - vacío)
│   └── index.js                 # Exportaciones de componentes
├── services/                     # Servicios de API
│   ├── pokemonService.js        # Funciones para llamar a PokeAPI
│   └── index.js                 # Exportaciones de servicios
├── hooks/                        # Hooks personalizados
│   ├── usePokemon.js            # Hook para obtener detalles de Pokémon
│   └── index.js                 # Exportaciones de hooks
├── assets/                       # Archivos estáticos
├── App.jsx                       # Componente principal
├── App.css                       # Estilos globales
├── main.jsx                      # Punto de entrada
└── index.css                     # Estilos CSS globales
```

## 🚀 Características

- **Listado de Pokémon**: Visualiza 20 Pokémon a la vez con opción de cargar más
- **Imágenes Oficiales**: Muestra la imagen oficial de cada Pokémon desde la PokeAPI
- **Detalles Interactivos**: Haz clic en un Pokémon para ver sus detalles completos
- **Modal de Detalles**: Visualiza:
  - Imagen grande del Pokémon
  - ID y número Pokédex
  - Altura y peso
  - Tipos (con colores distintivos)
  - Habilidades
  - Estadísticas (Ataque, Defensa, Velocidad, etc.)
- **Diseño Responsivo**: Se adapta perfectamente a dispositivos móviles
- **Gradient Hermoso**: Interfaz moderna con gradientes púrpura-azul

## 📦 Componentes

### PokemonList
Componente principal que maneja:
- Estado del listado de Pokémon
- Paginación con botón "Cargar más"
- Selección de Pokémon para ver detalles
- Estilos del fondo gradiente

### PokemonCard
Tarjeta individual que muestra:
- Imagen del Pokémon
- Nombre
- ID/Número Pokédex
- Efecto hover animado

### PokemonDetail
Modal con detalles completos:
- Información detallada del Pokémon
- Estadísticas visualizadas con barras de progreso
- Tipos de Pokémon con colores específicos
- Botón para cerrar el modal

## 🎣 Hooks Personalizados

### usePokemon
Hook que:
- Obtiene detalles de un Pokémon por nombre o ID
- Maneja estados de carga y error
- Cachea automáticamente los datos

## 🔧 Servicios de API

### pokemonService.js
Funciones disponibles:
- `getPokemonList(limit, offset)` - Obtiene listado paginado
- `getPokemonDetails(nameOrId)` - Obtiene detalles de un Pokémon
- `getPokemonSpecies(nameOrId)` - Obtiene información de la especie

## 🎨 Paleta de Colores

- **Primario**: `#667eea` (Azul-púrpura)
- **Secundario**: `#764ba2` (Púrpura oscuro)
- **Fondo**: Gradiente lineal 135deg

### Colores de Tipos de Pokémon
- Normal: `#A8A878`
- Fire: `#F08030`
- Water: `#6890F0`
- Grass: `#78C850`
- Electric: `#F8D030`
- Y muchos más...

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm build

# Previsualizar build
npm preview
```

## 📚 API Utilizada

- **PokeAPI v2**: https://pokeapi.co/api/v2/

## 💻 Tecnologías

- React 19
- Vite 8
- CSS3 (sin framework)
- PokeAPI

## 📝 Notas de Desarrollo

- Cada componente tiene su propia carpeta con archivos `.jsx` y `.css`
- Los servicios están centralizados en la carpeta `services/`
- Los hooks están en la carpeta `hooks/`
- Se utilizan exportaciones de índice para facilitar las importaciones
- Las llamadas a la API manejan errores de forma apropiada
- Los estilos son modulares y reutilizables

## 🎯 Próximas Mejoras Posibles

- [ ] Búsqueda por nombre
- [ ] Filtro por tipo
- [ ] Favoritos guardados en localStorage
- [ ] Comparar Pokémon
- [ ] Evluciones del Pokémon
- [ ] Más información (movimientos, ubicaciones)

---

**Disfruta explorando la Pokédex** 🎮✨
