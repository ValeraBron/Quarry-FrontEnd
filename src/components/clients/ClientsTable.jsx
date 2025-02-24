import React, { useEffect, useState } from 'react'
import { Dropdown } from './Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { loadingOff, loadingOn } from '../../store/authSlice'
import { setClients } from '../../store/clientSlice'
import { setCategories } from '../../store/categorySlice'
import { getClients, getCustomerCategories } from '../../services/clients'
import { Navbar } from '../common/Navbar'
import { FiFile } from 'react-icons/fi'
import { addClient } from '../../services/clients'

export const ClientsTable = () => {
    const [phoneNumbers, setPhoneNumbers] = useState([''])
    const [filePath, setFilePath] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState([])
    const dispatch = useDispatch()
    const clients = useSelector(state => state.client.data)
    const categories = useSelector(state => state.category.categories)
    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        dispatch(loadingOn());
        fetchData();
        dispatch(loadingOff())
    }, [refetch])

    const fetchData = async () => {
        
        let clients = await getClients();
        let categories = await getCustomerCategories();
        
        if (clients.detail === "Could not validate credentials") {
            alert('Unauthorized user!');
            navigate('/signup')
        }

        if (clients) {
            if (Array.isArray(clients)) {
                dispatch(setClients(clients))
                dispatch(setCategories(categories))
            }
        }
        
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

        if (selectedCategories.length === 0) {
            alert('Please select at least one category');
            return;
        }

        try {
            dispatch(loadingOn());
            
            const clientData = {
                phone_numbers: validPhoneNumbers,
                categories: selectedCategories
            };
            
            const response = await addClient(clientData);
            if (response.message !== "Customer added successfully" && response.status !== 200) {
                throw new Error('Failed to add client');
            }

            setPhoneNumbers(['']);
            setSelectedCategories([]);
            setFilePath(null);

            // Optionally reset categories
            // setSelectedCategories([]);
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Failed to add client');
        } finally {
            console.log("handle add client")
            setRefetch(!refetch);
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

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
        // You can perform any additional actions here when categories change
    }

    return (
        <div>
            <Navbar />

            <div>
                <div className='flex items-center gap-5 bg-white px-5 mb-[2px] py-1'>
                    <Dropdown 
                    onCategorySelect={(newSelectedCategories) => {
                        setSelectedCategories(newSelectedCategories);
                    }}
                    />

                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <input 
                                type='text'
                                className='border border-gray-300 bg-gray-200 text-lg px-3 py-1 text-gray-500 rounded-sm w-96'
                                placeholder='Phone Numbers (e.g. +1 098 765 4321)'
                                value={phoneNumbers.join(',')}
                                onChange={(e) => {
                                    const numbers = e.target.value.split(',');
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
                            <th className="w-[30%] text-center p-2 text-lg text-white">Cell Phone</th>
                            <th className="w-[10%] text-white text-lg text-center">Last Received</th>
                            <th className="w-[20%] text-white text-lg text-center">List</th>
                        </tr>
                    </thead>

                    <tbody className="table-body-transparent">
                        {clients.map((item, index) => (
                            <tr key={index} className="bg-red-700 border-t-2 border-t-white">
                                <td className="text-center p-2 text-white">{index + 1}</td>
                                <td className="text-center p-2 text-white">
                                    {item.phone_numbers[0]}
                                    {item.phone_numbers.length > 1 && (
                                        <span className="text-gray-500 text-sm ml-2 text-white">
                                            (+{item.phone_numbers.length - 1} more)
                                        </span>
                                    )}
                                </td>
                                <td className="text-center p-2 text-white">{item.last_received || '-'}</td>
                                <td className="text-center p-2 text-white">
                                    {item.categories ? categories.filter(cat => item.categories.includes(cat.id)).map(cat => cat.name).join(', ') : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
