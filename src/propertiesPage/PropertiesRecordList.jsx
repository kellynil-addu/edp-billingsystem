import { useContext, useState} from "react";
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

    const [filteredProperties, setFilteredProperties] = useState(properties); 

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

    const handleSearch = () => {
        var query = document.getElementById("search-properties").value.toLowerCase();
        console.log("Search query:", query);

        var filteredProperties = Array.from(properties);

        while(query.includes("#")) {
            var category = query.slice(query.indexOf("#") + 1,query.indexOf(":")> -1 ? query.indexOf(":"): undefined);

            if(category.includes("id")) {
                var id = query.slice(query.indexOf("#id:")+4,query.indexOf(" ", query.indexOf("#id:")) > -1 ? query.indexOf(" ", query.indexOf("#id:")) : undefined).toLowerCase();

                console.log("Filtering by ID:", id);
                filteredProperties = filteredProperties.filter(property => {
                    return property.id.toString().includes(id);
                });
            }

            if(category.includes("owner")){;
                var owner = query.slice(query.indexOf("#owner:")+7,query.indexOf(" ", query.indexOf("#owner:")) > -1 ? query.indexOf(" ", query.indexOf("#owner:")) : undefined).toLowerCase();
                if(owner.includes("_")) {
                    owner = owner.replaceAll("_", " ");
                }
                console.log("Filtering by owner:", owner);

                filteredProperties = filteredProperties.filter(property => {
                    return property.owner.toLowerCase().includes(owner);
                });
            }

            if(category.includes("status")){;
                var status = query.slice(query.indexOf("#status:")+8,query.indexOf(" ", query.indexOf("#status:")) > -1 ? query.indexOf(" ", query.indexOf("#status:")) : undefined).toLowerCase();
                console.log("Filtering by status:", status);

                filteredProperties = filteredProperties.filter(property => {
                    return property.status.toLowerCase().includes(status);
                });
            }

            if(category.includes("area")) {
                var area = query.slice(query.indexOf("#area:")+6,query.indexOf(" ", query.indexOf("#area:")) > -1 ? query.indexOf(" ", query.indexOf("#area:")) : undefined).toLowerCase();

                console.log("Filtering by area:", area);
                filteredProperties = filteredProperties.filter(client => {
                    const areaInSqm = client.areaInSqm;
                    if(area==areaInSqm) {
                        return true;
                    }
                    return false;
                });
            }

            if(category.includes("total_price")) {
                var total_price = query.slice(query.indexOf("#total_price:")+13,query.indexOf(" ", query.indexOf("#total_price:")) > -1 ? query.indexOf(" ", query.indexOf("#total_price:")) : undefined).toLowerCase();

                console.log("Filtering by total price:", total_price);

                filteredProperties = filteredProperties.filter(client => {
                    const tPrice = client.areaInSqm * client.pricePerSqm;
                    console.log(tPrice);
                    console.log(total_price);
                    if(total_price==tPrice) {
                        return true;
                    }
                    return false;
                });
            }else if(category.includes("price")) {
                var price = query.slice(query.indexOf("#price:")+7,query.indexOf(" ", query.indexOf("#price:")) > -1 ? query.indexOf(" ", query.indexOf("#price:")) : undefined).toLowerCase();

                console.log("Filtering by price:", price);
                filteredProperties = filteredProperties.filter(client => {
                    const pricePerSqm = client.pricePerSqm;
                    if(price==pricePerSqm) {
                        return true;
                    }
                    return false;
                });
            }

            query = query.substring(0, query.indexOf("#")) + query.substring(query.indexOf(" ") > -1 ? query.indexOf(" ") + 1 : query.length);
            console.log("search query after tag processing:", query);
        }

        filteredProperties = filteredProperties.filter(property => {
            return property.name.toLowerCase().includes(query);
        });

        setFilteredProperties(filteredProperties);
    }

    const handleSort = (criteria) => {
        console.log("Sort by:", criteria);

        const sortedProperties = [...properties];
        
        switch (criteria) {
            case "id_ascending":
                sortedProperties.sort((a, b) => a.id - b.id);
                break;
            case "id_descending":
                sortedProperties.sort((a, b) => b.id - a.id);
                break;
            case "property_ascending":
                sortedProperties.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "property_descending":
                sortedProperties.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "price_ascending":
                sortedProperties.sort((a, b) => a.totalPrice - b.totalPrice);
                break;
            case "price_descending":
                sortedProperties.sort((a, b) => b.totalPrice - a.totalPrice);
                break;
            default:
                break;
        }
        
        const table = document.querySelector(".data-table tbody");
        const rows = table.getElementsByTagName("tr");
        const rowMap = {};
        for (let i = 0; i < rows.length; i++) {
            const propertyId = rows[i].getElementsByTagName("td")[0].textContent;
            rowMap[propertyId] = rows[i];
        }
        
        sortedProperties.forEach(property => {
            const row = rowMap[property.id];
            if (row) {
                table.appendChild(row);
            }
        });
   
        console.log("Sorted properties:", sortedProperties);
    }

    return (
        <li>
            <div class="upper-lip">
                <div class="search">
                    <input type="text" onKeyUp={handleSearch} id="search-properties" placeholder="Search properties...       use #(category_name): to search for specific category"></input>
                </div>
                <div class="sort">
                    <select name="sort" id="sort-properties" onChange={(e) => handleSort(e.target.value)}>
                        <option value="id_ascending">ID (Oldest First)</option>
                        <option value="id_descending">ID (Newest First)</option>
                        <option value="property_ascending">Property (A-Z)</option>
                        <option value="property_descending">Property (Z-A)</option>
                        <option value="price_ascending">Total Price (Low to High)</option>
                        <option value="price_descending">Total Price (High to Low)</option>
                    </select>
                </div>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <TableCell>ID</TableCell>
                        <TableCell>Property</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Area (sqm)</TableCell>
                        <TableCell>Price (per sqm)</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Actions</TableCell>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredProperties.length === 0 ? (
                            <tr>
                                <TableCell colSpan={8}>No properties found.</TableCell>
                            </tr>
                        ) : filteredProperties.map(p => (
                            <tr key={String(p.id)}>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.owner}</TableCell>
                                <TableCell>{p.status}</TableCell>
                                <TableCell>{p.areaInSqm}</TableCell>
                                <TableCell>{p.pricePerSqm}</TableCell>
                                <TableCell>{p.totalPrice}</TableCell>
                                <TableCell>
                                    <div className="ui-button-row">
                                        <button className="btn-sm btn-ghost" onClick={() => handleView(p.id)}>View</button>
                                        <button className="btn-sm btn-ghost" onClick={() => handleEdit(p.id)}>Edit</button>
                                        <button className="btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                                    </div>
                                </TableCell>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </li>
    )
}