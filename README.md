# Asimov Map Module

## Installation

```bash
npm install asimov-map-module
```

## Usage Example

```tsx
import React from 'react'
import { MapView } from 'asimov-map-module'
import 'asimov-map-module/dist/asimov-map-module.css'

export function MyMap() {
  return (
    <MapView
      data={[]} // Provide SPARQL data
      onFeatureClick={(feature) => console.log('Feature:', feature)}
      className="h-96 w-full"
    />
  )
}
```

## Props

| Prop           | Type                                   | Default     | Description                                                                                  |
|----------------|----------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| **data**       | `SparqlBinding[]`                      | *none*      | SPARQL data to display on the map.                                                          |
| **exportJSON** | `(labels: LabelInfo[], feature: any) => void` | *none*      | A callback to export feature data. If not provided, the export functionality is disabled.    |
| **mapCenter**  | `[number, number]`                     | `[0, 0]`    | The initial center of the map in [longitude, latitude] format.                              |
| **initialZoom**| `number`                               | `2`         | The map’s initial zoom level.                                                               |
| **showHeatmap**| `boolean`                              | `false`     | Whether to display a heatmap layer.                                                         |
| **onFeatureClick** | `(feature: Feature) => void`       | *none*      | Callback triggered when a feature is clicked.                                               |
| **showPopup**  | `boolean`                              | `true`      | If true, shows a popup on feature click.                                                    |
| **className**  | `string`                               | `''`        | Additional CSS class names for the map container.                                           |

> **Note:** Make sure to include or configure Tailwind CSS if you want to use the library’s Tailwind classes out of the box. Otherwise, you can style the container and elements as needed in your own CSS.
