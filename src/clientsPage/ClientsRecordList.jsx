import { useContext, useMemo, useState } from "react";
import { AppContext } from "../App";
import TableCell from "../components/table/TableCell";

export default function ClientsRecordList() {
    const { data, setCurrentPage } = useContext(AppContext);

    const clients = useMemo(() => {
        const out = Object.values(data.clients);
        out.sort((a, b) => b.id - a.id);
        return out;
    }, [data.clients]);

    const [filteredClients, setFilteredClients] = useState(clients);

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

    const handleSort = (criteria) => {
        console.log("Sort by:", criteria);

        const sortedClients = [...clients];
        
        switch (criteria) {
            case "id_ascending":
                sortedClients.sort((a, b) => a.id - b.id);
                break;
            case "id_descending":
                sortedClients.sort((a, b) => b.id - a.id);
                break;
            case "name_ascending":
                sortedClients.sort((a, b) => a.fullName.localeCompare(b.fullName));
                break;
            case "name_descending":
                sortedClients.sort((a, b) => b.fullName.localeCompare(a.fullName));
                break;
            case "properties_ascending":
                sortedClients.sort((a, b) => (a.propertyIds?.length || 0) - (b.propertyIds?.length || 0));
                break;
            case "properties_descending":
                sortedClients.sort((a, b) => (b.propertyIds?.length || 0) - (a.propertyIds?.length || 0));
                break;
            default:
                break;
        }

        sortedClients.forEach(client => {
            console.log(`Client: ${client.fullName}, Properties Owned: ${client.propertyIds?.length || 0}`);
        });

        const table = document.querySelector(".data-table tbody");
        const rows = table.getElementsByTagName("tr");
        
        const rowMap = {};
        for (let i = 0; i < rows.length; i++) {
            const clientId = rows[i].getElementsByTagName("td")[0].textContent;
            rowMap[clientId] = rows[i];
        }

        sortedClients.forEach(client => {
            const row = rowMap[client.id];
            if (row) {
                table.appendChild(row);
            }
        });

        console.log("Sorted clients:", sortedClients);
    }

    const handleSearch = () => {
        var query = document.getElementById("search-clients").value.toLowerCase();
        console.log("Search query:", query);

        var filteredClients = Array.from(clients);

        while(query.includes("#")) {
            var category = query.slice(query.indexOf("#") + 1,query.indexOf(":") > -1 ? query.indexOf(":") : undefined);
            // console.log("Searching by tag:", category);

            if(category.includes("id")) {
                var id = query.slice(query.indexOf("#id:")+4,query.indexOf(" ", query.indexOf("#id:")) > -1 ? query.indexOf(" ", query.indexOf("#id:")) : undefined).toLowerCase();
                
                console.log("Filtering by ID:", id);
                filteredClients = filteredClients.filter(client => {
                    return client.id.toString().includes(id);
                });
            }

            if(category.includes("address")){;
                var address = query.slice(query.indexOf("#address:")+9,query.indexOf(" ", query.indexOf("#address:")) > -1 ? query.indexOf(" ", query.indexOf("#address:")) : undefined).toLowerCase();
                if(address.includes("_")) {
                    address = address.replaceAll("_", " ");
                }
                console.log("Filtering by address:", address);

                filteredClients = filteredClients.filter(client => {
                    return client.address.toLowerCase().includes(address);
                });
            }

            if(category.includes("properties_owned")) {
                var properties_owned = query.slice(query.indexOf("#properties_owned:")+18,query.indexOf(" ", query.indexOf("#properties_owned:")) > -1 ? query.indexOf(" ", query.indexOf("#properties_owned:")) : undefined).toLowerCase();
                if(properties_owned.includes("_")) {
                    properties_owned = properties_owned.replaceAll("_", " ");
                }
                console.log("Filtering by properties owned:", properties_owned);
                filteredClients = filteredClients.filter(client => {
                    const numProperties = client.propertyIds?.length || 0;
                    if(properties_owned==numProperties) {
                        return true;
                    }
                    return false;
                });
            }

            // const filteredRowsCount = filteredRows.length;
            // console.log(`Rows remaining after filtering by ${category}:`, filteredRowsCount);

            query = query.substring(0, query.indexOf("#")) + query.substring(query.indexOf(" ") > -1 ? query.indexOf(" ") + 1 : query.length);
            console.log("search query after tag processing:", query);
            // }
        }

        filteredClients = filteredClients.filter(client => {
            return client.fullName.toLowerCase().includes(query);
        });

        setFilteredClients(filteredClients);
    }

    return (
        <li>
            <div class="upper-lip">
                <div class="search">
                    <input type="text" onChange={handleSearch} id="search-clients" placeholder="Search clients...         use #(category_name): to search for specific category"></input>
                </div>
                <div class="sort">
                    <select name="sort" id="sort" onChange={(e) => handleSort(e.target.value)}>
                        <option value="id_ascending">ID (Oldest First)</option>
                        <option value="id_descending">ID (Newest First)</option>
                        <option value="name_ascending">Name (A-Z)</option>
                        <option value="name_descending">Name (Z-A)</option>
                        <option value="properties_ascending">Properties Owned (Low to High)</option>
                        <option value="properties_descending">Properties Owned (High to Low)</option>
                    </select>
                </div>
            </div>
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
                    {filteredClients.length === 0 ? (
                        <tr>
                            <TableCell colSpan={5}>No clients found.</TableCell>
                        </tr>
                    ) : filteredClients.map(client => (
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
        </li>
    );
}
