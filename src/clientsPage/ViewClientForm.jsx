import { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

export default function ViewClientForm({ clientId: propClientId }) {
    const { data, currentPage, setCurrentPage } = useContext(AppContext);

    const clientId = Number(propClientId ?? currentPage?.params?.clientId);
    const propertyId = currentPage?.params?.propertyId;
    const client = data.clients[clientId];

    if (!client) {
        return (
            <>
                <ContentHeader>
                    <div className="ui-page-header">
                        <span className="ui-page-title">View Client</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Client not found</h3>
                        <button className="btn-primary" onClick={() => setCurrentPage({ name: "clients", params: {} })}>
                            Back to Clients
                        </button>
                    </Card>
                </ContentMain>
            </>
        );
    }

    return (
        <>
            <ContentHeader>
                <div className="ui-page-header">
                    <span className="ui-page-title">View Client</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Client Details</h3>

                    <div className="ui-detail-grid" style={{ maxWidth: "640px" }}>
                        <div className="ui-field">
                            <span>Full Name</span>
                            <span>{client.fullName}</span>
                        </div>

                        <div className="ui-field">
                            <span>Address</span>
                            <span>{client.address}</span>
                        </div>

                        <div className="ui-field">
                            <span>Properties Owned</span>
                            <span>{client.propertyIds?.length || 0}</span>
                        </div>
                    </div>

                    {client.propertyIds?.length > 0 && (
                        <div style={{ marginTop: "1.5rem" }}>
                            <h4 style={{ fontWeight: "bold", marginBottom: "0.75rem" }}>Owned Properties</h4>
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                {client.propertyIds.map(propertyId => {
                                    const property = data.properties[propertyId];
                                    if (!property) return null;

                                    const totalPaid = property.account?.paymentIds?.reduce((sum, paymentId) => {
                                        const payment = data.payments[paymentId];
                                        return sum + (payment?.amount || 0);
                                    }, 0) || 0;

                                    const totalPrice = property.areaInSqm * property.pricePerSqm;
                                    const remainingBalance = totalPrice - totalPaid;

                                    return (
                                        <div key={propertyId} className="ui-panel">
                                            <button
                                                className="btn-link"
                                                onClick={() => setCurrentPage({ name: "viewProperty", params: { propertyId, clientId } })}
                                            >
                                                {property.area} - Block {property.blockNumber} Lot {property.lotNumber}

                                            </button>
                                            <div style={{ display: "grid", gap: "0.25rem", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                                                <div><strong>Area (sqm):</strong> {property.areaInSqm}</div>
                                                <div><strong>Price per sqm:</strong> {property.pricePerSqm}</div>
                                                <div><strong>Total Price:</strong> {totalPrice}</div>
                                                <div><strong>Status:</strong> {property.account?.status || 'available'}</div>
                                                <div><strong>Total Paid:</strong> {totalPaid}</div>
                                                <div><strong>Remaining Balance:</strong> {remainingBalance}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="ui-form-actions" style={{ marginTop: "1.5rem" }}>
                        <button className="btn-ghost" onClick={() => propertyId ? setCurrentPage({ name: "viewProperty", params: { propertyId } }) : setCurrentPage({ name: "clients", params: {} })}>
                            {propertyId ? "Back to Property Details" : "Back to Clients"}
                        </button>
                    </div>
                </Card>
            </ContentMain>
        </>
    );
}