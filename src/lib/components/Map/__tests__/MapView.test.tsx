import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import { MapView } from '../index'

vi.mock('ol/Map', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setTarget: vi.fn(),
      getView: vi.fn(() => ({
        fit: vi.fn(),
      })),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      addControl: vi.fn(),
      on: vi.fn(),
      un: vi.fn(),
      removeControl: vi.fn(),
    })),
  }
})

vi.mock('ol/View', () => {
  return {
    default: vi.fn(),
  }
})

vi.mock('ol/layer/Tile', () => {
  return {
    default: vi.fn(),
  }
})

vi.mock('ol/layer/Heatmap', () => {
  return {
    default: vi.fn(),
  }
})

vi.mock('ol/layer/WebGLVector', () => {
  return {
    default: vi.fn(),
  }
})

vi.mock('ol/source/OSM', () => {
  return {
    default: vi.fn(),
  }
})

vi.mock('ol/Overlay', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setPosition: vi.fn(),
    })),
  }
})

describe('MapView Component', () => {
  it('renders without crashing', () => {
    render(
      <MapView
        data={[
          {
            geometry: {
              value: 'POINT(0 0)',
              type: 'literal',
              datatype: 'http://www.opengis.net/ont/geosparql#wktLiteral',
            },
          },
        ]}
      />
    )
    const mapContainer = screen.getByTestId('open-street-map-element')
    expect(mapContainer).toBeInTheDocument()
  })
})
