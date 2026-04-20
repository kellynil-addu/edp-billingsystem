import { useContext, useMemo } from "react";
import { AppContext } from "../App";
import TableCell from "../components/table/TableCell";

export default function ClientsRecordList() {
    const { data, setCurrentPage } = useContext(AppContext);

    const clients = useMemo(() => {
        const out = Object.values(data.clients);
        out.sort((a, b) => b.id - a.id);
        return out;
    }, [data.clients]);

    const handleView = (clientId) => {
        setCurrentPage({ name: "viewClient", params: { clientId } });
    };

    const handleEdit = (clientId) => {
        setCurrentPage({ name: "editClient", params: { clientId } });
    };

    const handleDelete = (clientId) => {
        if (!window.confirm(`Delete client ${clientId}?`)) {
            return;
        }

        data.deleteClient(clientId);
    };

    return (
        <table className="data-table">
            <thead>
                <tr>
                    <TableCell>ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Properties Owned</TableCell>
                    <TableCell>Actions</TableCell>
                </tr>
            </thead>
            <tbody>
                {clients.length === 0 ? (
                    <tr>
                        <TableCell colSpan={5}>No clients found.</TableCell>
                    </tr>
                ) : clients.map(client => (
                    <tr key={String(client.id)}>
                        <TableCell>{client.id}</TableCell>
                        <TableCell>{client.fullName}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>{client.propertyIds?.length || 0}
                        </TableCell>
                        <TableCell>
                            <div className="ui-button-row">
                                <button className="btn-sm btn-ghost" onClick={() => handleView(client.id)}>View</button>
                                <button className="btn-sm btn-ghost" onClick={() => handleEdit(client.id)}>Edit</button>
                                <button className="btn-sm btn-danger" onClick={() => handleDelete(client.id)}>Delete</button>
                            </div>
                        </TableCell>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
