export const Desktop = () => {
    return (
        <>
            <div className="desktop">
                <div className="schedule-container">
                    <header className="schedule-header">
                        <img src="https://media0.giphy.com/media/AQz3wCDgDX3HO/giphy.gif?cid=6c09b952gf70nzcys3l8f78b8wcew4n6q6zoee3rp4ulsyzz&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                            alt="Schedule Icon" className="schedule-icon" />
                        <h1>My School Schedule</h1>
                    </header>
                    <table className="schedule-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Lesson 1 */}
                            <tr>
                                <td data-label="Time"><b>9:00 - 10:10</b></td>
                                <td data-label="Monday">
                                    <div className="class-details">
                                        <span>Management</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Tuesday">
                                    <div className="class-details">
                                        <span>Security</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Wednesday">
                                    <div className="class-details">
                                        <span>Ձեներեցություն</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Thursday">
                                    <div className="class-details">
                                        <span>JavaScript</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Friday">
                                    <div className="class-details">
                                        <span>Interface</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                            </tr>

                            {/* Lesson 2 */}
                            <tr>
                                <td data-label="Time"><b>10:20 - 11:30</b></td>
                                <td data-label="Monday">
                                    <div className="class-details">
                                        <span>Interface</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Tuesday">
                                    <div className="class-details">
                                        <span>NonRelative DB</span>
                                        <span>Room <b></b></span>
                                    </div>
                                </td>
                                <td data-label="Wednesday">
                                    <div className="class-details">
                                        <span>JavaScript</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Thursday">
                                    <div className="class-details">
                                        <span>Դիֆերենցիալ</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Friday">
                                    <div className="class-details">
                                        <span>Դիսկրետ</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                            </tr>

                            {/* Lesson 3 */}
                            <tr>
                                <td data-label="Time"><b>11:50 - 1:00</b></td>
                                <td data-label="Monday">
                                    <div className="class-details">
                                        <span>Networks</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Tuesday">
                                    <div className="class-details">
                                        <span>NMA</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Wednesday">
                                    <div className="class-details">
                                        <span>Probability</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Thursday">
                                    <div className="class-details">
                                        <span>Probability</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                                <td data-label="Friday">
                                    <div className="class-details">
                                        <span>Networks</span>
                                        <span>Room <b>X</b></span>
                                    </div>
                                </td>
                            </tr>

                            {/* Lesson 4 */}
                            <tr>
                                <td data-label="Time"><b>1:10 - 2:20</b></td>
                                <td data-label="Monday"></td>
                                <td data-label="Tuesday">
                                    <div className="class-details">
                                        <span>Ձեներեցություն</span>
                                        <span>Room <b>X</b></span>
                                    </div></td>
                                <td data-label="Wednesday"></td>
                                <td data-label="Thursday"></td>
                                <td data-label="Friday"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
