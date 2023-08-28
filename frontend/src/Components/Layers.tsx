import React, { useEffect, useState } from "react";

import LayersTable from "./Layers/Table";
import NoLayers from "./Layers/NoLayers";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Layers = () => {
  const [isOpen, setIsOpen] = useState(true);
  const layers = useSelector((state: RootState) => state.layers.layers);

  const layerListVisable = useSelector(
    (state: RootState) => state.panels.layerList.visible,
  );

  useEffect(() => {
    setIsOpen(layerListVisable);
  }, [layerListVisable]);

  return (
    <div className="absolute top-[80px] right-[5px]">
      {isOpen &&
        (layers.length === 0 ? (
          <NoLayers />
        ) : (
          <LayersTable />
        ))}
    </div>
  );
};

export default Layers;
