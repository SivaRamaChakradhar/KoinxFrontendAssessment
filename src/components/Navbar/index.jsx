import { GiHamburgerMenu } from "react-icons/gi";
import './index.css'
import logo from '../../../assets/logo.svg'

const Navbar = () => {
    return (
        <nav className="navbar">
            <img className="image" src={logo} alt="Logo" />
            <GiHamburgerMenu size={30} />
        </nav>
    )
}

export default Navbar;