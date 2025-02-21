import React, { useState, useEffect } from "react";

export const Dropdown = ({ onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    All: false,
    Guys: false,
    Girls: false,
  });

  // Get display text for the dropdown button based on selections
  const getDisplayText = () => {
    const selectedCategories = Object.entries(checkedItems)
      .filter(([key, value]) => key !== 'All' && value)
      .map(([key]) => key);

    if (selectedCategories.length === 0) {
      return 'Select Categories';
    } else if (checkedItems.All || selectedCategories.length === 2) {
      return 'All Categories';
    } else {
      return selectedCategories.join(', ');
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCheckboxChange = (item) => {
    let newCheckedItems;
    
    if (item === 'All') {
      // If "Select All" is clicked, toggle all items
      const newValue = !checkedItems.All;
      newCheckedItems = {
        All: newValue,
        Guys: newValue,
        Girls: newValue,
      };
    } else {
      // For individual items
      newCheckedItems = {
        ...checkedItems,
        [item]: !checkedItems[item],
      };
      
      // Update "All" based on other selections
      newCheckedItems.All = newCheckedItems.Guys && newCheckedItems.Girls;
    }
    
    setCheckedItems(newCheckedItems);
    
    // Create array of selected categories
    const selectedCategories = Object.entries(newCheckedItems)
      .filter(([key, value]) => key !== 'All' && value)
      .map(([key]) => key);
      
    onCategoryChange(selectedCategories);
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="text-gray-500 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between w-[250px]"
      >
        {getDisplayText()}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-sm shadow-sm w-[250px]">
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b" onClick={() => handleCheckboxChange('All')}>
                <input 
                  type="checkbox" 
                  checked={checkedItems.All}
                  onChange={() => handleCheckboxChange('All')}
                />
                <span className="block text-gray-500">
                    Select All
                </span>
            </li>
            
            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b" onClick={() => handleCheckboxChange('Guys')}>
                <input 
                  type="checkbox" 
                  checked={checkedItems.Guys}
                  onChange={() => handleCheckboxChange('Guys')}
                />
                <span className="block text-gray-500">
                    Guys
                </span>
            </li>

            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b" onClick={() => handleCheckboxChange('Girls')}>
                <input 
                  type="checkbox" 
                  checked={checkedItems.Girls}
                  onChange={() => handleCheckboxChange('Girls')}
                />
                <span className="block text-gray-500">
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
