import React from "react";

// Reusable RecordList component
// Props:
// - records: array of record objects
// - recordType: string label for the kind of records (optional)
// - loading: boolean
// - onView(id): callback when View is clicked
// - onEdit(id): callback when Edit is clicked
// - onDelete(id): callback when Delete is clicked
export default function RecordList({ records = [], recordType = "records", loading = false, onView, onEdit, onDelete }) {
    const containerStyle = {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        padding: "12px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    };

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: "#FAFAFA",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)"
    };

    const infoStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: 0
    };

    const actionsStyle = {
        display: "flex",
        gap: "8px"
    };

    const titleStyle = { fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
    const subStyle = { fontSize: "12px", color: "#555" };

    const handleView = (id) => {
        if (typeof onView === "function") return onView(id);
        // Default behavior: route to /view/[type]/[id]
        window.location.assign(`/view/${recordType}/${id}`);
    };

    const handleEdit = (id) => {
        if (typeof onEdit === "function") return onEdit(id);
        // Default behavior: route to /edit/[type]/[id]
        window.location.assign(`/edit/${recordType}/${id}`);
    };

    const handleDelete = (id) => {
        if (typeof onDelete === "function") return onDelete(id);
    };

    // Helper to pick the primary label for a record
    const primaryLabel = (rec) => {
        return rec.name || rec.title || rec.id || "(no id)";
    };

    // Helper to collect a few additional fields to show
    const additionalFields = (rec) => {
        const excluded = new Set(["id", "name", "title"]);
        const keys = Object.keys(rec).filter(k => !excluded.has(k));
        // Pick the first 3 additional fields for brevity
        return keys.slice(0, 3).map(k => ({ key: k, value: rec[k] }));
    };

    const [filteredPayments, setFilteredPayments] = React.useState(records);

    const handleSort = (criteria) => {
        console.log("Sort by:", criteria);
        
        const sortedRecords = [...records];
        
        switch (criteria) {
            case "id_ascending":
                sortedRecords.sort((a, b) => a.id - b.id);
                break;
            case "id_descending":
                sortedRecords.sort((a, b) => b.id - a.id);
                break;
            case "client_ascending":
                sortedRecords.sort((a, b) => a.clientName.localeCompare(b.clientName));
                break;
            case "client_descending":
                sortedRecords.sort((a, b) => b.clientName.localeCompare(a.clientName));
                break;
            case "date_ascending":
                sortedRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "date_descending":
                sortedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "property_ascending":
                sortedRecords.sort((a, b) => a.propertyName.localeCompare(b.propertyName));
                break;
            case "property_descending":
                sortedRecords.sort((a, b) => b.propertyName.localeCompare(a.propertyName));
                break;
            case "amount_ascending":
                sortedRecords.sort((a, b) => a.amount - b.amount);
                break;
            case "amount_descending":
                sortedRecords.sort((a, b) => b.amount - a.amount);
                break;
            default:
                break;
        }

        const table = document.querySelector(".data-table tbody");
        const rows = table.getElementsByTagName("tr");
        const rowMap = {};
        for (let i = 0; i < rows.length; i++) {
            const recordId = rows[i].getElementsByTagName("td")[0].textContent;
            rowMap[recordId] = rows[i];
        }
        
        sortedRecords.forEach((rec, idx) => {
            const id = rec.id ?? idx;
            const row = rowMap[id];
            if (row) {
                table.appendChild(row);
            }
        });
        console.log("Sorted records:", sortedRecords);

    }

    const handleSearch = () => {
        var query = document.getElementById("search-payments").value.toLowerCase();
        console.log("Search query:", query);
        
        var filteredPayments = Array.from(records);

        while(query.includes("#")) {
            var category = query.slice(query.indexOf("#") + 1,query.indexOf(":") > -1 ? query.indexOf(":") : undefined);

            if(category.includes("id")) {
                var id = query.slice(query.indexOf("#id:")+4,query.indexOf(" ", query.indexOf("#id:")) > -1 ? query.indexOf(" ", query.indexOf("#id:")) : undefined).toLowerCase();
                console.log("Filtering by ID:", id);

                filteredPayments = filteredPayments.filter(payment => {
                    return payment.id==id;
                });
            }

            if(category.includes("date")){
                var date = query.slice(query.indexOf("#date:")+6,query.indexOf(" ", query.indexOf("#date:")) > -1 ? query.indexOf(" ", query.indexOf("#date:")) : undefined).toLowerCase();
                console.log("Filtering by Date:", date);

                //MM-DD-YYYY to YYYY-MM-DD

                var formattedDate;
                if(date.includes("/")) {
                    const parts = date.split("/");

                    if(parts[0].length<2){
                        parts[0] = "0"+parts[0];
                    }

                    if(parts[1].length<2){
                        parts[1] = "0"+parts[1];
                    }

                    console.log("HELP"+parts[0], parts[1], parts[2]);

                    formattedDate = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
                }
                
                console.log(formattedDate);

                filteredPayments = filteredPayments.filter(payment => {
                    const paymentDate = new Date(payment.date);
                    return paymentDate.toDateString() === formattedDate.toDateString();
                });
            }

            if(category.includes("amount")) {
                var amount = query.slice(query.indexOf("#amount:")+8,query.indexOf(" ", query.indexOf("#amount:")) > -1 ? query.indexOf(" ", query.indexOf("#amount:")) : undefined).toLowerCase();
                console.log("Filtering by Amount:", amount);

                filteredPayments = filteredPayments.filter(payment => {
                    return payment.amount==amount;
                });
            }

            if(category.includes("property")){
                var property = query.slice(query.indexOf("#property:")+10,query.indexOf(" ", query.indexOf("#property:")) > -1 ? query.indexOf(" ", query.indexOf("#property:")) : undefined).toLowerCase();
                if(property.includes("_")) {
                    property = property.replaceAll("_", " ");
                }
                
                console.log("Filtering by Property:", property);

                filteredPayments = filteredPayments.filter(payment => {
                    return payment.propertyName.toLowerCase().includes(property);
                });
            }

            query = query.substring(0, query.indexOf("#")) + query.substring(query.indexOf(" ") > -1 ? query.indexOf(" ") + 1 : query.length);
            console.log("search query after tag processing:", query);
        }

        filteredPayments = filteredPayments.filter(payment => {
            return payment.clientName.toLowerCase().includes(query)
        })

        setFilteredPayments(filteredPayments);
    }

    // Special table layout for payments
    if (recordType === "payments") {
        return (
            <li>
                <div class="upper-lip">
                    <div class="search">
                        <input type="text" onKeyUp={handleSearch} id="search-payments" placeholder="Search payments...       use #(category_name): to search for specific category"></input>
                    </div>
                    <div>
                    <select name="sort" id="sort" onChange={(e) => handleSort(e.target.value)}>
                        <option value="id_ascending">ID (Oldest First)</option>
                        <option value="id_descending">ID (Newest First)</option>
                        <option value="client_ascending">Client Name (A-Z)</option>
                        <option value="client_descending">Client Name (Z-A)</option>
                        <option value="date_ascending">Date (Oldest First)</option>
                        <option value="date_descending">Date (Newest First)</option>
                        <option value="property_ascending">Property Name (A-Z)</option>
                        <option value="property_descending">Property Name (Z-A)</option>
                        <option value="amount_ascending">Amount (Low to High)</option>
                        <option value="amount_descending">Amount (High to Low)</option>
                    </select>
                </div>
                </div>
                <div style={containerStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "16px", fontWeight: "bold" }}>{recordType.charAt(0).toUpperCase() + recordType.slice(1)}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>{loading ? "Loading..." : `${filteredPayments.length} items`}</div>
                    </div>

                    {loading ? (
                        <div style={{ padding: "1rem", color: "#666" }}>Loading {recordType}…</div>
                    ) : filteredPayments.length === 0 ? (
                        <div style={{ padding: "1rem", color: "#666" }}>No {recordType} found.</div>
                    ) : (
                        <table className="data-table" style={{ marginTop: "8px" }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Property</th>
                                    <th style={{ textAlign: "right" }}>Amount</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((rec, idx) => {
                                    const id = rec.id ?? idx;
                                    return (
                                        <tr key={String(id)}>
                                            <td>{rec.id}</td>
                                            <td>{rec.clientName}</td>
                                            <td>{rec.date ? new Date(rec.date).toLocaleString() : ""}</td>
                                            <td>{rec.propertyName}</td>
                                            <td style={{ textAlign: "right" }}>{rec.amount}</td>
                                            <td>
                                                <div className="ui-button-row" style={{ justifyContent: "center" }}>
                                                    <button className="btn-sm btn-ghost" onClick={() => handleView(id)} aria-label={`View ${id}`}>View</button>
                                                    {onEdit && <button className="btn-sm btn-ghost" onClick={() => handleEdit(id)} aria-label={`Edit ${id}`}>Edit</button>}
                                                    {onDelete && <button className="btn-sm btn-danger" onClick={() => handleDelete(id)} aria-label={`Delete ${id}`}>Delete</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </li>
        );
    }

    // fallback list/card layout
    return (
        <div style={containerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{recordType.charAt(0).toUpperCase() + recordType.slice(1)}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{loading ? "Loading..." : `${filteredPayments.length} items`}</div>
            </div>

            {loading ? (
                <div style={{ padding: "1rem", color: "#666" }}>Loading {recordType}…</div>
            ) : filteredPayments.length === 0 ? (
                <div style={{ padding: "1rem", color: "#666" }}>No {recordType} found.</div>
            ) : (
                filteredPayments.map((rec, idx) => {
                    const id = rec.id ?? idx;
                    return (
                        <div key={String(id)} style={rowStyle}>
                            <div style={infoStyle}>
                                <div style={titleStyle}>{primaryLabel(rec)}</div>
                                <div style={subStyle}>
                                    {additionalFields(rec).map(f => (
                                        <span key={f.key} style={{ marginRight: "8px" }}>
                                            <strong>{f.key}:</strong> {String(f.value)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={actionsStyle}>
                                <button className="btn-sm btn-ghost" onClick={() => handleView(id)} aria-label={`View ${id}`}>View</button>
                                {onEdit && <button className="btn-sm btn-ghost" onClick={() => handleEdit(id)} aria-label={`Edit ${id}`}>Edit</button>}
                                {onDelete && <button className="btn-sm btn-danger" onClick={() => handleDelete(id)} aria-label={`Delete ${id}`}>Delete</button>}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
