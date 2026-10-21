import '../css/side-menu.css';
import icon from '../assets/paw-circle-icon.svg';
import { useNavigate } from "react-router-dom";

function SideMenu() {
    return(
        <nav className="side-menu">
            <div className='icon-container'>
                <img src={icon} className='icon' alt="" />
                <h2>Pet Management System</h2>
            </div>
            <div className="button nav-item">Instructions</div>
            <div className="separator"></div>
            <div className="button nav-item">Pet Rankings</div>
            <div className="separator"></div>
            <div className="button nav-item">Pet Table</div>
        </nav>
    )
}

export default SideMenu