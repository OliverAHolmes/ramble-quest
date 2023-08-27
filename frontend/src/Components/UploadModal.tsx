import React, { useEffect, useState } from "react";
import { setUploadGeoJsonVisable } from "../redux/panelsSlice";
import { updateLayerList } from "../redux/layersListSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { updateSelectedLayerId } from "../redux/layersListSlice";

const UploadModal = () => {
  const dispatch = useDispatch();
  const panelVisable = useSelector(
    (state: RootState) => state.panels.uploadGeoJson.visible
  );
  const [isOpen, setIsOpen] = useState(panelVisable);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);

  useEffect(() => {
    setIsOpen(panelVisable);
  }, [panelVisable]);

  const handleCancelButtClick = () => {
    dispatch(setUploadGeoJsonVisable(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if(selectedLayerId === null) return;
    console.log("selectedLayerId", selectedLayerId);
    dispatch(updateSelectedLayerId(selectedLayerId));
  }, [dispatch, selectedLayerId]);

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("features/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          setSelectedLayerId(responseData.feature_id);

          fetch("/features")
            .then((response) => response.json())
            .then((data) => {
              dispatch(updateLayerList(data));
            });

          dispatch(setUploadGeoJsonVisable(false));
        } else {
          console.log("File upload failed", response);
        }
      } catch (error) {
        console.error("There was a problem uploading the file", error);
      }
    }
  };

  return (
    <div className="relative flex justify-center">
      {isOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="relative inline-block p-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:max-w-sm rounded-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:p-6">
              <div className="flex items-center justify-center mx-auto">
                <img
                  className="h-full rounded-lg"
                  src="./imgs/geojson.png"
                  alt=""
                />
              </div>

              <div className="mt-5 text-center">
                <h3
                  className="text-lg font-medium text-gray-800 dark:text-white"
                  id="modal-title"
                >
                  GeoJSON Upload
                </h3>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Upload a GeoJSON file to add a new layer to the map.
                </p>
              </div>

              <div className="flex items-center justify-between w-full mt-5 gap-x-2 ">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300  cursor-pointer"
                  // onChange={(e) => handleTextUpdate}
                />
                {/* <input type="file" onChange={handleFileChange} /> */}
                {/* <button 
                onClick={handleUpload}
                className="rounded-md hidden sm:block p-1.5 text-gray-700 bg-white border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-500">
                Upload
                </button> */}
              </div>

              <div className="mt-4 sm:flex sm:items-center sm:justify-between sm:mt-6 sm:-mx-2">
                <button
                  onClick={handleCancelButtClick}
                  className="px-4 sm:mx-2 w-full py-2.5 text-sm font-medium dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  className="px-4 sm:mx-2 w-full py-2.5 mt-3 sm:mt-0 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadModal;
