import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Use environment variables for username and repo name
                const username = process.env.REACT_APP_GITHUB_USERNAME;
                const repoName = process.env.REACT_APP_GITHUB_REPO_NAME;

                const response = await axios.get(
                    `https://api.github.com/repos/${username}/${repoName}/contents/users.json`,
                    {
                        headers: {
                            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`, // Access token for authentication
                        },
                    }
                );

                // The content is base64 encoded, so we need to decode it
                const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
                const usersData = JSON.parse(content);

                setUsers(usersData.users); // Assuming your JSON structure has a "users" array
            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;
