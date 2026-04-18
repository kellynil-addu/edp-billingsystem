import { useContext } from "react";
import { AppContext } from "../App";
import TableCell from "../components/table/TableCell";

export function PropertiesRecordList() {

    const { data, setCurrentPage } = useContext(AppContext);

    const getPropertyName = (property) => `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;

    const getOwnerName = (propertyId) => {
        const owner = Object.values(data.clients).find(client => client.propertyIds?.includes(propertyId));
        return owner ? owner.fullName : "Unassigned";
    };

    const getProperties = () => {
            const out = Object.values(data.properties).map(property => {
                return {
                    id: property.id,
                    name: getPropertyName(property),
                    owner: getOwnerName(property.id),
                    status: property.account?.status || "available",
                    areaInSqm: property.areaInSqm,
                    pricePerSqm: property.pricePerSqm,
                    totalPrice: property.areaInSqm * property.pricePerSqm
                }
            });

            out.sort((a, b) => b.id - a.id);
    
            return out;
    };

    const properties = getProperties();

    // Intentionally no-op for now; detail implementation is handled by a separate teammate.
    const handleView = (propertyId) => {
        setCurrentPage({ name: "viewProperty", params: { propertyId } });
    };

    const handleEdit = (propertyId) => {
        setCurrentPage({ name: "editProperty", params: { propertyId } });
    };

    const handleDelete = (propertyId) => {
        if (!window.confirm(`Delete property ${propertyId}? This also removes its payments.`)) {
            return;
        }

        data.deleteProperty(propertyId);
    };

    return (
        <table className={"w-full border-collapse"}>
            <thead className="bg-indigo-100 font-bold">
                <tr>
                    <TableCell>ID</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Area (sqm)</TableCell>
                    <TableCell>Price per sqm</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Actions</TableCell>
                </tr>
            </thead>
            <tbody>
                {
                    properties.length === 0 ? (
                        <tr>
                            <TableCell colSpan={8}>No properties found.</TableCell>
                        </tr>
                    ) : properties.map(p => (
                        <tr key={String(p.id)}>
                            <TableCell>{p.id}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.owner}</TableCell>
                            <TableCell>{p.status}</TableCell>
                            <TableCell>{p.areaInSqm}</TableCell>
                            <TableCell>{p.pricePerSqm}</TableCell>
                            <TableCell>{p.totalPrice}</TableCell>
                            <TableCell>
                                <button onClick={() => handleView(p.id)} style={{ padding: "0.35rem 0.65rem" }}>View</button>
                                <button onClick={() => handleEdit(p.id)} style={{ padding: "0.35rem 0.65rem", marginLeft: "0.4rem" }}>Edit</button>
                                <button onClick={() => handleDelete(p.id)} style={{ padding: "0.35rem 0.65rem", marginLeft: "0.4rem" }}>Delete</button>
                            </TableCell>
                        </tr>
                    ))
                }

            </tbody>
        </table>
    )
}