import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../App";
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
        </>
    );
}