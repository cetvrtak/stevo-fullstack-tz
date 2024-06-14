import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Clients = ({ token }) => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const res = await axios.get('/clients', {
                headers: {
                    'Authorization': token
                }
            });
            setClients(res.data);
        };

        fetchClients();
    }, [token]);

    const handleChangeStatus = async (account_number, status) => {
        try {
            await axios.patch(`/clients/${account_number}`, { status }, {
                headers: {
                    'Authorization': token
                }
            });
            setClients(clients.map(client => client.account_number === account_number ? { ...client, status } : client));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Account Number</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {clients.map(client => (
                    <tr key={client.account_number}>
                        <td>{client.account_number}</td>
                        <td>{client.name}</td>
                        <td>{client.surname}</td>
                        <td>{client.status}</td>
                        <td>
                            <select onChange={(e) => handleChangeStatus(client.account_number, e.target.value)} value={client.status}>
                                <option value="Not in work">Not in work</option>
                                <option value="In progress">In progress</option>
                                <option value="Rejection">Rejection</option>
                                <option value="Transaction closed">Transaction closed</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Clients;
