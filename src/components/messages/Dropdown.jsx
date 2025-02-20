import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export const Dropdown = ({ onClientSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const clients = useSelector((state) => state.data);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCheckboxChange = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(client => client.id));
    }
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none font-medium rounded-lg px-5 py-2 text-center inline-flex items-center justify-between w-[220px]"
      >
        {selectedClients.length > 0 
          ? `Selected Clients (${selectedClients.length})`
          : "Select Clients"}
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
            className="py-2 text-sm text-gray-700"
            aria-labelledby="dropdownDefaultButton"
          >
            <li className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b">
              <input 
                type="checkbox" 
                checked={false}
                // checked={selectedClients.length === clients.length}
                onChange={handleSelectAll}
              />
              <span className="block text-gray-500">
                Select All
              </span>
            </li>
            {clients.map((client) => (
              
              <li 
                key={client.id}
                className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all border-b"
              >
                <input 
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={() => handleCheckboxChange(client.id)}
                />
                <span className="block text-gray-500">
                  {`Client ${client.id} (${client.phoneNumbers[0]})`}
                </span>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => onClientSelect(selectedClients)}
            className='bg-green-500 hover:bg-green-600 text-white text-center w-full py-2 text-lg font-medium transition-colors'
          >
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
};
