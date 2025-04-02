import React, { useEffect, useRef } from 'react'
import 'ol/ol.css'
import OlMap from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import HeatmapLayer from 'ol/layer/Heatmap'
import WKT from 'ol/format/WKT'
import OLFeature from 'ol/Feature'
import Geometry from 'ol/geom/Geometry'
import Polygon from 'ol/geom/Polygon'
import MultiPolygon from 'ol/geom/MultiPolygon'
import Point from 'ol/geom/Point'
import { Style, Stroke, Fill } from 'ol/style'
import { Extent, getCenter } from 'ol/extent'
import { MapBrowserEvent } from 'ol'
import ModeControl from './ModeControl'

export interface SparqlBinding {
  [key: string]: {
    value: string
    type: string
    datatype?: string
  }
}

export interface SparqlData {
  results: {
    bindings: SparqlBinding[]
  }
}

export interface DataMapViewProps {
  data: SparqlData
  exportJSON?: (data: Record<string, unknown>, fileName?: string) => void
}

/**
 * A helper interface to describe label objects stored in a feature's 'labels' property.
 */
export interface LabelInfo {
  key: string
  type: string
  value: string
  datatype: boolean
}

enum Mode {
  OBJECTS = 'objects',
  HEATMAP = 'heatmap',
}

const defaultStyle = new Style({
  stroke: new Stroke({
    color: '#0066ff',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgba(0, 102, 255, 0.1)',
  }),
})

const highlightStyle = new Style({
  stroke: new Stroke({
    color: '#f37021',
    width: 3,
  }),
  fill: new Fill({
    color: 'rgba(243, 112, 33, 0.2)',
  }),
})

/**
 * Returns the centroid for a Polygon or MultiPolygon geometry.
 * If the geometry is not a polygon type, returns null.
 *
 * @param geom - The geometry of the feature.
 * @returns A Point representing the centroid, or null if not applicable.
 */
function getPolygonCentroid(geom: Geometry): Point | null {
  if (!(geom instanceof Polygon) && !(geom instanceof MultiPolygon)) {
    return null
  }
  const extent = geom.getExtent()
  const center = getCenter(extent)
  return new Point(center)
}

/**
 * Extended interface for the modular MapView component.
 *
 * @property {SparqlData} data - The SPARQL data to be displayed on the map.
 * @property {(data: Record<string, unknown>, fileName?: string) => void} [exportJSON] - Callback when the export button is clicked in the map popup.
 * @property {[number, number]} [mapCenter] - Initial center of the map as [longitude, latitude]. Defaults to [0, 0].
 * @property {number} [initialZoom] - Initial zoom level of the map. Defaults to 2.
 * @property {boolean} [showHeatmap] - If true, displays the heatmap layer by default; otherwise, displays features. Defaults to false.
 * @property {(feature: OLFeature<Geometry>) => void} [onFeatureClick] - Callback invoked when a feature is clicked on the map.
 * @property {boolean} [showPopup] - If true, enables the popup overlay on feature click. Defaults to true.
 * @property {string} [className] - Additional CSS classes for the map container.
 */
export interface AsimovMapViewProps extends DataMapViewProps {
  mapCenter?: [number, number]
  initialZoom?: number
  showHeatmap?: boolean
  onFeatureClick?: (feature: OLFeature<Geometry>) => void
  showPopup?: boolean
  className?: string
}

/**
 * A modular and configurable OpenLayers map component.
 *
 * This component initializes an OpenLayers map with configurable center, zoom level,
 * heatmap display, popup overlays, and feature-click callbacks.
 */
export const MapView: React.FC<AsimovMapViewProps> = ({
  data,
  exportJSON,
  mapCenter = [0, 0],
  initialZoom = 2,
  showHeatmap = false,
  onFeatureClick,
  showPopup = true,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<OlMap | null>(null)
  const selectedFeatureRef = useRef<OLFeature<Geometry> | null>(null)

  const objectsSourceRef = useRef(new VectorSource())
  const heatmapSourceRef = useRef(new VectorSource())
  const objectsLayerRef = useRef(new VectorLayer({ source: objectsSourceRef.current, style: defaultStyle }))
  const heatmapLayerRef = useRef(
    new HeatmapLayer({
      source: heatmapSourceRef.current,
      blur: 15,
      radius: 8,
      weight: () => 1,
    }),
  )

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let popupContainer: HTMLDivElement | null = null
    let popupOverlay: Overlay | null = null
    let arrowDiv: HTMLDivElement | null = null
    let closeBtn: HTMLButtonElement | null = null

    if (showPopup) {
      popupContainer = document.createElement('div')
      popupContainer.className =
        'relative bg-white text-gray-800 text-sm p-6 border border-gray-300 rounded-lg shadow-md'

      arrowDiv = document.createElement('div')
      arrowDiv.className =
        'absolute -bottom-1 left-5 w-0 h-0 ' +
        'border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent ' +
        'border-t-[5px] border-t-white'

      closeBtn = document.createElement('button')
      closeBtn.className = 'absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-800'
      closeBtn.innerHTML = '&times;'
      closeBtn.onclick = () => {
        if (popupContainer) popupContainer.innerHTML = ''
        popupOverlay?.setPosition(undefined)
        if (selectedFeatureRef.current) {
          selectedFeatureRef.current.setStyle(defaultStyle)
          selectedFeatureRef.current = null
        }
      }

      popupContainer.appendChild(arrowDiv)
      popupContainer.appendChild(closeBtn)

      if (exportJSON) {
        popupContainer.addEventListener('click', (event) => {
          const target = event.target as HTMLElement
          if (target instanceof HTMLButtonElement && target.ariaLabel === 'Export data') {
            if (selectedFeatureRef.current) {
              const featureClone = selectedFeatureRef.current.clone()
              const labels: LabelInfo[] = featureClone.get('labels') || []
              const result: Record<string, unknown> = {}
              labels.forEach((lbl) => {
                result[lbl.key] = lbl.value
              })
              exportJSON(result)
            }
          }
        })
      }

      popupOverlay = new Overlay({
        element: popupContainer,
        autoPan: true,
      })
    }

    const map = new OlMap({
      target: mapRef.current,
      view: new View({
        center: fromLonLat(mapCenter),
        zoom: initialZoom,
      }),
      layers: [new TileLayer({ source: new OSM() })],
      overlays: popupOverlay ? [popupOverlay] : [],
    })
    mapInstanceRef.current = map

    const modeControl = new ModeControl({
      defaultMode: showHeatmap ? Mode.HEATMAP : Mode.OBJECTS,
      onChange: (mode) => {
        map.removeLayer(objectsLayerRef.current)
        map.removeLayer(heatmapLayerRef.current)
        map.addLayer(mode === Mode.HEATMAP ? heatmapLayerRef.current : objectsLayerRef.current)
      },
    })
    map.addControl(modeControl)

    const handleMapClick = (evt: MapBrowserEvent<PointerEvent>) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f) as OLFeature<Geometry> | undefined
      if (selectedFeatureRef.current) {
        selectedFeatureRef.current.setStyle(defaultStyle)
        selectedFeatureRef.current = null
      }
      if (feature) {
        feature.setStyle(highlightStyle)
        selectedFeatureRef.current = feature
        if (onFeatureClick) onFeatureClick(feature)
        if (showPopup && popupOverlay && popupContainer && arrowDiv && closeBtn) {
          const labels: LabelInfo[] = feature.get('labels') || []
          let labelsHtml = ''
          labels.forEach((label) => {
            let valueHtml: string
            switch (label.type) {
              case 'uri': {
                const urlLiteral = label.value.split('/').pop()
                valueHtml = `<a href="${label.value}" target="_blank" class="text-blue-500 hover:text-blue-700">${urlLiteral}</a>`
                break
              }
              case 'literal':
                if (label.datatype) {
                  if (exportJSON) {
                    valueHtml = `<button class="text-blue-500 hover:text-blue-700" aria-label="Export data">Export</button>`
                  } else {
                    valueHtml =
                      '<button disabled class="text-gray-500 disabled:text-gray-700 cursor-not-allowed" aria-label="Export data" title="No export function">Export</button>'
                  }
                  break
                }
                valueHtml = label.value.slice(0, 15)
                break
              default:
                valueHtml = label.value.slice(0, 15)
                break
            }
            labelsHtml += `<p class="m-0"><span class="capitalize font-semibold">${label.key}</span>: ${valueHtml}</p>`
          })
          popupContainer.innerHTML = labelsHtml
          popupContainer.appendChild(arrowDiv)
          popupContainer.appendChild(closeBtn)
          popupOverlay.setPosition(evt.coordinate)
        }
      } else if (showPopup && popupOverlay) {
        popupOverlay.setPosition(undefined)
      }
    }

    // @ts-expect-error – "singleclick" works at runtime despite missing type
    map.on('singleclick', handleMapClick)

    return () => {
      // @ts-expect-error – "singleclick" works at runtime despite missing type
      map.un('singleclick', handleMapClick)
      map.removeControl(modeControl)
      map.setTarget(undefined)
      mapInstanceRef.current = null
    }
  }, [mapCenter, initialZoom, showHeatmap, showPopup, onFeatureClick, exportJSON])

  useEffect(() => {
    objectsSourceRef.current.clear()
    heatmapSourceRef.current.clear()

    const wktFormat = new WKT()
    data.results.bindings.forEach((item: SparqlBinding) => {
      const wktValue = Object.keys(item)
        .map((key) => {
          if (item[key].datatype) return item[key].value
          return null
        })
        .filter(Boolean)
        .find((value) => value !== null)
      if (!wktValue) return

      const polyFeature = wktFormat.readFeature(wktValue, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }) as OLFeature<Geometry> | null
      if (!polyFeature) return

      const labels: LabelInfo[] = Object.keys(item).map((key) => ({
        key,
        type: item[key].type,
        value: item[key].value,
        datatype: Boolean(item[key].datatype),
      }))

      const label = item.name ? item.name.value : 'No name'
      polyFeature.set('label', label)
      polyFeature.set('labels', labels)
      polyFeature.setStyle(defaultStyle)
      objectsSourceRef.current.addFeature(polyFeature)

      const geom = polyFeature.getGeometry()
      if (geom) {
        const centroidPoint = getPolygonCentroid(geom)
        if (centroidPoint) {
          const centroidFeature = new OLFeature<Point>(centroidPoint)
          centroidFeature.set('label', label)
          centroidFeature.set('labels', labels)
          heatmapSourceRef.current.addFeature(centroidFeature)
        }
      }
    })

    const features = objectsSourceRef.current.getFeatures()
    if (features.length > 0 && mapInstanceRef.current) {
      const geom = features[0].getGeometry()
      if (geom) {
        const extent: Extent = geom.getExtent()
        mapInstanceRef.current.getView().fit(extent, {
          duration: 1000,
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        })
      }
    }
  }, [data])

  return <div ref={mapRef} className={`w-full h-[500px] relative ${className}`} />
}
