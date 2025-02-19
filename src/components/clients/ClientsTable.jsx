import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { Navbar } from '../common/Navbar'
import { Dropdown } from './Dropdown'
import { setData } from '../../store/clientSlice'
import { deleteClient, getClients, sendSms } from '../../services/clients'
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

export const ClientsTable = () => {
    const dispatch = useDispatch()
    const data = useSelector(state => state.client.data)
    const calendarRef = useRef(null);
    const timeRef = useRef(null);
    const [refetch, setRefetch] = useState(false)
    const dataRef = useRef(data);

    useEffect(() => {
        dataRef.current = data;
    }, [data])

    useEffect(() => {
        fetchData();

        data.forEach((item) => {
            if (new Date(item.qued_timestamp) < new Date() && item.message_status === 0) {
                handleSendSms(item.id);
            }
        })
    }, [refetch])

    useEffect(() => {
        const websocketManager = new WebSocketManager();
        const id = Date.now();
    
        websocketManager.addFns("CLIENT_UPDATE", (dataInfo) => {
            if (!dataRef.current) return;
    
            const dataArr = dataRef.current.map((info) => {
                const updatedItem = dataInfo.find((item) => item.id === info.id);
                return updatedItem ? { ...info, num_sent: updatedItem.num_sent } : info;
            });
    
            dispatch(setData(dataArr));
        }, id);
    
        return () => {
            websocketManager.removeFns("CLIENT_UPDATE", id);
            websocketManager.closeSocket();
        };
    }, []);
    

    const fetchData = async () => {
        dispatch(loadingOn());
        let res = await getClients();

        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res) {
            if (Array.isArray(res)) {
                console.log("rs: ", res);
                dispatch(setData(res))
            }
        }
        dispatch(loadingOff())
    }

    const handleClickCalendar = () => {
        calendarRef.current.showPicker();
    };

    const handleClickTime = () => {
        timeRef.current.showPicker();
    };


    const deleleCustomer = async (id) => {
        dispatch(loadingOn());
        let res = await deleteClient(id);

        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res.success) {
            toast.dismiss()
            toast.success("Successfully deleted the customer!");
            setRefetch(!refetch);
        }
        dispatch(loadingOff());
    }

    const handleSendSms = async (clientId) => {
        dispatch(loadingOn());
        const res = await sendSms(clientId);

        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res.success) {
            toast.dismiss()
            toast.success("Successfully send the sms!");
            setRefetch(!refetch);
        }
        dispatch(loadingOff());
    }

    return (
        <div>
            <Navbar />

            <div>
                <div className='flex items-center justify-between gap-5 bg-white px-5 mb-[2px] py-1'>
                    <div className='flex items-center gap-4'>
                        <Dropdown />

                        <div onClick={handleClickCalendar} className='cursor-pointer'>
                            <input
                                type="date"
                                ref={calendarRef}
                                className="absolute opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    console.log('Selected Date:', e.target.value);
                                }}
                            />

                            <div className="flex bg-gray-200 px-4 py-2 rounded-md cursor-pointer items-center gap-3" >
                                <span className="font-medium cursor-pointer">Calendar</span>
                                <FaRegCalendarDays className='text-red-700' />
                            </div>
                        </div>

                        <div onClick={handleClickTime} className='cursor-pointer'>
                            <input
                                type="time"
                                ref={timeRef}
                                className="absolute opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    console.log('Selected time:', e.target.value);
                                }}
                            />

                            <div className="flex bg-gray-200 px-4 py-2 rounded-md cursor-pointer items-center gap-7" >
                                <span className="font-medium cursor-pointer">Time</span>
                                <IoMdTime className='text-red-700 text-lg' />
                            </div>
                        </div>

                        <input type='text'
                            className='border border-gray-300 bg-gray-200 px-3 py-1.5 rounded-md placeholder:text-black placeholder:font-medium'
                            placeholder='Message...'
                        />

                        <input type="file"
                            className='cursor-pointer bg-gray-200 text-gray-500 py-1 px-2 rounded-md'
                        />
                    </div>

                    <div>
                        <button className='bg-green-500 text-white px-4 py-1 rounded-sm text-lg font-semibold'>Submit</button>
                    </div>
                </div>

                <table className="w-[100%]">
                    <thead className=" bg-red-700">
                        <tr>
                            <th className="w-[10%] pl-8 py-2 text-left text-lg text-white">Created On</th>
                            <th className="w-[15%] text-white text-lg text-left">Scheduled</th>
                            <th className="w-[45%] text-white text-lg text-left">Message</th>
                            <th className="w-[10%] text-white text-lg text-left">Image</th>
                            <th className="w-[8%] text-white text-lg text-left">Status</th>
                            <th className="w-[12%]" />
                        </tr>
                    </thead>

                    <tbody className="bg-white">

                        {data?.map((item, dataIndex) => {
                            let status = 'REVIEW';
                            if (item.sent_timestamp) console.log("time:", item.sent_timestamp);
                            if (item.message_status === 1) {
                                status = 'REVIEW'
                            } else if (item.message_status === 2) {
                                status = 'QUED'
                            } else if (item.message_status === 3) {
                                status = 'SENT'
                            }

                            return (
                                <React.Fragment key={`parent-${item.id}`}>
                                    <tr className={`bg-red-700 border-t-2 border-t-white`}>
                                        <td className="text-lg pl-8 py-2 font-semibold text-white">{moment.utc(item.created_at).format(DATE_FORMAT_CLIENT)}</td>
                                        <td className="text-lg font-semibold text-white text-left">{moment.utc(item.qued_timestamp).format(DATE_TIME_FORMAT_CLIENT)}</td>
                                        <td className="text-lg font-semibold text-white text-left">
                                            {item.last_message}
                                        </td>
                                        <td className="text-lg font-semibold text-white text-left">
                                            <img src={item.image_url} alt={item.id} className='w-10 h-8 object-cover' />
                                        </td>
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
                                            <div className='flex items-center justify-center gap-1'>
                                                <IoMdRefresh className="text-3xl text-white cursor-pointer" 
                                                    onClick={() => handleSendSms(item.id)}
                                                />
                                                <MdOutlineEdit className="text-3xl text-white cursor-pointer" />
                                                <AiTwotoneDelete className="text-2xl text-white cursor-pointer"
                                                    onClick={() => deleleCustomer(item.id)}
                                                />
                                                {/* <IoCloseSharp className="text-3xl text-white cursor-pointer" /> */}
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment >
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
