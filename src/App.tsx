import { useEffect, useState, useRef } from 'react';
import { Deck } from "@deck.gl/core/typed";
import { ScatterplotLayer } from "@deck.gl/layers/typed";

import './App.css';

function App() {
  const [viewport] = useState({ lat: 37.74, lng: -122.4, zoom: 12 });
  const map = useRef<ymaps.Map>();
  const deckContainer = useRef<HTMLDivElement>(null);
  const deckOverlay = useRef<HTMLCanvasElement>(null);
  const deck = useRef<Deck | undefined>(undefined);

  useEffect(() => {
    // init deckgl
    deck.current = new Deck({
      initialViewState: {
        latitude: viewport.lat,
        longitude: viewport.lng,
        // yandex map zoom system is shifted by 1 value
        zoom: viewport.zoom - 1,
      },
      parent: deckContainer.current,
      canvas: deckOverlay.current,
      getCursor: (state: any) => {
        return state.isHovering ? "pointer" : "grab";
      },
      layers: [
        new ScatterplotLayer({
          id: 'scatterplot-layer',
          data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",
          pickable: true,
          opacity: 0.8,
          stroked: true,
          filled: true,
          radiusScale: 6,
          radiusMinPixels: 1,
          radiusMaxPixels: 100,
          lineWidthMinPixels: 1,
          getPosition: d => d.coordinates,
          getRadius: d => Math.sqrt(d.exits),
          getFillColor: d => [255, 140, 0],
          getLineColor: d => [0, 0, 0],
          autoHighlight: true,
          highlightColor: [255, 0, 0, 100]
        })
      ]
    });

    // init yandex maps
    ymaps.ready().then(() => {
      map.current = new ymaps.Map("map", {
        center: [viewport.lat, viewport.lng],
        zoom: viewport.zoom,
        controls: [],
      }, {
        maxAnimationZoomDifference: 0,
      });
      
      const projection = map.current.options.get('projection');

      map.current.cursors.push("inherit");

      map.current.events.add("actiontick", (e: any) => {
        const center = projection.fromGlobalPixels(e.originalEvent.tick.globalPixelCenter, e.originalEvent.tick.zoom);
        deck.current?.setProps({
          viewState: {
            latitude: center[0],
            longitude: center[1],
            zoom: e.originalEvent.tick.zoom - 1,
          },
        });
        deck.current?.redraw('false');
      })
    });
  }, []);

  // destroy deckgl on unmount
  useEffect(() => {
    return () => {
      deck.current?.finalize();
      deck.current = undefined;
    };
  }, []);

  return (
    <div className="App">
      <div ref={deckContainer} style={{ height: "100%", position: "relative" }}>
        <div id="map" className="Map" />
        <canvas
          ref={deckOverlay}
          style={{position: "absolute", pointerEvents: "none", inset: 0 }}
        />
      </div>
    </div>
  )
}

export default App
