import { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

function getPropertyName(property) {
  return `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;
}

export default function PaymentDetail({ paymentId: propPaymentId }) {
  const { data, currentPage, setCurrentPage } = useContext(AppContext);

  // Determine paymentId: either from props or from currentPage params
  const paymentId = propPaymentId ?? currentPage?.params?.paymentId;

  // Flatten payments to search
  let found = null;
  for (const property of Object.values(data.properties || {})) {
    const owner = Object.values(data.clients || {}).find(client => client.propertyIds.includes(property.id));
    const uniquePaymentIds = Array.from(new Set(property.account?.paymentIds || []));

    for (const payment of uniquePaymentIds.map(id => data.payments[id]).filter(Boolean)) {
      if (String(payment.id) === String(paymentId)) {
        const paymentClient = data.clients[payment.clientId] || owner;

        found = {
          id: payment.id,
          clientName: paymentClient ? paymentClient.fullName : "Unassigned",
          date: payment.paymentDate,
          propertyName: getPropertyName(property),
          amount: payment.amount,
          clientId: paymentClient ? paymentClient.id : null,
          lotId: property.id,
          raw: payment,
        };
        break;
      }
    }

    if (found) {
      break;
    }
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
      <>
        <ContentHeader>
          <div className="ui-page-header">
            <span className="ui-page-title">Payment Detail</span>
          </div>
        </ContentHeader>

        <ContentMain>
          <Card>
            <h3>Payment not found</h3>
            <button className="btn-ghost" onClick={() => setCurrentPage({ name: "payments" })}>Back to Payments</button>
          </Card>
        </ContentMain>
      </>
    );
  }

  return (
    <>
      <ContentHeader>
        <div className="ui-page-header">
          <span className="ui-page-title">Payment {found.id}</span>
          <button className="btn-ghost" onClick={() => setCurrentPage({ name: "payments" })}>Back</button>
        </div>
      </ContentHeader>

      <ContentMain>
        <Card>
          <div className="ui-detail-grid">
            <div><strong>Client:</strong> {found.clientName}</div>
            <div><strong>Date:</strong> {found.date ? new Date(found.date).toLocaleString() : ""}</div>
            <div><strong>Property:</strong> {found.propertyName}</div>
            <div><strong>Amount:</strong> {found.amount}</div>
            <div><strong>Client ID:</strong> {found.clientId}</div>
            <div><strong>Lot ID:</strong> {found.lotId}</div>

            <div style={{ marginTop: 12 }}>
              <h4>Raw payment data</h4>
              <pre className="ui-panel" style={{ whiteSpace: "pre-wrap", padding: 8 }}>
                {JSON.stringify(found.raw, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      </ContentMain>
    </>
  );
}