import { Link } from 'react-router-dom'
import logo from '../../assets/Logo.svg'

export const Navbar = () => {

    return (
        <>
            <div className="w-[400px] pl-8 pt-8">
                <img src={logo} alt="logo"
                    className="w-[90%] h-[100%] object-cover"
                />
            </div>

            <div className="pt-16" >
                <div className="flex items-center gap-1">
                    <div className="py-2 px-4 bg-yellow-400 inline-block mb-[1px] cursor-pointer" onClick={() => () => { }}>
                        <Link to="/messages"><p className="text-xl font-semibold text-white">MESSAGES</p></Link>
                    </div>
                    <div className="py-2 px-4 bg-red-700 inline-block mb-[1px] mx-1 cursor-pointer" onClick={() => () => { }}>
                        <Link to="/clients"><p className="text-xl font-semibold text-white">CLIENT LIST</p></Link>
                    </div>
                </div>
            </div>
        </>
    )
}
