import React, {useEffect, useState} from 'react';
import Map from './Components/Map';
import Navbar from './Components/Navbar';
import ModalComponent from './Components/ModalComponent';
import './App.css';

function App() {
  // const [greeting, setGreeting] = useState<string>();

  // useEffect(() => {
  //   fetch('/api/greet/Nature%20Intel')
  //     .then(response => response.json())
  //     .then(data => setGreeting(data.message))
  // });

  return (
    <div className="App">
      
      <Navbar />
      <Map />
      <ModalComponent />
    </div>
  );
}

export default App;
