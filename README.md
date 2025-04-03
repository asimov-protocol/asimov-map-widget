# Asimov Map Module

## Installation


```bash
npm install asimov-map-module
```

## Usage Examples

Below are basic examples of how to use some of the main components in this library within a React application.

### MapView

```tsx
import React from 'react';
import { MapView } from 'asimov-map-module';
import 'asimov-map-module/dist/asimov-map-module.css';

export function MyMap() {
  return (
    <MapView
      data={{ results: { bindings: [] } }} // Provide SPARQL data
      mapCenter={[0, 0]}
      initialZoom={2}
      showHeatmap={false}
      onFeatureClick={(feature) => console.log('Feature:', feature)}
      showPopup={true}
      className="h-96 w-full"
    />
  )
}
```
