import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="App">
            <center>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/schedule">Schedule</Link></li>
                    <li><Link to="/a">Error</Link></li>
                </ul>
            </center>
        </div>
    )
}