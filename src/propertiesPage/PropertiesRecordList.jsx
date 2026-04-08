import { useCallback, useContext } from "react";
import { AppContext } from "../App";
import TableCell from "../components/table/TableCell";

export function PropertiesRecordList() {

    const { data } = useContext(AppContext);

    const getPropertyName = (property) => `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;

    const getProperties = () => {
            const out = Object.values(data.clients).flatMap(client => {
                return client.propertyIds.map(i => data.properties[i]).flatMap(property => {
                    return {
                        id: property.id,
                        name: getPropertyName(property),
                        owner: client.fullName,
                        areaInSqm: property.areaInSqm,
                        pricePerSqm: property.pricePerSqm,
                        totalPrice: property.areaInSqm * property.pricePerSqm
                    }
                });
            })

            out.sort((a, b) => b.date - a.date);
    
            return out;
    };

    const properties = getProperties();

    return (
        <table className={"w-full border-collapse"}>
            <thead className="bg-indigo-100 font-bold">
                <tr>
                    <TableCell>ID</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Area (sqm)</TableCell>
                    <TableCell>Price per sqm</TableCell>
                    <TableCell>Total Price</TableCell>
                </tr>
            </thead>
            <tbody>
                {
                    properties.map(p => (
                        <tr>
                            <TableCell>{p.id}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.owner}</TableCell>
                            <TableCell>{p.areaInSqm}</TableCell>
                            <TableCell>{p.pricePerSqm}</TableCell>
                            <TableCell>{p.totalPrice}</TableCell>
                        </tr>
                    ))
                }

            </tbody>
        </table>
    )
}