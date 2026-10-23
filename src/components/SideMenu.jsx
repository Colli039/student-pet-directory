import '../css/side-menu.css';
import icon from '../assets/paw-circle-icon.svg';
import { useNavigate } from "react-router-dom";

function SideMenu() {
    const navigate = useNavigate()

    return(
        <nav className="side-menu">
            <div className='icon-container'>
                <img src={icon} className='icon' alt="" />
                <h2>Pet Management System</h2>
            </div>
            <div className="separator"></div>
            <button className="button nav-item" onClick={() => navigate('/')}>Instructions</button>
            <div className="separator"></div>
            <button className="button nav-item" onClick={() => navigate('/pets')}>Pet Table</button>
            <div className="separator"></div>
        </nav>
    )
}

export default SideMenu