# Asimov Map Module

## Usage Examples

Below are basic examples of how to use some of the main components in this library within a React application.

### MapView

```tsx
import React from 'react'
import { MapView } from 'asimov-map-module'

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

## Installation

To use this module, make sure you install the latest version of Tailwind CSS:

```bash
npm install tailwindcss@latest
```

And follow the [Tailwind CSS installation guide](https://tailwindcss.com/docs/installation) to set it up in your project.
