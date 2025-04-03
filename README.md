# ASIMOV Map Module

> **Note:** This package isn’t published to npm. You can install it directly from GitHub.

## Installation from GitHub

```bash
npm install --save git+https://github.com/asimov-protocol/asimov-map-module.git
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
    />
  )
}
```

## Props

| Prop            | Type                                            | Default     | Description                                                                                  |
|-----------------|-------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| **data**        | `SparqlBinding[]`                               | *none*      | SPARQL data to display on the map.                                                          |
| **exportJSON**  | `(labels: LabelInfo[], feature: any) => void`   | *none*      | A callback to export feature data. If not provided, the export functionality is disabled.    |
| **mapCenter**   | `[number, number]`                              | `[0, 0]`    | The initial center of the map in [longitude, latitude] format.                              |
| **initialZoom** | `number`                                        | `2`         | The map’s initial zoom level.                                                               |
| **showHeatmap** | `boolean`                                       | `false`     | Whether to display a heatmap layer.                                                         |
| **onFeatureClick** | `(feature: Feature) => void`                 | *none*      | Callback triggered when a feature is clicked.                                               |
| **showPopup**   | `boolean`                                       | `true`      | If true, shows a popup on feature click.                                                    |
| **className**   | `string`                                        | `''`        | Additional CSS class names for the map container.                                           |
| **style**       | `React.CSSProperties`                           | *none*      | Optional inline styles for the map container.                                               |

## Preview


<img width="866" alt="Знімок екрана 2025-04-03 о 19 53 54" src="https://github.com/user-attachments/assets/c964f5ff-1d4d-4450-9592-aa31537c2076" />
