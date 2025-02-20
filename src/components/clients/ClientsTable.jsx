import React, { useEffect, useState } from 'react'
import { Dropdown } from './Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { setClient } from '../../store/clientSlice'
import { getClients} from '../../services/clients'
import { Navbar } from '../common/Navbar'
import { FiFile } from 'react-icons/fi'
import { addClient } from '../../services/clients'

export const ClientsTable = () => {
    const [phoneNumbers, setPhoneNumbers] = useState([''])
    const [filePath, setFilePath] = useState(null)
    const dispatch = useDispatch()
    const data = useSelector(state => state.client.data)


    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        dispatch(loadingOn());
        let res = await getClients();
    
        if (res.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (res) {
            if (Array.isArray(res)) {
                // console.log("rs: ", res);
                dispatch(setClient(res))
            }
        }
        dispatch(loadingOff())
    }

    const handleAddPhoneInput = () => {
        setPhoneNumbers([...phoneNumbers, ''])
    }

    const handlePhoneChange = (index, value) => {
        const updatedNumbers = [...phoneNumbers];
        updatedNumbers[index] = value;
        setPhoneNumbers(updatedNumbers);
    }

    const handleRemovePhoneInput = (index) => {
        const updatedNumbers = phoneNumbers.filter((_, i) => i !== index)
        setPhoneNumbers(updatedNumbers)
    }

    const handleAddClient = async () => {
        const validPhoneNumbers = phoneNumbers.filter(num => num.trim() !== '');
        
        if (validPhoneNumbers.length === 0) {
            alert('Please enter at least one phone number');
            return;
        }

        try {
            dispatch(loadingOn());
            
            const response = await addClient({phone_numbers: validPhoneNumbers});
            console.log("response: ", response);
            if (response.message !== "Customer added successfully" && response.status !== 200) {
                throw new Error('Failed to add client');
            }

            setPhoneNumbers(['']);
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Failed to add client');
        } finally {
            fetchData();
            dispatch(loadingOff());
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFilePath(file)
            
            // Read the file contents
            const reader = new FileReader()
            reader.onload = (event) => {
                const content = event.target.result
                // Split content by newlines and handle different delimiters (comma or pipe)
                const numbers = content
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line) // Remove empty lines
                    .flatMap(line => {
                        // Try splitting by comma first, then by pipe if no commas found
                        const parts = line.includes(',') ? 
                            line.split(',') : 
                            line.split('|')
                        return parts.map(part => part.trim())
                    })
                    .filter(number => number) // Remove empty values

                if (numbers.length > 0) {
                    // Update phone number fields
                    setPhoneNumbers(numbers)
                } else {
                    alert('No valid phone numbers found in the file')
                    setFilePath(null)
                    e.target.value = '' // Reset file input
                }
            }

            reader.onerror = () => {
                alert('Error reading file')
                setFilePath(null)
                e.target.value = '' // Reset file input
            }

            // Read file as text
            reader.readAsText(file)
        }
    }

    return (
        <div>
            <Navbar />

            <div>
                <div className='flex items-center gap-5 bg-white px-5 mb-[2px] py-1'>
                    <Dropdown />

                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <input 
                                type='text'
                                className='border border-gray-300 bg-gray-200 text-lg px-3 py-1 text-gray-500 rounded-sm w-96'
                                placeholder='Phone Numbers (e.g. +1 098 765 4321)'
                                value={phoneNumbers.join(',')}
                                onChange={(e) => {
                                    const numbers = e.target.value.split(',').map(n => n.trim());
                                    setPhoneNumbers(numbers);
                                }}
                            />
                        </div>
                    </div>

                    <span className='text-gray-500 text-lg'>or</span>

                    <div className="relative">
                        <input 
                            type="file" 
                            id="phone-numbers-file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv,.xlsx,.xls, .txt"
                        />
                        <label 
                            htmlFor="phone-numbers-file" 
                            className="flex items-center gap-2 cursor-pointer bg-gray-200 text-gray-500 py-1 px-3 rounded-sm"
                        >
                            <FiFile className="text-lg" />
                            <span>{filePath ? filePath.name : 'Choose file'}</span>
                        </label>
                    </div>

                    <button 
                        className='bg-green-500 text-white px-5 py-1 rounded-sm text-lg font-semibold'
                        onClick={handleAddClient}
                    >
                        ADD
                    </button>
                </div>

                <table className="w-[100%]">
                    <thead className=" bg-red-700">
                        <tr>
                            <th className="w-[10%] text-center p-2 text-lg text-white">ID</th>
                            <th className="w-[50%] text-center p-2 text-lg text-white">Cell Phone</th>
                            <th className="w-[10%] text-white text-lg text-center">Opt In</th>
                            <th className="w-[10%] text-white text-lg text-center">Sent Optin</th>
                            <th className="w-[10%] text-white text-lg text-center">Last Received</th>
                            <th className="w-[10%] text-white text-lg text-center">List</th>
                        </tr>
                    </thead>

                    <tbody className="table-body-transparent">
                        {data.map((item) => (
                            <tr key={item.id} className="bg-green-50 hover:bg-green-100">
                                <td className="text-center p-2">{item.id}</td>
                                <td className="text-center p-2">
                                    {item.phone_numbers.map((phone, index) => (
                                        <div key={index}>
                                            {phone}
                                            {index < item.phone_numbers.length - 1 && <br />}
                                        </div>
                                    ))}
                                </td>
                                <td className="text-center p-2">{item.opt_in ? 'Yes' : 'No'}</td>
                                <td className="text-center p-2">{item.sent_optin ? 'Yes' : 'No'}</td>
                                <td className="text-center p-2">{item.last_received || '-'}</td>
                                <td className="text-center p-2">{item.list || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
