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
        window.location.assign(`/view/${recordType}/${id}`);
    };

    const handleEdit = (id) => {
        if (typeof onEdit === "function") return onEdit(id);
        // Default behavior: route to /edit/[type]/[id]
        window.location.assign(`/edit/${recordType}/${id}`);
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
                            {records.map((rec, idx) => {
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
                                            </div>
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
                                <button className="btn-sm btn-ghost" onClick={() => handleView(id)} aria-label={`View ${id}`}>View</button>
                                {onEdit && <button className="btn-sm btn-ghost" onClick={() => handleEdit(id)} aria-label={`Edit ${id}`}>Edit</button>}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
