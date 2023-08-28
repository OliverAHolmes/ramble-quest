import React from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";
import UploadModal from "./Components/UploadModal";
import DeleteModal from "./Components/DeleteModal";
import Layers from "./Components/Layers";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Map />
      <Layers />
      <UploadModal />
      <DeleteModal />
    </div>
  );
}

export default App;
