import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, reportsResponse, licensesResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/v1/users/'),
                    axios.get('http://127.0.0.1:8000/api/v1/reports/'),
                    axios.get('http://127.0.0.1:8000/api/v1/licenses/')
                ]);

                setUsers(usersResponse.data);
                setReports(reportsResponse.data);
                setLicenses(licensesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id_user}>
                        ID: {user.id_user} | Name: {user.name} | Email: {user.email}
                    </li>
                ))}
            </ul>
            <h1>Reports</h1>
            <ul>
                {reports.map(report => (
                    <li key={report.id_report}>
                        ID: {report.id_report} | 
                        Game: {report.game} |
                        DateTime: {report.game_datetime} |
                        Predicted: {report.predicted} |
                        Effectiveness: {report.effectiveness}% |
                        Description: {report.description || 'N/A'}
                    </li>
                ))}
            </ul>
            <h1>Licenses</h1>
            <ul>
                {licenses.map(license => (
                    <li key={license.id_license}>
                        ID: {license.id_license} | 
                        Key: {license.key} |
                        Expiration Date: {license.date_expiration}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Test;
