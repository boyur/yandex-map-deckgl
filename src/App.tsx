import { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const map = useRef<ymaps.Map>();

  useEffect(() => {
    ymaps.ready().then(() => {
      map.current = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12,
        controls: []
      });
    });
  }, []);

  return (
    <div className="App">
      <div id="map" className="Map" />
    </div>
  )
}

export default App
