import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../App";
import RecordList from "../components/RecordList";

export default function RecordsPage() {
    const { dataState, setCurrentPage } = useContext(AppContext);
    const [data] = dataState;

    const [loading] = useState(false);

    // Derive payments from data
    const payments = useMemo(() => {
        const out = [];

        // Flatten all payments from clients
        for (const [clientId, client] of Object.entries(data || {})) {
            for (const [propertyLotId, propertyLot] of Object.entries(client.propertyLots || {})) {
                const paymentsObj = propertyLot.account?.payments || {};
                for (const [paymentId, payment] of Object.entries(paymentsObj)) {
                    out.push({
                        id: paymentId,
                        clientName: client.fullName,
                        date: payment.paymentDate,
                        propertyName: propertyLot.location || `Lot ${propertyLotId}`,
                        amount: payment.amount,
                        clientId,
                        propertyLotId
                    });
                }
            }
        }

        // Inject sample payments if none exist
        if (out.length === 0) {
            out.push(
                {
                    id: "demo1",
                    clientName: "John Doe",
                    date: new Date().toISOString(),
                    propertyName: "Lot 101",
                    amount: 5000,
                    clientId: "client1",
                    propertyLotId: "lot101"
                },
                {
                    id: "demo2",
                    clientName: "Jane Smith",
                    date: new Date().toISOString(),
                    propertyName: "Lot 102",
                    amount: 7500,
                    clientId: "client2",
                    propertyLotId: "lot102"
                }
            );
        }

        // Sort by date descending
        out.sort((a, b) => new Date(b.date) - new Date(a.date));

        return out;
    }, [data]);

    // Updated handleView: navigate to PaymentDetail page
    const handleView = (id) => {
        setCurrentPage({ name: 'paymentDetail', params: { paymentId: id } });
    };

    const handleEdit = (id) => {
        // implement editing
    };

    return (
        <>
            <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>Payments</div>
            </div>

            <div style={{ padding: "1rem" }}>
                <RecordList
                    records={payments}
                    recordType="payments"
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit} 
                />
            </div>
        </>
    );
}