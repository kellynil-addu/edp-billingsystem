import { useContext } from "react";
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
                    <div className="ui-page-header">
                        <span className="ui-page-title">View Property</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Property not found</h3>
                        <button className="btn-primary" onClick={() => setCurrentPage({ name: "properties", params: {} })}>
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
    
    const ownerEntry = Object.entries(data.clients).find((entry) => entry[1].propertyIds?.includes(propertyId));
    const owner = ownerEntry ? ownerEntry[1] : null;
    const ownerId = ownerEntry ? Number(ownerEntry[0]) : null;

    return (
        <>
            <ContentHeader>
                <div className="ui-page-header">
                    <span className="ui-page-title">View Property</span>
                    <div className="ui-button-row">
                        <button className="btn-primary" onClick={() => setCurrentPage({ name: "editProperty", params: { propertyId } })}>
                            Edit
                        </button>
                        <button className="btn-ghost" onClick={() => setCurrentPage(clientId ? { name: "viewClient", params: { clientId } } : { name: "properties", params: {} })}>
                            {clientId ? "Back to Client's Details" : "Back to Properties"}
                        </button>
                    </div>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Property Details</h3>

                    <div className="ui-detail-grid">
                        <div className="ui-field">
                            <span>Area</span>
                            <span>{property.area}</span>
                        </div>

                        <div className="ui-two-col">
                            <div className="ui-field">
                                <span>Block Number</span>
                                <span>{property.blockNumber}</span>
                            </div>

                            <div className="ui-field">
                                <span>Lot Number</span>
                                <span>{property.lotNumber}</span>
                            </div>
                        </div>

                        <div className="ui-two-col">
                            <div className="ui-field">
                                <span>Area in sqm</span>
                                <span>{property.areaInSqm}</span>
                            </div>

                            <div className="ui-field">
                                <span>Price per sqm</span>
                                <span>{property.pricePerSqm}</span>
                            </div>
                        </div>

                        <div className="ui-two-col">
                            <div className="ui-field">
                                <span>Total Price</span>
                                <span>{totalPrice}</span>
                            </div>

                            <div className="ui-field">
                                <span>Status</span>
                                <span>{property.account?.status || 'available'}</span>
                            </div>
                        </div>

                        <div className="ui-field">
                            <span>Owner</span>
                            <a 
                                className="btn-link"
                                onClick={() => ownerId && setCurrentPage({ name: "viewClient", params: { clientId: ownerId, propertyId } })}
                            >
                                {owner ? owner.fullName : 'Unassigned'}
                            </a>
                        </div>

                        <div className="ui-two-col">
                            <div className="ui-field">
                                <span>Total Paid</span>
                                <span>{totalPaid}</span>
                            </div>

                            <div className="ui-field">
                                <span>Remaining Balance</span>
                                <span>{remainingBalance}</span>
                            </div>
                        </div>
                    </div>

                    {uniquePaymentIds.length > 0 && (
                        <div style={{ marginTop: "1.5rem" }}>
                            <h4 style={{ fontWeight: "bold", marginBottom: "0.75rem" }}>Payment History</h4>
                            <table className="data-table" style={{ fontSize: "0.9rem" }}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uniquePaymentIds.map(paymentId => {
                                        const payment = data.payments[paymentId];
                                        if (!payment) return null;

                                        const paymentDate = new Date(payment.paymentDate);
                                        const time = paymentDate.toLocaleTimeString();
                                        return (
                                            <tr key={paymentId}>
                                                <td>{paymentDate.toLocaleDateString()}</td>
                                                <td>{time}</td>
                                                <td>{payment.amount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="ui-form-actions" style={{ marginTop: "1.5rem" }}>
                        <button className="btn-ghost" onClick={() => setCurrentPage({ name: "properties", params: {} })}>
                            Back to Properties
                        </button>
                    </div>
                </Card>
            </ContentMain>
        </>
    );
    }