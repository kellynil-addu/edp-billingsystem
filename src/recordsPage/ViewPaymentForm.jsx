import { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

export default function ViewPaymentForm({ paymentId: propPaymentId }) {
    const { data, currentPage, setCurrentPage } = useContext(AppContext);

    const paymentId = Number(propPaymentId ?? currentPage?.params?.paymentId);
    const payment = data.payments[paymentId];

    if (!payment) {
        return (
            <>
                <ContentHeader>
                    <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>View Payment</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Payment not found</h3>
                        <button onClick={() => setCurrentPage({ name: "payments", params: {} })} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>
                            Back to Payments
                        </button>
                    </Card>
                </ContentMain>
            </>
        );
    }

    // Find the property and client related to this payment
    const property = Object.values(data.properties).find(prop =>
        Array.from(new Set(prop.account?.paymentIds || [])).includes(paymentId)
    );
    const clientId = Number(payment.clientId);
    let client = null;
    
    // Try to find client by clientId
    if (!Number.isNaN(clientId)) {
        client = data.clients[clientId];
    }
    
    // Fallback: find client from property owner
    if (!client && property) {
        client = Object.values(data.clients).find(c => c.propertyIds?.includes(property.id));
    }
    
    const paymentDate = new Date(payment.paymentDate);

    const getPropertyName = (prop) => `${prop.area} - Blk. ${prop.blockNumber} Lot ${prop.lotNumber}`;

    return (
        <>
            <ContentHeader>
                <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>View Payment</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Payment Details</h3>

                    <div style={{ display: "grid", gap: "0.85rem", maxWidth: "700px", marginTop: "0.75rem" }}>
                        <div style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Payment ID</span>
                            <span>{payment.id}</span>
                        </div>

                        <div style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Client</span>
                            <span>{client ? client.fullName : "Unknown"}</span>
                        </div>

                        <div style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Property</span>
                            <span>{property ? getPropertyName(property) : "Unknown"}</span>
                        </div>

                        <div style={{ marginTop: "0.75rem" }}>
                            <span style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Payment Details</span>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "1px solid #ddd" }}>
                                        <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: "bold" }}>Date</th>
                                        <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: "bold" }}>Time</th>
                                        <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: "bold" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                        <td style={{ padding: "0.5rem" }}>{paymentDate.toLocaleDateString()}</td>
                                        <td style={{ padding: "0.5rem" }}>{paymentDate.toLocaleTimeString()}</td>
                                        <td style={{ padding: "0.5rem" }}>{payment.amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem" }}>
                        <button onClick={() => setCurrentPage({ name: "payments", params: {} })} style={{ padding: "0.55rem 0.9rem", fontWeight: "bold" }}>
                            Back to Payments
                        </button>
                    </div>
                </Card>
            </ContentMain>
        </>
    );
}
