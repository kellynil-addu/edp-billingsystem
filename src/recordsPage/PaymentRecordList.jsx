import React from "react";

// Reusable RecordList component
// Props:
// - records: array of record objects
// - recordType: string label for the kind of records (optional)
// - loading: boolean
// - onView(id): callback when View is clicked
// - onEdit(id): callback when Edit is clicked
export default function RecordList({ records = [], recordType = "records", loading = false, onView, onEdit }) {
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
        window.location.href = `/view/${recordType}/${id}`;
    };

    const handleEdit = (id) => {
        if (typeof onEdit === "function") return onEdit(id);
        // Default behavior: route to /edit/[type]/[id]
        window.location.href = `/edit/${recordType}/${id}`;
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

    // Special table layout for payments
    if (recordType === "payments") {
        return (
            <div style={containerStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold" }}>{recordType.charAt(0).toUpperCase() + recordType.slice(1)}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{loading ? "Loading..." : `${records.length} items`}</div>
                </div>

                {loading ? (
                    <div style={{ padding: "1rem", color: "#666" }}>Loading {recordType}…</div>
                ) : records.length === 0 ? (
                    <div style={{ padding: "1rem", color: "#666" }}>No {recordType} found.</div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
                        <thead style={{ backgroundColor: "var(--primary-background)", fontWeight: "bold" }}>
                            <tr>
                                <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Client</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Property</th>
                                <th style={{ textAlign: "right", padding: "8px" }}>Amount</th>
                                <th style={{ textAlign: "center", padding: "8px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, idx) => {
                                const id = rec.id ?? idx;
                                return (
                                    <tr key={String(id)} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "8px" }}>{rec.id}</td>
                                        <td style={{ padding: "8px" }}>{rec.clientName}</td>
                                        <td style={{ padding: "8px" }}>{rec.date ? new Date(rec.date).toLocaleString() : ""}</td>
                                        <td style={{ padding: "8px" }}>{rec.propertyName}</td>
                                        <td style={{ padding: "8px", textAlign: "right" }}>{rec.amount}</td>
                                        <td style={{ padding: "8px", textAlign: "center" }}>
                                            <button onClick={() => handleView(id)} aria-label={`View ${id}`} style={{ padding: "6px 10px" }}>View</button>
                                            {onEdit && <button onClick={() => handleEdit(id)} aria-label={`Edit ${id}`} style={{ padding: "6px 10px", marginLeft: 8 }}>Edit</button>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    // fallback list/card layout
    return (
        <div style={containerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{recordType.charAt(0).toUpperCase() + recordType.slice(1)}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{loading ? "Loading..." : `${records.length} items`}</div>
            </div>

            {loading ? (
                <div style={{ padding: "1rem", color: "#666" }}>Loading {recordType}…</div>
            ) : records.length === 0 ? (
                <div style={{ padding: "1rem", color: "#666" }}>No {recordType} found.</div>
            ) : (
                records.map((rec, idx) => {
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
                                <button onClick={() => handleView(id)} aria-label={`View ${id}`} style={{ padding: "6px 10px" }}>View</button>
                                {onEdit && <button onClick={() => handleEdit(id)} aria-label={`Edit ${id}`} style={{ padding: "6px 10px" }}>Edit</button>}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
