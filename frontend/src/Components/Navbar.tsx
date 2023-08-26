import React, { useState } from 'react';
import ModalComponent from './ModalComponent';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="relative bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
                <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-200 md:mx-4 md:my-0 select-none" >Ramble Quest</span>

                    <div className="flex lg:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            type="button" 
                            className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" 
                            aria-label="toggle menu"
                        >
                            { !isOpen ?
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2"></path>
                                </svg> :
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2"></path>
                                </svg>
                            }
                        </button>
                    </div>
                </div>

                <div className={`${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'} absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}>
                    <div className="flex flex-col md:flex-row md:mx-6">
                        <a className="my-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">Layers</a>
                        <a className="my-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">Upload</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
