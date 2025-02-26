import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { Navbar } from '../common/Navbar'
import moment from 'moment'
import { DATE_TIME_FORMAT_CLIENT } from '../../constants'
import { getPhones } from '../../services/phone'
import { setPhones } from '../../store/phoneSlice'
import { Dropdown } from './DropDown'
import { WebSocketManager_Phone } from '../../services/ws'
import { SettingsModal } from '../Settings/SettingsModal'
import { updateOptinMessage, getOptinMessage } from '../../services/phone'
import toast from 'react-hot-toast'

export const PhonesTable = () => {
    const dispatch = useDispatch()
    const phones = useSelector(state => state.phone.data)
    const phoneRef = useRef(phones)
    const [selectedStatuses, setSelectedStatuses] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [refetch, setRefetch] = useState(false)
    const itemsPerPage = 10
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [optinMessage, setOptinMessage] = useState('')

    useEffect(() => {
        dispatch(loadingOn());
        fetchData()
        dispatch(loadingOff())
    }, [refetch])

    useEffect(() => {
        phoneRef.current = phones;
    }, [phones])

    useEffect(() => {
        // const websocketManager = new WebSocketManager_Phone();

        // const id = Date.now();
        // websocketManager.addFns("PHONE_UPDATE", (phoneInfo) => {
        //     if (!phoneRef.current) return;
    
        //     const phoneArr = phoneRef.current.map((info) => {
        //         const updatedItem = phoneInfo.find((item) => item.id === info.id);
        //         return updatedItem ? { ...info, optin_status: updatedItem.optin_status, back_timestamp: updatedItem.back_timestamp } : info;
        //     });
            
        //     // if (phoneArr) dispatch(setPhones(phoneArr));
        // }, id);
    
        // return () => {
        //     websocketManager.removeFns("PHONE_UPDATE", id);
        //     websocketManager.closeSocket();
        // };
    }, []);
    const fetchData = async () => {
        const phoneData = await getPhones()
        const optinMessage = await getOptinMessage()
        if (phoneData) dispatch(setPhones(phoneData))
        if (optinMessage) setOptinMessage(optinMessage)
    }

    // Filter phones based on selected statuses
    const filteredPhones = selectedStatuses.length === 0
        ? phones 
        : phones?.filter(phone => selectedStatuses.includes(phone.optin_status))

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredPhones?.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil((filteredPhones?.length || 0) / itemsPerPage)

    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    const handleSubmit = async (editedData) => {
        dispatch(loadingOn())
        try {
            if (editedData.optin_message) {
                const res = await updateOptinMessage(editedData)
            if (res.success) {
                setIsEditModalOpen(false)
                toast.success('Optin message updated successfully')
                setRefetch(!refetch)
            } else {
                toast.error(res.message || "Failed to update message")
            }

        }
        } catch (error) {
            toast.error(error.message || "Failed to update message")
        }
        dispatch(loadingOff())
    }

    return (
        <div>
            <Navbar />

            <div>
                <div id='message-form' className='flex items-center justify-between gap-5 bg-white px-5 mb-[2px] py-1'>
                    <div className="flex-shrink-0">
                        <Dropdown 
                            selectedStatuses={selectedStatuses}
                            onStatusSelect={setSelectedStatuses}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors duration-200"
                        >
                            Settings
                        </button>
                    </div>
                </div>    

                <table className="w-[100%]">
                    <thead className="bg-red-700">
                        <tr>
                            <th className="w-[10%] text-center p-2 text-lg text-white">ID</th>
                            <th className="w-[30%] text-center p-2 text-lg text-white">Phone</th>
                            <th className="w-[15%] text-white text-lg text-center">Optin Status</th>
                            <th className="w-[15%] text-white text-lg text-center">Sent Timestamp</th>
                            <th className="w-[15%] text-white text-lg text-center">Back Timestamp</th>
                            <th className="w-[15%] text-white text-lg text-center">Categories</th>
                        </tr>
                    </thead>

                    <tbody className="table-body-transparent">
                        {currentItems?.map((item, index) => (
                            <tr key={index} className="bg-red-700 border-t-2 border-t-white">
                                <td className="text-center p-2 text-white">{indexOfFirstItem + index + 1}</td>
                                <td className="text-center p-2 text-white">{item.phone_number}</td>
                                <td className="text-center p-2 text-white">
                                    {item.optin_status ? item.optin_status : '-'}
                                </td>
                                <td className="text-center p-2 text-white">
                                    {item.sent_timestamp ? 
                                        moment(item.sent_timestamp).format(DATE_TIME_FORMAT_CLIENT) : 
                                        '-'
                                    }
                                </td>
                                <td className="text-center p-2 text-white">
                                    {item.back_timestamp ? 
                                        moment(item.back_timestamp).format(DATE_TIME_FORMAT_CLIENT) : 
                                        '-'
                                    }
                                </td>
                                <td className="text-center p-2 text-white">
                                    {
                                        item.categories ?
                                            item.categories :
                                            '-'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-4 gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-red-700 text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-4 py-2 rounded ${
                                currentPage === number 
                                    ? 'bg-white text-red-700' 
                                    : 'bg-red-700 text-white'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-red-700 text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {/* Display range information */}
                <div className="text-center mt-2 text-white">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPhones?.length || 0)} of {filteredPhones?.length || 0} entries
                </div>

                {isEditModalOpen && (
                    <SettingsModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSubmit={handleSubmit}
                        optinMessage={optinMessage}
                        showOptinEdit={true}
                    />
                )}
            </div>
        </div>
    )
}
