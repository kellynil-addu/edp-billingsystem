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

    // Intentionally no-op for now; detail implementation is handled by a separate teammate.
    const handleView = () => {};

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
        <table className={"w-full border-collapse"}>
            <thead className="bg-indigo-100 font-bold">
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
                        <TableCell>{client.propertyIds?.length || 0}</TableCell>
                        <TableCell>
                            <button onClick={handleView} style={{ padding: "0.35rem 0.65rem" }}>View</button>
                            <button onClick={() => handleEdit(client.id)} style={{ padding: "0.35rem 0.65rem", marginLeft: "0.4rem" }}>Edit</button>
                            <button onClick={() => handleDelete(client.id)} style={{ padding: "0.35rem 0.65rem", marginLeft: "0.4rem" }}>Delete</button>
                        </TableCell>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
