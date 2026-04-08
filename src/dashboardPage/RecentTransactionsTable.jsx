import { useCallback, useContext } from "react";
import styles from "./RecentTransactionsTable.module.css";
import { AppContext } from "../App";

export function RecentTransactionsTable() {

    // useContext(AppContext) is a way to store variables globally
    // Get `data` from it
    const { data } = useContext(AppContext);
    // Then you can use it
    // console.log(Object.values(data.clients))

    const getPropertyName = (property) => `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;

    const getRecentPayments = () => {
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
                        <tr>
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