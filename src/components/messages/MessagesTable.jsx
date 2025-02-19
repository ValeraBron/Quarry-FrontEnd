import React, { useEffect, useState } from 'react'
import { Dropdown } from './Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { setData, setSendTimer } from '../../store/notificationSlice'
import { getNotifications, getTimer } from '../../services/notifications'
import { Navbar } from '../common/Navbar'

export const MessagesTable = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const dispatch = useDispatch()
    const data = useSelector(state => state.notification.data)


    useEffect(() => {
        // fetchData();
    }, [])

    const filteredData = []

    const fetchData = async () => {
        dispatch(loadingOn());
        let res = await getNotifications(currentTab);
        const timer = await getTimer();
        console.log("timer: ", timer);

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

        dispatch(setSendTimer(timer))
    }

    return (
        <div>
            <Navbar />

            <div>
                <div className='flex items-center gap-5 bg-white px-5 mb-[2px] py-1'>
                    <Dropdown />

                    <input type='number'
                        className='border border-gray-300 bg-gray-200 text-lg px-3 py-1 text-gray-500 rounded-sm'
                        placeholder='Phone Number'
                    />

                    <span className='text-gray-500 text-lg'>or</span>

                    <input type="file"
                        className='cursor-pointer bg-gray-200 text-gray-500 py-1 px-2 rounded-sm'
                    />

                    <button className='bg-green-500 text-white px-5 py-1 rounded-sm text-lg font-semibold'>ADD</button>
                </div>

                <table className="w-[100%]">
                    <thead className=" bg-red-700">
                        <tr>
                            <th className="w-[15%] text-center p-2 text-lg text-white">Cell Phone</th>
                            <th className="w-[10%] text-white text-lg text-left">Opt In</th>
                            <th className="w-[10%] text-white text-lg text-left">Sent Optin</th>
                            <th className="w-[15%] text-white text-lg text-left">Last Received</th>
                            <th className="w-[50%] text-white text-lg text-left">List</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white">

                        {filteredData?.map((item, dataIndex) => {
                            let status = 'REVIEW';
                            if (item.sent_timestamp) console.log("time:", item.sent_timestamp);
                            if (item.message_status === 1) {
                                status = 'REVIEW'
                            } else if (item.message_status === 2) {
                                status = 'QUED'
                            } else if (item.message_status === 3) {
                                status = 'SENT'
                            }

                            // return (
                            //     <React.Fragment key={`parent-${item.project_id}`}>
                            //         <tr className={`${expandId === item.customer_id ? "bg-red-700" : "bg-gray-400"} border-t-2 border-t-white `}>
                            //             <td className="text-center p-2">
                            //                 {expandId === item.customer_id ? <TbMinus className="text-3xl text-white font-bold cursor-pointer" onClick={() => setExpandId(null)} /> :
                            //                     <TbPlus className="text-3xl text-white font-bold cursor-pointer" onClick={() => setExpandId(item.customer_id)} />}
                            //             </td>
                            //             <td className="text-lg font-semibold text-white text-center">{!(expandId === item.customer_id) && (item.sent_timestamp ? moment.utc(item.sent_timestamp).format(DATE_FORMAT) : '-')}</td>
                            //             <td className="text-lg font-semibold text-white text-center">{!(expandId === item.customer_id) && item.last_name}</td>
                            //             <td className="text-lg font-semibold text-white text-center">{!(expandId === item.customer_id) && item.first_name}</td>
                            //             <td className="text-lg font-semibold text-white text-center">
                            //                 {
                            //                     !(expandId === item.customer_id) && (
                            //                         <>
                            //                             {item.project_name}
                            //                             <br />
                            //                             {item.claim_number}
                            //                         </>
                            //                     )
                            //                 }
                            //             </td>
                            //             <td className="text-lg font-semibold text-white text-center flex px-6">
                            //                 {
                            //                     <>
                            //                         <div
                            //                             className="flex w-[80%] mx-auto text-center py-1 text-white"
                            //                             style={{ borderRadius: '0.5rem', cursor: 'pointer', display: "flex", justifyContent: "center" }}
                            //                             data-tooltip-id={`tooltip-email-${item.customer_id}`}
                            //                             data-tooltip-html={`
                            //                             <div>
                            //                                 <span  style="font-weight: bold">Email: </span>
                            //                                 ${item.email ? item.email : "email not found"}
                            //                             </div>
                            //                         `}
                            //                             data-tooltip-delay-show={500}
                            //                         >

                            //                             {
                            //                                 (!item.opt_in_status_email) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }} onClick={() => handleSendOptInEmail(item.customer_id, item.email)}>
                            //                                         <EmailOptInIcon />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_email === 1) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }} onDoubleClick={() => handleSendOptInEmail(item.customer_id, item.email)}>
                            //                                         <EmailOptInIcon fill='#fbf50a' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_email === 2) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }}>
                            //                                         <EmailOptInIcon fill='mediumspringgreen' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_email === 3) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }} onClick={() => handleUpdateOptInEmailStatus(item.customer_id, 4, item.email)}>
                            //                                         <EmailOptInIcon fill='orangered' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_email === 4) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }}>
                            //                                         <EmailOptInIcon fill='orange' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                         </div>
                            //                         <Tooltip id={`tooltip-email-${item.customer_id}`} place="bottom" />
                            //                         <div
                            //                             className="w-[80%] mx-auto text-center py-1 text-white"
                            //                             style={{ borderRadius: '0.5rem', cursor: 'pointer', display: "flex", justifyContent: "center" }}
                            //                             data-tooltip-id={`tooltip-phone-${item.customer_id}`}
                            //                             data-tooltip-html={`
                            //                             <div>
                            //                                 <span  style="font-weight: bold">Phone: </span>
                            //                                 ${item.phone ? item.phone : "phone not found"}
                            //                             </div>
                            //                         `}
                            //                             data-tooltip-delay-show={500}
                            //                         >
                            //                             {
                            //                                 (!item.opt_in_status_phone) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }} onClick={() => handleSendOptInPhone(item.customer_id, item.phone)}>
                            //                                         <PhoneOptInIcon />

                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_phone === 1) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }} onDoubleClick={() => handleSendOptInPhone(item.customer_id, item.phone)}>
                            //                                         <PhoneOptInIcon fill='#fbf50a' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_phone === 2) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }}>
                            //                                         <PhoneOptInIcon fill='mediumspringgreen' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_phone === 3) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }} onClick={() => handleUpdateOptInPhoneStatus(item.customer_id, 4, item.phone)}>
                            //                                         <PhoneOptInIcon fill='orangered' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                             {
                            //                                 (item.opt_in_status_phone === 4) && (
                            //                                     <div className='mx-auto' style={{ width: "50px", height: "37px" }}>
                            //                                         <PhoneOptInIcon fill='orange' />
                            //                                     </div>
                            //                                 )
                            //                             }
                            //                         </div>
                            //                         <Tooltip id={`tooltip-phone-${item.customer_id}`} place="bottom" />
                            //                     </>
                            //                 }

                            //             </td>


                            //             <td>
                            //                 <div className='flex items-center justify-between'>
                            //                     <div>
                            //                         <p className="text-lg font-semibold text-white">{ }</p>
                            //                     </div>
                            //                     <div className="flex justify-end mr-3 gap-3 items-center">
                            //                         <div className="flex" style={{ gap: "0" }}>
                            //                             <div className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: "#fbf50a" }}>
                            //                                 <span className="text-black text-sm">{item.qued}</span>
                            //                             </div>
                            //                             <div className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: "orange", marginLeft: '-9px' }}>
                            //                                 <span className="text-white text-sm">{item.review}</span>
                            //                             </div>
                            //                             <div className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: "mediumspringgreen", marginLeft: '-9px' }}>
                            //                                 <span className="text-white text-sm">{item.sent}</span>
                            //                             </div>
                            //                         </div>
                            //                         <LuMessagesSquare className="text-3xl text-white" />
                            //                         {/* <IoMdRefresh className={`text-3xl ${expandId === item.project_id? 'text-green-500': 'text-white'}`} /> */}
                            //                         {item.sending_method == 2 ? (<IoMdRefresh className="text-3xl text-green-500 cursor-pointer" onClick={() => handlerChangeCustomerStatus(item.customer_id, 1)} />) : (
                            //                             <IoMdRefresh className="text-3xl text-white cursor-pointer" onClick={() => handlerChangeCustomerStatus(item.customer_id, 2)} />)}
                            //                         <FiDownload className="text-3xl text-white" onClick={() => handlerDownloadCustomer(item.customer_id)} />
                            //                         <IoCloseSharp className="text-3xl text-white cursor-pointer" onClick={() => {
                            //                             handleDeleteCustomer(item.customer_id)
                            //                         }} />
                            //                     </div>
                            //                 </div>
                            //             </td>
                            //         </tr>

                            //         {expandId === item.customer_id && item.data?.map((childData, childIndex) => {
                            //             let childStatus = 'REVIEW';
                            //             if (childData.message_status === 1) {
                            //                 childStatus = 'REVIEW'
                            //             } else if (childData.message_status === 2) {
                            //                 childStatus = 'QUED'
                            //             } else if (childData.message_status === 3) {
                            //                 childStatus = 'SENT'
                            //             }

                            //             return (
                            //                 <tr key={`child - ${childData.project_id}`} className={`bg-white border-t-2 border-t-gray-300 text-center`}>
                            //                     <td />
                            //                     <td className="text-lg font-semibold py-2">{childData.sent_timestamp ? moment.utc(childData.sent_timestamp).format(DATE_FORMAT) : '-'}</td>
                            //                     <td className="text-lg font-semibold">{childData.last_name}</td>
                            //                     <td className="text-lg font-semibold">{childData.first_name}</td>
                            //                     <td className="text-lg font-semibold">
                            //                         {
                            //                             <>
                            //                                 {childData.project_name}
                            //                                 <br />
                            //                                 {childData.claim_number}
                            //                             </>
                            //                         }
                            //                     </td>
                            //                     <td className="text-lg font-semibold">
                            //                         <div className={`w-[80%] mx-auto text-orange-900 text-center py-1
                            //                         ${childStatus === 'REVIEW' ? 'bg-yellow-500' : childStatus === 'QUED' ? 'bg-yellow-300' : 'bg-green-300'}`}>
                            //                             {childStatus}
                            //                         </div>
                            //                     </td>
                            //                     <td>
                            //                         <div className="flex justify-between mr-3 gap-3 items-center">

                            //                             <p className="text-lg font-semibold text-orange-900">{childData.last_message ? childData.last_message.slice(0, 50) + '...' : ''}</p>

                            //                             <div className="flex gap-3 items-center">
                            //                                 <p>{(childStatus === "QUED" && remainTime[dataIndex][childIndex]) && remainTime[dataIndex][childIndex]}</p>
                            //                                 <LuPencil className="text-2xl text-gray-400 cursor-pointer"
                            //                                     onClick={() => {
                            //                                         setTurnOnEdit(childData.project_id)
                            //                                         setEditMessage(childData.last_message || '')
                            //                                     }}
                            //                                 />
                            //                                 {childStatus === 'REVIEW' &&
                            //                                     (
                            //                                         (item.opt_in_status_email == 3 && item.opt_in_status_phone == 3) ?
                            //                                             <BsCheckLg className="text-3xl text-red-400 cursor-pointer" /> :
                            //                                             <BsCheckLg className="text-3xl text-gray-400 cursor-pointer"
                            //                                                 onClick={() => handlerSetQued(childData.project_id, childData.email, childData.phone)}
                            //                                             />

                            //                                     )
                            //                                 }
                            //                                 {childStatus === 'QUED' && (
                            //                                     <div className='flex cursor-pointer'>
                            //                                         <BsCheckLg className="text-3xl text-gray-400 cursor-pointer" />
                            //                                         <BsCheckLg className="text-3xl text-gray-500 cursor-pointer -ml-4" />
                            //                                     </div>
                            //                                 )}
                            //                                 {childStatus === 'SENT' && (
                            //                                     <div className='flex cursor-pointer'>
                            //                                         {

                            //                                             (childData.email !== "") && (<>
                            //                                                 <img src={messageIcon} alt="messageIcon" style={{ width: "30px", height: "30px", marginRight: "-30px" }} />
                            //                                                 <BsCheckLg className={`text-3xl ${childData.email_sent_success == 1 ? 'text-green-500' : 'text-red-500'} cursor-pointer`} />
                            //                                                 <BsCheckLg className={`text-3xl ${childData.email_sent_success == 1 ? 'text-green-500' : 'text-red-500'} cursor-pointer -ml-4`} />
                            //                                             </>)
                            //                                         }

                            //                                         {
                            //                                             (childData.phone !== "") && (<>
                            //                                                 <img src={phoneIcon} alt="phoneIcon" style={{ width: "30px", height: "30px", marginRight: "-30px" }} />
                            //                                                 <BsCheckLg className={`text-3xl ${childData.phone_sent_success == 1 ? 'text-green-500' : 'text-red-500'} cursor-pointer -ml-1`} />
                            //                                                 <BsCheckLg className={`text-3xl ${childData.phone_sent_success == 1 ? 'text-green-500' : 'text-red-500'} cursor-pointer -ml-4 -mr-2`} />
                            //                                             </>)
                            //                                         }
                            //                                     </div>
                            //                                 )}
                            //                                 {/* { childStatus === 'SENT' && (
                            //                                 <div className='flex cursor-pointer'>
                            //                                     <img src={phoneIcon} alt="logo" style={{width:"30px", height: "30px", marginRight: "-30px"}}
                            //                                     />
                            //                                     <BsCheckLg className="text-3xl text-green-500 cursor-pointer" />
                            //                                     <BsCheckLg className="text-3xl text-green-500 cursor-pointer -ml-4" />

                            //                                 </div>
                            //                             )} */}
                            //                                 {childStatus === 'QUED' && <FiMinusCircle className='text-2xl cursor-pointer text-red-500'
                            //                                     onClick={() => handlerCancelQued(childData.project_id)}
                            //                                 />}
                            //                                 <FiDownload className="text-3xl cursor-pointer " onClick={() => handlerDownloadProject(childStatus, childData)} />

                            //                                 {childStatus === 'REVIEW' && <AiFillDelete className="text-3xl text-red-500 cursor-pointer"
                            //                                     onClick={() => {
                            //                                         const res = confirm('Are you really sure to delete the message?')
                            //                                         if (res) {
                            //                                             handleDeleteMessage(childData.project_id)
                            //                                         }
                            //                                     }}
                            //                                 />}
                            //                                 {/* { childStatus === 'SENT' && <AiFillLike className="text-2xl cursor-pointer"/> } */}
                            //                             </div>
                            //                         </div>
                            //                     </td>
                            //                 </tr>
                            //             )
                            //         })}
                            //     </React.Fragment >
                            // )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
