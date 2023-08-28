import React, { useEffect } from "react";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";
import UploadModal from "./Components/UploadModal";
import DeleteModal from "./Components/DeleteModal";
import Layers from "./Components/Layers";
import { updateLayerList } from "./redux/layersListSlice";
import { useDispatch } from "react-redux";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch the fetchLayers action when the component mounts
    fetch("/features")
      .then(async (response) => await response.json())
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
      <DeleteModal />
    </div>
  );
}

export default App;
