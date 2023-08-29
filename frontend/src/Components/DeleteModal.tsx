import React, { useEffect, useState } from "react";
import { setDeleteLayerVisible } from "../redux/panelsSlice";
import {
  updateLayerList,
  updateSelectedLayerId,
} from "../redux/layersListSlice";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../redux/store";
import UploadError from "./UploadError";

const DeleteModal = () => {
  const dispatch = useDispatch();
  const panelVisable = useSelector(
    (state: RootState) => state.panels.deleteLayer.visible,
  );
  const layerId = useSelector(
    (state: RootState) => state.panels.deleteLayer.id,
  );
  const [isOpen, setIsOpen] = useState(panelVisable);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsOpen(panelVisable);
  }, [panelVisable]);

  const handleCancelButtClick = () => {
    dispatch(setDeleteLayerVisible({ visible: false, id: undefined }));
  };

  useEffect(() => {
    if (selectedLayerId === null) return;
    dispatch(updateSelectedLayerId(selectedLayerId));
  }, [dispatch, selectedLayerId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/features/delete/${layerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const responseData = await response.json();
        setSelectedLayerId(responseData.feature_id);

        fetch("/features")
          .then(async (response) => await response.json())
          .then((data) => {
            dispatch(updateLayerList(data));
          });

        setError(null);
        dispatch(setDeleteLayerVisible({ visible: false, id: undefined }));
      } else {
        const errorData = await response.json();
        setError(errorData.detail ?? "Failed to delete layer.");
      }
    } catch (error) {
      setError("There was a problem deleting the layer.");
      console.error("There was a problem deleting the layer:", error);
    }
  };

  return (
    <div className="relative flex justify-center">
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="relative inline-block p-4 overflow-hidden text-left align-middle transition-all transform bg-white border shadow-xl sm:max-w-sm rounded-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:p-6">
              {error && <UploadError message={error} />}

              <div className="mt-5 text-center">
                <h3
                  className="text-lg font-medium text-gray-800 dark:text-white"
                  id="modal-title"
                >
                  Do you really want to delete <br />
                  layer with id: <span className="text-xl">{layerId}</span> ?
                </h3>
              </div>

              <div className="mt-4 sm:flex sm:items-center sm:justify-between sm:mt-6 sm:-mx-2">
                <button
                  onClick={handleCancelButtClick}
                  className="px-4 sm:mx-2 w-full py-2.5 text-sm font-medium dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                >
                  Cancel
                </button>

                <button
                  data-testid="delete-button"
                  onClick={handleDelete}
                  className="px-4 sm:mx-2 w-full py-2.5 mt-3 sm:mt-0 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
