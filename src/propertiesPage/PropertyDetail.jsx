import { useContext, useMemo } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

function getPropertyLabel(property) {
    return `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;
}

export default function PropertyDetail({ propertyId: propPropertyId }) {
    const { data, currentPage, setCurrentPage } = useContext(AppContext);

    const propertyId = Number(propPropertyId ?? currentPage?.params?.propertyId);
    const property = data.properties[propertyId];

    const owner = useMemo(() => {
        return Object.values(data.clients).find(client => client.propertyIds.includes(propertyId)) || null;
    }, [data.clients, propertyId]);

    const payments = useMemo(() => {
        if (!property) return [];

        const uniquePaymentIds = Array.from(new Set(property.account.paymentIds || []));

        return uniquePaymentIds
            .map(id => data.payments[id])
            .filter(Boolean)
            .map(payment => ({
                id: payment.id,
                date: payment.paymentDate,
                amount: payment.amount
            }))
            .sort((a, b) => b.date - a.date);
    }, [property, data.payments]);

    if (!property) {
        return (
            <>
                <ContentHeader>
                    <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>Property Detail</span>
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

    return (
        <>
            <ContentHeader>
                <div style={{ display: "flex", padding: "1rem", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Property Detail</span>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                        <button onClick={() => setCurrentPage({ name: "editProperty", params: { propertyId } })} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>
                            Edit
                        </button>
                        <button onClick={() => setCurrentPage({ name: "properties", params: {} })} style={{ padding: "0.5rem 0.9rem" }}>
                            Back
                        </button>
                    </div>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>{getPropertyLabel(property)}</h3>

                    <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.8rem" }}>
                        <div><strong>Property ID:</strong> {property.id}</div>
                        <div><strong>Owner:</strong> {owner ? owner.fullName : "Unassigned"}</div>
                        <div><strong>Area:</strong> {property.area}</div>
                        <div><strong>Block Number:</strong> {property.blockNumber}</div>
                        <div><strong>Lot Number:</strong> {property.lotNumber}</div>
                        <div><strong>Area in sqm:</strong> {property.areaInSqm}</div>
                        <div><strong>Price per sqm:</strong> {property.pricePerSqm}</div>
                        <div><strong>Total Price:</strong> {totalPrice}</div>
                        <div><strong>Account Status:</strong> {property.account.status}</div>
                        <div><strong>Term Duration (months):</strong> {property.account.termDuration}</div>
                    </div>

                    <h4 style={{ marginTop: "1rem" }}>Payments</h4>
                    {payments.length === 0 ? (
                        <p>No payments recorded for this property.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ backgroundColor: "var(--primary-background)", fontWeight: "bold" }}>
                                <tr>
                                    <td style={{ padding: "0.5rem" }}>Payment ID</td>
                                    <td style={{ padding: "0.5rem" }}>Date</td>
                                    <td style={{ padding: "0.5rem" }}>Amount</td>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={String(payment.id)} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "0.5rem" }}>{payment.id}</td>
                                        <td style={{ padding: "0.5rem" }}>{new Date(payment.date).toLocaleString()}</td>
                                        <td style={{ padding: "0.5rem" }}>{payment.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </ContentMain>
        </>
    );
}
