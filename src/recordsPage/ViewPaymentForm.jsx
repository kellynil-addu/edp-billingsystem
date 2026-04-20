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
                    <div className="ui-page-header">
                        <span className="ui-page-title">View Payment</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Payment not found</h3>
                        <button className="btn-primary" onClick={() => setCurrentPage({ name: "payments", params: {} })}>
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
                <div className="ui-page-header">
                    <span className="ui-page-title">View Payment</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Payment Details</h3>

                    <div className="ui-detail-grid">
                        <div className="ui-field">
                            <span>Payment ID</span>
                            <span>{payment.id}</span>
                        </div>

                        <div className="ui-field">
                            <span>Client</span>
                            <span>{client ? client.fullName : "Unknown"}</span>
                        </div>

                        <div className="ui-field">
                            <span>Property</span>
                            <span>{property ? getPropertyName(property) : "Unknown"}</span>
                        </div>

                        <div style={{ marginTop: "0.75rem" }}>
                            <span style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Payment Details</span>
                            <table className="data-table" style={{ fontSize: "0.9rem" }}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{paymentDate.toLocaleDateString()}</td>
                                        <td>{paymentDate.toLocaleTimeString()}</td>
                                        <td>{payment.amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="ui-form-actions" style={{ marginTop: "1.5rem" }}>
                        <button className="btn-ghost" onClick={() => setCurrentPage({ name: "payments", params: {} })}>
                            Back to Payments
                        </button>
                    </div>
                </Card>
            </ContentMain>
        </>
    );
}
