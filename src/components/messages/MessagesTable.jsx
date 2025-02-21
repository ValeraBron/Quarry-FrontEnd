import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { Navbar } from '../common/Navbar'
import { Dropdown } from './Dropdown'
import { setMessages } from '../../store/messageSlice'
import { getMessages, sendSms, deleteMessage, addMessage, updateMessage } from '../../services/messages'
import { getClients } from '../../services/clients'
import { setClients } from '../../store/clientSlice'
import moment from 'moment'
import { DATE_FORMAT_CLIENT, DATE_TIME_FORMAT_CLIENT } from '../../constants'
import { CountdownTimer } from './CountDown'
import { IoMdRefresh } from 'react-icons/io'
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import toast from 'react-hot-toast'
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { WebSocketManager } from '../../services/ws'
import { EditMessageModal } from './EditMessageModal';

export const MessagesTable = () => {
    const dispatch = useDispatch()
    const messages = useSelector(state => state.message.data)
    const clients = useSelector(state => state.client.data)
    const calendarRef = useRef(null);
    const timeRef = useRef(null);
    const [refetch, setRefetch] = useState(false)
    const messageRef = useRef(messages);
    const clientRef = useRef(clients);
    const [message, setMessage] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [errors, setErrors] = useState({
        client: false,
        message: false,
        date: false,
        time: false
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    useEffect(() => {
        messageRef.current = messages;
        clientRef.current = clients;
    }, [messages, clients])

    useEffect(() => {
        fetchmessage();
        fetchClients();
        messages.forEach((item) => {
            if (new Date(item.qued_timestamp) < new Date() && item.message_status === 0) {
              //  handleSendSms(item.id);
            }
        })
    }, [refetch])

    useEffect(() => {
        const websocketManager = new WebSocketManager();
        const id = Date.now();
    
        websocketManager.addFns("MESSAGE_UPDATE", (messageInfo) => {
            if (!messageRef.current) return;
    
            const messageArr = messageRef.current.map((info) => {
                const updatedItem = messageInfo.find((item) => item.id === info.id);
                return updatedItem ? { ...info, num_sent: updatedItem.num_sent } : info;
            });
            
            dispatch(setMessages(messageArr));
        }, id);
    
        return () => {
            websocketManager.removeFns("MESSAGE_UPDATE", id);
            // websocketManager.closeSocket();
        };
    }, []);
    

    const fetchmessage = async () => {
        dispatch(loadingOn());
        let res = await getMessages();

        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res) {
            if (Array.isArray(res)) {
                // console.log("rs: ", res);
                dispatch(setMessages(res))
            }
        }
        dispatch(loadingOff())
    }

    const fetchClients = async () => {
        dispatch(loadingOn());
        let res = await getClients();

        if(res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if(res) {
            if(Array.isArray(res)) {
                dispatch(setClients(res));
            }
        }
       dispatch(loadingOff());
    }

    const handleClickCalendar = () => {
        calendarRef.current.showPicker();
    };

    const handleClickTime = () => {
        timeRef.current.showPicker();
    };


    const handleDeleteMessage = async (id) => {
        dispatch(loadingOn());
        let res = await deleteMessage(id);

        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res.success) {
            toast.dismiss()
            toast.success("Successfully deleted the message!");
            setRefetch(!refetch);
        }
        dispatch(loadingOff());
    }

    const handleSendSms = async (messageId) => {
        //dispatch(loadingOn());
        const res = sendSms(messageId);

        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res.success) {
            toast.dismiss()
            toast.success("Successfully send the sms!");
            setRefetch(!refetch);
        }
        //dispatch(loadingOff());
    }

    const handleMessageSubmit = async () => {
        const newErrors = {
            client: !selectedClients || selectedClients.length === 0,
            message: !message.trim(),
            date: !selectedDate,
            time: !selectedTime
        };
        
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        //dispatch(loadingOn());
        try {
            const scheduledDateTime = `${selectedDate}T${selectedTime}`;
            const phoneNumbers = clients
                .filter(client => selectedClients.includes(client.id))
                .map(client => client.phone_numbers)
                .flat();
           
            //     return selectedClients.some(selectedId => selectedId === client.id);
            // }).map(client => client.phone_number);
            const messageData = {
                message: message.trim(),
                scheduled_time: scheduledDateTime,
                phone_numbers: phoneNumbers
            };
            console.log("message data: ", messageData);
            // const phoneNumbers = clients.filter(client => {
            const res = await addMessage(messageData);
            
            if (res.message === "Raw data processed successfully") {
                toast.success("Message scheduled successfully!");
                setMessage('');
                setSelectedDate('');
                setSelectedTime('');
                setSelectedClients([]);
                setErrors({
                    client: false,
                    message: false,
                    date: false,
                    time: false
                });
                // Refresh the messages table
                setRefetch(!refetch);
            } else {
                toast.error("Failed to schedule message");
            }
        } catch (error) {
            toast.error("Failed to schedule message");
            console.error(error);
        }
        //dispatch(loadingOff());
    };

    const handleEditClick = (message) => {
        setEditingMessage(message);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (editedData) => {
        dispatch(loadingOn());
        try {

            const messageData = 
            {
                message: editedData.message,
                scheduled_time: editedData.scheduled_time,
                phone_numbers: editedData.phone_numbers,
                message_status: editedData.message_status
            };
            const res = await updateMessage(editedData.id, messageData);
            console.log("res: ", res);

            if (res.success) {
                toast.success("Message updated successfully!");
                // Update the messages in the store
                const updatedMessages = messages.map(msg => 
                    msg.id === editedData.id 
                        ? {
                            ...msg,
                            last_message: editedData.message,
                            qued_timestamp: editedData.scheduled_time,
                            phone_numbers: editedData.phone_numbers
                        } 
                        : msg
                );
                dispatch(setMessages(updatedMessages));
                
                setIsEditModalOpen(false);
                setEditingMessage(null);
                setRefetch(!refetch);
            } else {
                toast.error(res.message || "Failed to update message");
            }
        } catch (error) {
            console.error('Error updating message:', error);
            toast.error("Failed to update message");
        }
        dispatch(loadingOff());
    };

    return (
        <div>
            <Navbar />

            <div>
                <div id='message-form' className='flex items-center gap-5 bg-white px-5 mb-[2px] py-1'>
                    <div id='message-form-content' className='flex flex-1 items-center gap-4'>
                        <div className="flex-shrink-0">
                            <Dropdown 
                                id='dropdown-clients'
                                clients={clients}
                                onClick={(e) => {
                                    const status = selectedClients;
                                    if (status.length > 0) {
                                        setSelectedClients(status);
                                    }
                                }}
                                onClientSelect={(selectedClients) => {
                                    setSelectedClients(selectedClients);
                                    console.log("selectedClients: ", selectedClients)
                                }}
                                onSelect={() => setErrors(prev => ({...prev, client: false}))}
                                error={errors.client}
                            />
                            {errors.client && <p className="text-red-500 text-sm mt-1">Please select a client</p>}
                        </div>

                        <div id='calendar-container' onClick={handleClickCalendar} className='cursor-pointer flex-shrink-0'>
                            <input
                                type="date"
                                ref={calendarRef}
                                className="absolute opacity-0 cursor-pointer"
                                onClick={(e) => {
                                    const status = calendarRef.current?.value;
                                    if (status) {
                                        setSelectedDate(status);
                                    }
                                }}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setErrors(prev => ({...prev, date: false}));
                                    console.log('Selected Date:', e.target.value);
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
                                onClick={(e) => {
                                    const status = timeRef.current?.value;
                                    if (status) {
                                        setSelectedTime(status);
                                    }
                                }}
                                onChange={(e) => {
                                    setSelectedTime(e.target.value);
                                    setErrors(prev => ({...prev, time: false}));
                                    console.log('Selected time:', e.target.value);
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

                        <div id='message-container' className='flex-1'>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    maxLength={150}
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        setErrors(prev => ({...prev, message: false}));
                                    }}
                                    onClick={(e) => {
                                        const status = message;
                                        if (status) {
                                            setMessage(status);
                                        }
                                    }}
                                    className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} bg-gray-200 px-3 py-1.5 rounded-md placeholder:text-black placeholder:font-medium pr-16`}
                                    placeholder='Message...'
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    {message.length}/150
                                </span>
                            </div>
                            {errors.message && <p className="text-red-500 text-sm mt-1">Please enter a message</p>}
                        </div>
                    </div>

                    <div id='message-form-submit' className='flex-shrink-0'>
                        <button 
                            onClick={handleMessageSubmit}
                            className='bg-[#0088cc] hover:bg-[#006699] text-white px-6 py-2 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center gap-2'
                        >
                            <span>Submit</span>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <table className="w-[100%]">
                    <thead className=" bg-red-700">
                        <tr>
                            <th className="w-[15%] pl-8 py-2 text-left text-lg text-white">Created On</th>
                            <th className="w-[15%] text-white text-lg text-left">Scheduled</th>
                            <th className="w-[35%] text-white text-lg text-left">Message</th>
                            {/* <th className="w-[10%] text-white text-lg text-left">Image</th> */}
                            <th className="w-[5%] text-white text-lg text-left">Status</th>
                            <th className="w-[20%]" />
                        </tr>
                    </thead>

                    <tbody className="bg-white">

                        {messages?.map((item, messageIndex) => {
                            let status = 'REVIEW';
                            //if (item.sent_timestamp) console.log("time:", item.sent_timestamp);
                            if (item.message_status === 1) {
                                status = 'REVIEW'
                            } else if (item.message_status === 2) {
                                status = 'QUED'
                            } else if (item.message_status === 3) {
                                status = 'SENT'
                            }

                            return (
                                <React.Fragment key={`parent-${messageIndex}`}>
                                    <tr className={`bg-red-700 border-t-2 border-t-white`}>
                                        <td className="text-lg pl-8 py-2 font-semibold text-white">{moment.utc(item.created_at).format(DATE_FORMAT_CLIENT)}</td>
                                        <td className="text-lg font-semibold text-white text-left">{moment.utc(item.qued_timestamp).format(DATE_TIME_FORMAT_CLIENT)}</td>
                                        <td className="text-lg font-semibold text-white text-left">
                                            {item.last_message}
                                        </td>
                                        {/* <td className="text-lg font-semibold text-white text-left">
                                            <img src={item.image_url} alt={item.id} className='w-10 h-8 object-cover' />
                                        </td> */}
                                        <td className="text-lg font-semibold text-left">
                                            {
                                                new Date(item.qued_timestamp) > new Date() ? (
                                                    <CountdownTimer targetDate={item.qued_timestamp} onComplete={() => handleSendSms(item.id)} />
                                                ) : (
                                                    <div className='bg-green-500 px-1 py-[2px]'>
                                                        <p className='text-center text-white'>{`${item.num_sent || 0}/${item.phone_numbers?.length}`}</p>
                                                    </div>
                                                )
                                            }
                                        </td>

                                        <td>
                                            <div id={`message-actions-${messageIndex}`} className='flex items-center justify-center gap-1'>
                                                {/* Only show refresh button if message is completed and past scheduled time */}
                                                {new Date(item.qued_timestamp) < new Date() && item.num_sent < item.phone_numbers?.length ? (
                                                    <IoMdRefresh 
                                                        className="text-3xl text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors" 
                                                        onClick={() => handleSendSms(item.id)}
                                                    />
                                                ) : (
                                                    <IoMdRefresh 
                                                    className="text-3xl text-white rounded-full p-1 transition-colors" 
                                                    />
                                                )}
                                                <MdOutlineEdit 
                                                    className="text-3xl text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors" 
                                                    onClick={() => handleEditClick(item)}
                                                />
                                                <AiTwotoneDelete 
                                                    className="text-2xl text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors"
                                                    onClick={() => handleDeleteMessage(item.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment >
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <EditMessageModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingMessage(null);
                }}
                onSubmit={handleEditSubmit}
                message={editingMessage}
                clients={clients}
            />
        </div>
    )
}
