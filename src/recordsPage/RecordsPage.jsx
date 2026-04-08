import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../App";
<<<<<<< HEAD
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
=======
import RecordList from "./PaymentRecordList";
import ContentMain from "../components/ContentMain";
import ContentHeader from "../components/ContentHeader";
import Card from "../components/Card";

export default function RecordsPage() {
    const { data, setCurrentPage } = useContext(AppContext);

    const [loading] = useState(false);

    const getPropertyName = (property) => `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;

    const payments = useMemo(() => {
        const out = Object.values(data.clients).flatMap(client => {
            return client.propertyIds.map(i => data.properties[i]).flatMap(property => {
                return property.account.paymentIds.map(i => data.payments[i]).flatMap(payment => {
                    return {
                        paymentId: payment.id,
                        clientName: client.fullName,
                        date: payment.paymentDate,
                        propertyName: getPropertyName(property),
                        amount: payment.amount,
                        clientId: client.id,
                        propertyLotId: property.id
                    }
                })
            });
        })

>>>>>>> e9cf87a (Record List View)
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
<<<<<<< HEAD
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
=======
            <ContentHeader>
                <div style={{display: "flex", padding: "1rem", alignItems: "center"}}>
                    <span style={{fontSize: "20px", fontWeight: "bold"}}> Dashboard </span>
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
                    />
                </Card>
                {/* </div> */}
            </ContentMain>
>>>>>>> e9cf87a (Record List View)
        </>
    );
}