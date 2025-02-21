import React, { useState } from "react";
import { useSelector } from "react-redux";

export const Dropdown = ({ onClientSelect, onSelect, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const clients = useSelector((state) => state.client.data);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCheckboxChange = (clientId) => {
    const newSelectedClients = selectedClients.includes(clientId)
      ? selectedClients.filter(id => id !== clientId)
      : [...selectedClients, clientId];
    
    setSelectedClients(newSelectedClients);
    
    // Update parent state immediately
    onClientSelect(newSelectedClients);
    
    // Clear error if at least one client is selected
    if (newSelectedClients.length > 0) {
      onSelect?.(newSelectedClients);
    }
  };

  const handleSelectAll = () => {
    const allClientIds = clients.map(client => client.id);
    const newSelectedClients = selectedClients.length === clients.length ? [] : allClientIds;
    
    setSelectedClients(newSelectedClients);
    
    // Update parent state immediately
    onClientSelect(newSelectedClients);
    
    // Clear error if at least one client is selected
    if (newSelectedClients.length > 0) {
      onSelect?.(newSelectedClients);
    }
  };

  const handleConfirmSelection = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className={`bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none font-medium rounded-lg px-5 py-2 text-center inline-flex items-center justify-between w-[220px] ${
          error ? 'border border-red-500' : ''
        }`}
      >
        <span className="truncate">
          {selectedClients.length > 0 
            ? `Selected Clients (${selectedClients.length})`
            : "Select Clients"}
        </span>
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

      {isOpen && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-sm shadow-sm w-[300px] mt-1">
          <ul className="max-h-[200px] overflow-y-auto">
            <li 
              className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all border-b"
              onClick={handleSelectAll}
            >
              <input 
                type="checkbox" 
                checked={selectedClients.length === clients?.length}
                onChange={handleSelectAll}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="block text-gray-700 font-medium">
                Select All
              </span>
            </li>
            {clients?.map((client, index) => (
              <li 
                key={client.id}
                className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => handleCheckboxChange(client.id)}
              >
                <input 
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={() => handleCheckboxChange(client.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="block text-gray-600">
                  {`Client ${index + 1}`} ({client.phone_numbers[0]})
                </span>
              </li>
            ))}
          </ul>

          <button 
            onClick={handleConfirmSelection}
            className='bg-green-500 hover:bg-green-600 text-white text-center w-full py-2 text-lg font-medium transition-colors'
          >
            Close ({selectedClients.length})
          </button>
        </div>
      )}
    </div>
  );
};
