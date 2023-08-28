import React, { useEffect, useState } from "react";

import LayersTable from "./Layers/Table";
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
          <section className="container px-4 mx-auto">
            <div className="flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 md:-mx-6 lg:-mx-6">
                <div className="inline-block min-w-full py-2 align-middle sm:px-2 md:px-2 lg:px-2">
                  <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                        <tr>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            No layers to display, please upload a table.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <LayersTable />
        ))}
    </div>
  );
};

export default Layers;
