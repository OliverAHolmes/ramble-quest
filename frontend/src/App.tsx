import React, { useEffect } from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";
import UploadModal from "./Components/UploadModal";
import Layers from "./Components/Layers";
import { updateLayerList } from "./redux/layersListSlice";
import { useDispatch } from "react-redux";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch the fetchLayers action when the component mounts
    fetch("/features")
      .then((response) => response.json())
      .then((data) => {
        dispatch(updateLayerList(data));
      });
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />
      <Map />
      <Layers />
      <UploadModal />
    </div>
  );
}

export default App;
