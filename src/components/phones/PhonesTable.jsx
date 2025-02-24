import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { Navbar } from '../common/Navbar'
import moment from 'moment'
import { DATE_TIME_FORMAT_CLIENT } from '../../constants'
import { getPhones } from '../../services/phone'
// import { getClients } from '../../services/clients'
import { setPhones } from '../../store/phoneSlice'
// import { setClients } from '../../store/clientSlice'
// import { getCustomerCategories } from '../../services/clients'
// import { setCategories } from '../../store/categorySlice'

export const PhonesTable = () => {
    const dispatch = useDispatch()
    const phones = useSelector(state => state.phone.data)
    // const clients = useSelector(state => state.client.data)
    // const categories = useSelector(state => state.category.categories)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        dispatch(loadingOn())
        const phoneData = await getPhones()
        // const clientData = await getClients()
        // const categoryData = await getCustomerCategories()

        if (phoneData) dispatch(setPhones(phoneData))
        // console.log(phoneData)
        // if (clientData) dispatch(setClients(clientData))
        // if (categoryData) dispatch(setCategories(categoryData))

        dispatch(loadingOff())
    }

    return (
        <div>
            <Navbar />

            <div>
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
                        {phones?.map((item, index) => (
                            <tr key={index} className="bg-red-700 border-t-2 border-t-white">
                                <td className="text-center p-2 text-white">{index + 1}</td>
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
            </div>
        </div>
    )
}
