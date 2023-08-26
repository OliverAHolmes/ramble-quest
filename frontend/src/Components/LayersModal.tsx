import React, { useState } from "react";

import LayersTable from "./LayersTable";

const LayersModal = () => {
  const [isOpen, setIsOpen] = useState(true);

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
              <LayersTable />

              <div className="mt-4 sm:flex sm:items-center sm:justify-between sm:mt-6 sm:-mx-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 sm:mx-2 w-full py-2.5 text-sm font-medium dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                >
                  Cancel
                </button>

                <button className="px-4 sm:mx-2 w-full py-2.5 mt-3 sm:mt-0 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayersModal;
