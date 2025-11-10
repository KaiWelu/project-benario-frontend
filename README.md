## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Map

This project uses [MapLibre](https://maplibre.org/maplibre-style-spec/layers/) and the react wrapper [react-maplibre](https://visgl.github.io/react-maplibre/docs/api-reference/layer) to display data on openstreet maps.

Maplibre will be used for standard map funcionallity and [deck.gl](https://deck.gl/) will be used to display layers of huge datasets.

### Icons

The icons used in this project are from [Lucide](https://lucide.dev/guide/)

### Graphs and Bars

Data will be displayed with [Nivo](https://nivo.rocks/)

### State Management

Global state will be managed by [Redux](https://react-redux.js.org/)

#### basic scheme on how to work with data and layers

Redux State (What to show)
↓
Config Files (How to calculate & display)
↓
Component (Rendering)
