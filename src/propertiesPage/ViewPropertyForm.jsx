import { useContext, useState } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

export default function ViewPropertyForm({ propertyId: propPropertyId }) {
    const { data, currentPage, setCurrentPage } = useContext(AppContext);

    const propertyId = Number(propPropertyId ?? currentPage?.params?.propertyId);
    const clientId = currentPage?.params?.clientId;
    const property = data.properties[propertyId];

    if (!property) {
        return (
            <>
                <ContentHeader>
                    <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>View Property</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Property not found</h3>
                        <button onClick={() => setCurrentPage({ name: "properties", params: {} })} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>
                            Back to Properties
                        </button>
                    </Card>
                </ContentMain>
            </>
        );
    }

    const totalPrice = property.areaInSqm * property.pricePerSqm;
    const uniquePaymentIds = Array.from(new Set(property.account?.paymentIds || []));
    const totalPaid = uniquePaymentIds.reduce((sum, id) => sum + (data.payments[id]?.amount || 0), 0);
    const remainingBalance = totalPrice - totalPaid;
    
    const ownerEntry = Object.entries(data.clients).find(([_, client]) => client.propertyIds?.includes(propertyId));
    const owner = ownerEntry ? ownerEntry[1] : null;
    const ownerId = ownerEntry ? Number(ownerEntry[0]) : null;

    return (
        <>
            <ContentHeader>
                <div style={{ display: "flex", padding: "1rem", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>View Property</span>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                        <button onClick={() => setCurrentPage({ name: "editProperty", params: { propertyId } })} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>
                            Edit
                        </button>
                        <button onClick={() => setCurrentPage(clientId ? { name: "viewClient", params: { clientId } } : { name: "properties", params: {} })} style={{ padding: "0.5rem 0.9rem" }}>
                            {clientId ? "Back to Client's Details" : "Back to Properties"}
                        </button>
                    </div>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Property Details</h3>

                    <div style={{ display: "grid", gap: "0.85rem", maxWidth: "700px", marginTop: "0.75rem" }}>
                        <div style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Area</span>
                            <span>{property.area}</span>
                        </div>

                        <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "1fr 1fr" }}>
                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Block Number</span>
                                <span>{property.blockNumber}</span>
                            </div>

                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Lot Number</span>
                                <span>{property.lotNumber}</span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "1fr 1fr" }}>
                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Area in sqm</span>
                                <span>{property.areaInSqm}</span>
                            </div>

                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Price per sqm</span>
                                <span>{property.pricePerSqm}</span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "1fr 1fr" }}>
                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Total Price</span>
                                <span>{totalPrice}</span>
                            </div>

                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Status</span>
                                <span>{property.account?.status || 'available'}</span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Owner</span>
                            <button 
                                onClick={() => ownerId && setCurrentPage({ name: "viewClient", params: { clientId: ownerId, propertyId } })}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#0066cc", textAlign: "left", padding: 0, fontWeight: owner ? "bold" : "normal" }}
                            >
                                {owner ? owner.fullName : 'Unassigned'}
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "1fr 1fr" }}>
                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Total Paid</span>
                                <span>{totalPaid}</span>
                            </div>

                            <div style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Remaining Balance</span>
                                <span>{remainingBalance}</span>
                            </div>
                        </div>
                    </div>

                    {uniquePaymentIds.length > 0 && (
                        <div style={{ marginTop: "1.5rem" }}>
                            <h4 style={{ fontWeight: "bold", marginBottom: "0.75rem" }}>Payment History</h4>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "1px solid #ddd" }}>
                                        <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: "bold" }}>Date</th>
                                        <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: "bold" }}>Time</th>
                                        <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: "bold" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uniquePaymentIds.map(paymentId => {
                                        const payment = data.payments[paymentId];
                                        if (!payment) return null;

                                        const paymentDate = new Date(payment.paymentDate);
                                        const time = paymentDate.toLocaleTimeString();
                                        return (
                                            <tr key={paymentId} style={{ borderBottom: "1px solid #ddd" }}>
                                                <td style={{ padding: "0.5rem" }}>{paymentDate.toLocaleDateString()}</td>
                                                <td style={{ padding: "0.5rem" }}>{time}</td>
                                                <td style={{ padding: "0.5rem" }}>{payment.amount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem" }}>
                        <button onClick={() => setCurrentPage({ name: "properties", params: {} })} style={{ padding: "0.55rem 0.9rem", fontWeight: "bold" }}>
                            Back to Properties
                        </button>
                    </div>
                </Card>
            </ContentMain>
        </>
    );
    }