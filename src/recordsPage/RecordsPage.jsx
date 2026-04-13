import { useContext, useMemo } from "react";
import { AppContext } from "../App";
import RecordList from "./PaymentRecordList";
import ContentMain from "../components/ContentMain";
import ContentHeader from "../components/ContentHeader";
import Card from "../components/Card";

export default function RecordsPage() {
    const { data, setCurrentPage } = useContext(AppContext);

    const loading = false;

    const getPropertyName = (property) => `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;

    const payments = useMemo(() => {
        const out = Object.values(data.properties).flatMap(property => {
            const owner = Object.values(data.clients).find(client => client.propertyIds.includes(property.id));
            const uniquePaymentIds = Array.from(new Set(property.account?.paymentIds || []));

            return uniquePaymentIds
                .map(i => data.payments[i])
                .filter(Boolean)
                .map(payment => {
                    const paymentClient = data.clients[payment.clientId] || owner;

                    return {
                        id: payment.id,
                        clientName: paymentClient ? paymentClient.fullName : "Unassigned",
                        date: payment.paymentDate,
                        propertyName: getPropertyName(property),
                        amount: payment.amount,
                        clientId: paymentClient ? paymentClient.id : null,
                        propertyLotId: property.id
                    }
                });
        });

        out.sort((a, b) => new Date(b.date) - new Date(a.date));

        return out;
    }, [data]);

    // Intentionally no-op for now; detail implementation is handled by a separate teammate.
    const handleView = () => {};

    const handleCreate = () => {
        setCurrentPage({ name: 'createPayment', params: {} });
    };

    const handleEdit = () => {
        // implement editing
    };

    const handleDelete = (paymentId) => {
        if (!window.confirm(`Delete payment ${paymentId}?`)) {
            return;
        }

        data.deletePayment(paymentId);
    };

    return (
        <>
            <ContentHeader>
                <div style={{display: "flex", padding: "1rem", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <span style={{fontSize: "20px", fontWeight: "bold"}}> Payments </span>
                    <button onClick={handleCreate} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>New Payment</button>
                </div>
            </ContentHeader>

            <ContentMain>
                {/* <div style={{ padding: "1rem" }}> */}
                <Card>
                    <RecordList
                        records={payments}
                        recordType="payments"
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Card>
                {/* </div> */}
            </ContentMain>
        </>
    );
}