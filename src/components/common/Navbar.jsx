import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'

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
                    <div className={`py-2 px-4 ${window.location.pathname === '/messages' ? 'bg-red-700' : 'bg-yellow-400 hover:bg-yellow-500'} inline-block cursor-pointer`}>
                        <Link to="/messages"><p className="text-xl font-semibold text-white">MESSAGES</p></Link>
                    </div>
                    <div className={`py-2 px-4 ${window.location.pathname === '/clients' ? 'bg-red-700' : 'bg-green-700 hover:bg-green-800'} inline-block cursor-pointer`}>
                        <Link to="/clients"><p className="text-xl font-semibold text-white">CLIENT LIST</p></Link>
                    </div>
                    <div className={`py-2 px-4 ${window.location.pathname === '/phones' ? 'bg-red-700' : 'bg-blue-700 hover:bg-blue-800'} inline-block cursor-pointer`}>
                        <Link to="/phones"><p className="text-xl font-semibold text-white">PHONES</p></Link>
                    </div>
                </div>
            </div>
        </>
    )
}
