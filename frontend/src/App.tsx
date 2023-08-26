import React, {useEffect, useState} from 'react';
import Map from './Map';
import './App.css';

function App() {
  const [greeting, setGreeting] = useState<string>();

  useEffect(() => {
    fetch('/api/greet/Nature%20Intel')
      .then(response => response.json())
      .then(data => setGreeting(data.message))
  });

  return (
    <div className="App">
      <h1 className="greeting">{greeting}</h1>
      <Map />
    </div>
  );
}

export default App;
