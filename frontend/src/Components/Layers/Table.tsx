import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../redux/store";
import { updateSelectedLayerId } from "../../redux/layersListSlice";
import { setDeleteLayerVisible } from "../../redux/panelsSlice";

const Table = () => {
  const dispatch = useDispatch();
  const layers = useSelector((state: RootState) => state.layers.list);
  const selectedLayerId = useSelector(
    (state: RootState) => state.layers.selectedLayerId,
  );

  const handleRowClick = (id: number) => {
    dispatch(updateSelectedLayerId(id));
  };

  const handleDelete = (id: number) => {
    dispatch(setDeleteLayerVisible({ visible: true, id }));
  };

  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 md:-mx-6 lg:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle sm:px-2 md:px-2 lg:px-2">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-950">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-right rtl:text-right text-gray-500 dark:text-gray-400"
                    ></th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center gap-x-3">
                        <button className="flex items-center gap-x-2">
                          <span>Id</span>
                        </button>
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Type
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-right rtl:text-right text-gray-500 dark:text-gray-400"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {layers.map((row, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td
                        onClick={() => {
                          handleRowClick(row.id);
                        }}
                        className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap"
                      >
                        <div className="inline-flex items-center gap-x-3">
                          <input
                            data-testid={`radio-button-${row.id}`}
                            type="radio"
                            name="layer"
                            className="cursor-pointer"
                            checked={selectedLayerId === row.id}
                            onChange={() => {
                              handleRowClick(row.id);
                            }}
                          />
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          handleRowClick(row.id);
                        }}
                        className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap"
                      >
                        <div className="inline-flex items-center gap-x-3">
                          {row.id}
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          handleRowClick(row.id);
                        }}
                        className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                      >
                        {row.feature.type === "FeatureCollection"
                          ? row.feature.type
                          : row.feature.geometry?.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        <button
                          data-testid="delete-button"
                          onClick={() => {
                            handleDelete(row.id);
                          }}
                          className="bg-red-300 dark:bg-red-900 px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-red-600 dark:text-gray-300 hover:bg-red-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 448 512"
                            fill="currentColor"
                          >
                            <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
