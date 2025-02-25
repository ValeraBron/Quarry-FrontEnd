import React, { useState, useEffect } from 'react';

export const EditOptinMessage = ({
    isOpen,
    onClose,
    onSubmit,
    optinMessage
}) => {
    const [editMessage, setEditMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (optinMessage) {
            setEditMessage(optinMessage);
        }
    }, [optinMessage]);

    const handleSubmit = () => {
        if (!editMessage.trim()) {
            setError(true);
            return;
        }

        onSubmit({
            optin_message: editMessage.trim()
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Edit Opt-in Message</h2>
                
                <div className="flex flex-col gap-4">
                    <div id='message-container' className='w-full'>
                        <div className="relative w-full">
                            <input
                                type="text"
                                maxLength={150}
                                value={editMessage}
                                onChange={(e) => {
                                    setEditMessage(e.target.value);
                                    setError(false);
                                }}
                                className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} bg-gray-200 px-3 py-1.5 rounded-md placeholder:text-black placeholder:font-medium pr-16`}
                                placeholder='Opt-in Message...'
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                {editMessage?.length}/150
                            </span>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">Please enter a message</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-[#0088cc] hover:bg-[#006699] text-white rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
