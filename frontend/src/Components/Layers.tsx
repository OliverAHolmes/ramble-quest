import React, { useEffect, useState } from "react";

import LayersTable from "./Layers/Table";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Layers = () => {
  const [isOpen, setIsOpen] = useState(true);

  const layerListVisable = useSelector(
    (state: RootState) => state.panels.layerList.visible
  );

  useEffect(() => {
    setIsOpen(layerListVisable);
  }, [layerListVisable]);

  return (
    <div className="absolute top-[80px] right-[5px]">
      {isOpen && <LayersTable />}
    </div>
  );
};

export default Layers;
