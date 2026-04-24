import { GiHamburgerMenu } from "react-icons/gi";
import { MdDarkMode, MdLightMode } from "react-icons/md";

import './index.css'
import logo from '../../../assets/logo.svg'

const Navbar = ({ isDarkMode, onToggleTheme }) => {
    return (
        <nav className="navbar">
            <img className="image" src={logo} alt="Logo" />
            <div className="navbar-actions">
            <button
                type="button"
                className="theme-toggle"
                onClick={onToggleTheme}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
            </button>
            <button type="button" className="menu-toggle" aria-label="Open menu">
                <GiHamburgerMenu size={30} />
            </button>
            </div>
        </nav>
    )
}

export default Navbar;