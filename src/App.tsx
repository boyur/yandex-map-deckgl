import { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const map = useRef<ymaps.Map>();

  useEffect(() => {
    ymaps.ready().then(() => {
      map.current = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12,
        controls: [],
      });
      const projection = map.current.options.get('projection');

      map.current.events.add("actiontick", (e: any) => {
        console.log("actiontick", projection.fromGlobalPixels(e.originalEvent.tick.globalPixelCenter, e.originalEvent.tick.zoom));
      })
    });
  }, []);

  return (
    <div className="App">
      <div id="map" className="Map" />
    </div>
  )
}

export default App
