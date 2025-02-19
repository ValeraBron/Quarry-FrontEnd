import React, { useState } from "react";

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none font-medium rounded-lg px-5 py-2 text-center inline-flex items-center justify-between w-[220px]"
      >
        Client List Selection
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="red"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-sm shadow-sm w-[250px]"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b">
                <input type="checkbox" />
                <span
                    className="block text-gray-500"
                >
                    Select All
                </span>
            </li>
            
            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b">
                <input type="checkbox" />
                <span
                    className="block text-gray-500"
                >
                    Guy
                </span>
            </li>

            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b">
                <input type="checkbox" />
                <span
                    className="block text-gray-500"
                >
                    Girls
                </span>
            </li>
            
          </ul>

          <button className='bg-green-500 text-white text-center w-full py-2 text-lg font-medium'>Create New</button>
        </div>
      )}
    </div>
  );
};
