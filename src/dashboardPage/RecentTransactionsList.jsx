import { useContext } from "react";
import styles from "./RecentTransactionsList.module.css";
import { AppContext } from "../App";

export function RecentTransactionsList() {

    // useContext(AppContext) is a way to store variables globally
    // Get `data` from it
    const { data } = useContext(AppContext);
    // Then you can use it
    // console.log(Object.values(data.clients))

    const getPropertyName = (property) => `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;

    const getRecentPayments = () => {
            const out = Object.values(data.properties).flatMap(property => {
                const owner = Object.values(data.clients).find(client => client.propertyIds.includes(property.id));
                const uniquePaymentIds = Array.from(new Set(property.account?.paymentIds || []));

                return uniquePaymentIds
                    .map(i => data.payments[i])
                    .filter(Boolean)
                    .map(payment => {
                        const paymentClient = data.clients[payment.clientId] || owner;

                        return {
                            paymentId: payment.id,
                            clientName: paymentClient ? paymentClient.fullName : "Unassigned",
                            date: payment.paymentDate,
                            propertyName: getPropertyName(property),
                            amount: payment.amount,
                            clientId: paymentClient ? paymentClient.id : null,
                            propertyLotId: property.id
                        }
                    });
            });

            out.sort((a, b) => b.date - a.date);
    
            return out;
    };

    const recentPayments = getRecentPayments();

    return (
        <table className={styles["recentTransactionsTable"]}>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Client</td>
                    <td>Date</td>
                    <td>Property</td>
                    <td>Amount</td>
                </tr>
            </thead>
            <tbody>
                {
                    recentPayments.map(pym => (
                        <tr key={String(pym.paymentId)}>
                            <td>{pym.paymentId}</td>
                            <td>{pym.clientName}</td>
                            <td>{new Date(pym.date).toLocaleString()}</td>
                            <td>{pym.propertyName}</td>
                            <td>{pym.amount}</td>
                        </tr>
                    ))
                }

            </tbody>
        </table>
    )
}