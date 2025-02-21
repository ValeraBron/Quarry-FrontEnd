import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from './Dropdown';
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";

export const EditMessageModal = ({
    isOpen,
    onClose,
    onSubmit,
    message,
    clients,
}) => {
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [errors, setErrors] = useState({
        client: false,
        message: false,
        date: false,
        time: false
    });
    
    const calendarRef = useRef(null);
    const timeRef = useRef(null);

    useEffect(() => {
        if (message) {
            // Extract client IDs from phone numbers
            const clientIds = clients
                .filter(client => message.phone_numbers.some(phone => client.phone_numbers.includes(phone)))
                .map(client => client.id);
            
            const datetime = new Date(message.qued_timestamp);
            
            setSelectedClients(clientIds);
            setSelectedDate(datetime.toISOString().split('T')[0]);
            setSelectedTime(datetime.toTimeString().slice(0, 5));
            setEditMessage(message.last_message);
        }
    }, [message, clients]);

    const handleSubmit = () => {
        const newErrors = {
            client: !selectedClients || selectedClients.length === 0,
            message: !editMessage.trim(),
            date: !selectedDate,
            time: !selectedTime
        };
        
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        const scheduledDateTime = `${selectedDate}T${selectedTime}`;
        const phoneNumbers = clients
            .filter(client => selectedClients.includes(client.id))
            .map(client => client.phone_numbers)
            .flat();

        onSubmit({
            id: message.id,
            message: editMessage.trim(),
            scheduled_time: scheduledDateTime,
            phone_numbers: phoneNumbers,
        });
    };

    const handleClickCalendar = () => {
        calendarRef.current.click();
    };

    const handleClickTime = () => {
        timeRef.current.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Edit Message</h2>
                
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Dropdown 
                                id='dropdown-clients-edit'
                                clients={clients}
                                onClientSelect={setSelectedClients}
                                onSelect={() => setErrors(prev => ({...prev, client: false}))}
                                error={errors.client}
                                initialSelected={selectedClients}
                            />
                            {errors.client && <p className="text-red-500 text-sm mt-1">Please select a client</p>}
                        </div>

                        <div id='calendar-container' onClick={handleClickCalendar} className='cursor-pointer flex-shrink-0'>
                            <input
                                type="date"
                                ref={calendarRef}
                                className="absolute opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setErrors(prev => ({...prev, date: false}));
                                }}
                            />
                            <div className={`flex bg-gray-200 px-4 py-2 rounded-md cursor-pointer items-center gap-3 ${errors.date ? 'border border-red-500' : ''}`}>
                                <span className="font-medium cursor-pointer">
                                    {selectedDate || 'Calendar'}
                                </span>
                                <FaRegCalendarDays className={errors.date ? 'text-red-500' : 'text-red-700'} />
                            </div>
                            {errors.date && <p className="text-red-500 text-sm mt-1">Please select a date</p>}
                        </div>

                        <div id='time-container' onClick={handleClickTime} className='cursor-pointer flex-shrink-0'>
                            <input
                                type="time"
                                ref={timeRef}
                                className="absolute opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    setSelectedTime(e.target.value);
                                    setErrors(prev => ({...prev, time: false}));
                                }}
                            />
                            <div className={`flex bg-gray-200 px-4 py-2 rounded-md cursor-pointer items-center gap-7 ${errors.time ? 'border border-red-500' : ''}`}>
                                <span className="font-medium cursor-pointer">
                                    {selectedTime || 'Time'}
                                </span>
                                <IoMdTime className={errors.time ? 'text-red-500' : 'text-red-700 text-lg'} />
                            </div>
                            {errors.time && <p className="text-red-500 text-sm mt-1">Please select a time</p>}
                        </div>
                    </div>

                    <div id='message-container' className='w-full'>
                        <div className="relative w-full">
                            <input
                                type="text"
                                maxLength={150}
                                value={editMessage}
                                onChange={(e) => {
                                    setEditMessage(e.target.value);
                                    setErrors(prev => ({...prev, message: false}));
                                }}
                                className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} bg-gray-200 px-3 py-1.5 rounded-md placeholder:text-black placeholder:font-medium pr-16`}
                                placeholder='Message...'
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                {editMessage.length}/150
                            </span>
                        </div>
                        {errors.message && <p className="text-red-500 text-sm mt-1">Please enter a message</p>}
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