import React, { useContext } from "react";
import { AppContext } from "../App";

export default function PaymentDetail({ paymentId: propPaymentId }) {
  const { dataState, currentPage, setCurrentPage } = useContext(AppContext);
  const [data] = dataState;

  // Determine paymentId: either from props or from currentPage params
  const paymentId = propPaymentId ?? currentPage?.params?.paymentId;

  // Flatten payments to search
  let found = null;
  for (const [clientId, client] of Object.entries(data || {})) {
    for (const [lotId, lot] of Object.entries(client.propertyLots || {})) {
      const payments = lot.account?.payments || {};
      for (const [pid, payment] of Object.entries(payments)) {
        if (String(pid) === String(paymentId)) {
          found = {
            id: pid,
            clientName: client.fullName,
            date: payment.paymentDate,
            propertyName: lot.location || `Lot ${lotId}`,
            amount: payment.amount,
            clientId,
            lotId,
            raw: payment,
          };
          break;
        }
      }
      if (found) break;
    }
    if (found) break;
  }

  // If not found in real data, check for demo payments
  if (!found) {
    const demoPayments = [
      {
        id: "demo1",
        clientName: "John Doe",
        date: new Date().toISOString(),
        propertyName: "Lot 101",
        amount: 5000,
        clientId: "client1",
        lotId: "lot101",
        raw: { note: "Demo payment 1" },
      },
      {
        id: "demo2",
        clientName: "Jane Smith",
        date: new Date().toISOString(),
        propertyName: "Lot 102",
        amount: 7500,
        clientId: "client2",
        lotId: "lot102",
        raw: { note: "Demo payment 2" },
      },
    ];

    found = demoPayments.find(p => String(p.id) === String(paymentId)) ?? null;
  }

  if (!found) {
    return (
      <div style={{ padding: "1rem" }}>
        <h3>Payment not found</h3>
        <button onClick={() => setCurrentPage({ name: "payments" })}>Back to Payments</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Payment {found.id}</h2>
        <button onClick={() => setCurrentPage({ name: "payments" })}>Back</button>
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <div><strong>Client:</strong> {found.clientName}</div>
        <div><strong>Date:</strong> {found.date ? new Date(found.date).toLocaleString() : ""}</div>
        <div><strong>Property:</strong> {found.propertyName}</div>
        <div><strong>Amount:</strong> {found.amount}</div>
        <div><strong>Client ID:</strong> {found.clientId}</div>
        <div><strong>Lot ID:</strong> {found.lotId}</div>

        <div style={{ marginTop: 12 }}>
          <h4>Raw payment data</h4>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 8 }}>
            {JSON.stringify(found.raw, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}