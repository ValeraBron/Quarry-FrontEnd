import React from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

export const PhoneInputField = ({ 
    phoneNumbers, 
    currentPhoneIndex,
    handlePhoneChange,
    handleRemovePhoneInput,
    navigatePhoneNumbers,
    handleAddPhoneInput
}) => {
    return (
        <div className='flex items-center gap-2'>
            <div className='relative w-52'>
                <input 
                    type='text'
                    className='border border-gray-300 bg-gray-200 text-lg px-3 py-1 text-gray-500 rounded-sm w-full'
                    placeholder='Phone Number'
                    value={phoneNumbers[currentPhoneIndex] || ''}
                    onChange={(e) => handlePhoneChange(currentPhoneIndex, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && phoneNumbers[currentPhoneIndex].trim() !== '') {
                            handleAddPhoneInput();
                        }
                    }}
                />
                
                {phoneNumbers.length > 1 && (
                    <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                        <button 
                            onClick={() => navigatePhoneNumbers('up')}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            <IoIosArrowUp />
                        </button>
                        <button 
                            onClick={() => navigatePhoneNumbers('down')}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            <IoIosArrowDown />
                        </button>
                    </div>
                )}

                {phoneNumbers.length > 1 && (
                    <div className='absolute -right-8 top-1/2 -translate-y-1/2'>
                        <button 
                            onClick={() => handleRemovePhoneInput(currentPhoneIndex)}
                            className='text-red-500 px-2'
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            <div className='text-xs text-gray-500'>
                {phoneNumbers.length > 0 && (
                    <span>{currentPhoneIndex + 1}/{phoneNumbers.length}</span>
                )}
            </div>
        </div>
    );
}; 