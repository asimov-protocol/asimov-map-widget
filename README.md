# ASIMOV Map Widget

> **Note:** This package isn’t published to npm. You can install it directly from GitHub.

<img width="866" alt="preview-screenshot" src="https://github.com/user-attachments/assets/c964f5ff-1d4d-4450-9592-aa31537c2076" />

## Installation from GitHub

```bash
npm install --save git+https://github.com/asimov-protocol/asimov-map-widget.git
```

>**Important:** Since `react` and `react-dom` are marked as peer dependencies, please make sure that you also install them in your project:

```bash
npm install react react-dom
```

## Usage Example

```tsx
import React from 'react'
import { MapView } from 'asimov-map-widget'
import 'asimov-map-widget/dist/asimov-map-widget.css'

export function MyMap() {
  return (
    <MapView
      data={[]} // Provide SPARQL data
    />
  )
}
```

## Props

| Prop               | Type                                          | Default   | Description                                                                                  |
|--------------------|-----------------------------------------------|-----------|----------------------------------------------------------------------------------------------|
| **data**           | `SparqlBinding[]`                             | *none*    | SPARQL data to display on the map.                                                           |
| **exportJSON**     | `(labels: LabelInfo[], feature: any) => void`   | *none*    | A callback to export feature data. If not provided, the export functionality is disabled.    |
| **mapCenter**      | `[number, number]`                            | `[0, 0]`  | The initial center of the map in [longitude, latitude] format.                               |
| **initialZoom**    | `number`                                      | `2`       | The map’s initial zoom level.                                                                |
| **showHeatmap**    | `boolean`                                     | `false`   | Whether to display a heatmap layer.                                                          |
| **onFeatureClick** | `(feature: Feature) => void`                    | *none*    | Callback triggered when a feature is clicked.                                              |
| **showPopup**      | `boolean`                                     | `true`    | If true, shows a popup on feature click.                                                     |
| **className**      | `string`                                      | `''`      | Additional CSS class names for the map container.                                            |
| **style**          | `React.CSSProperties`                         | *none*    | Optional inline styles for the map container.                                                |
