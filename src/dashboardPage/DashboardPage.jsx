import { useContext } from "react";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";
import {RecentTransactionsList} from "./RecentTransactionsList";
import { AppContext } from "../App";

export default function DashboardPage() {
    return (
        <>
        <ContentHeader>
            <div style={{display: "flex", padding: "1rem", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}> Dashboard </span>
            </div>
        </ContentHeader>
        <ContentMain>
            <div style={{width: "100%", height: "100%", display: "grid", gap: "12px", gridTemplateColumns: "24rem auto", gridTemplateRows: "auto auto"}}>
                <Monitor style={{gridRow: "1", gridColumn: "1", }}/>
                {/* <Card style={{gridRow: "2", gridColumn: "1"}}> Graph here </Card> */}
                <Card style={{gridRow: "1/3", gridColumn: "2"}}>
                    <h3>Recent payments</h3>

                    <RecentTransactionsList/>
                </Card>
            </div>
        </ContentMain>
        </>
    )
}

function Monitor({style}) {
    const { data } = useContext(AppContext);

    const payments = Object.values(data?.payments || {});
    const clients = data?.clients || {};
    const properties = data?.properties || {};

    // Helper: sum payments amounts safely
    const sumAmounts = (ids = []) => (ids || []).reduce((s, id) => s + Number((data?.payments?.[id]?.amount) || 0), 0);

    // Top client by total paid across all payments
    const clientTotals = {};
    payments.forEach(p => {
        const cid = p.clientId;
        if (cid === undefined || cid === null) return;
        clientTotals[cid] = (clientTotals[cid] || 0) + Number(p.amount || 0);
    });
    const topClientId = Object.keys(clientTotals).sort((a, b) => (clientTotals[b] || 0) - (clientTotals[a] || 0))[0];
    const topClient = topClientId ? clients[topClientId] : null;
    const topClientTotal = topClient ? clientTotals[topClient.id] || 0 : 0;

    // Top property by total paid (based on property.account.paymentIds)
    const propertyTotals = Object.values(properties || {}).map(prop => {
        const paymentIds = (prop.account?.paymentIds || []).map(Number);
        const total = sumAmounts(paymentIds);
        return { prop, total };
    });
    propertyTotals.sort((a, b) => b.total - a.total);
    const topPropertyEntry = propertyTotals[0] || null;
    const topProperty = topPropertyEntry ? topPropertyEntry.prop : null;
    const topPropertyTotal = topPropertyEntry ? topPropertyEntry.total : 0;

    // compute property display name helper
    const getPropertyName = (property) => {
        if (!property) return "—";
        return `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;
    };

    // compute property total price (account totalPrice or area * pricePerSqm)
    const getPropertyTotalPrice = (property) => {
        if (!property) return 0;
        const accountTotal = Number(property?.account?.totalPrice);
        if (!Number.isNaN(accountTotal) && accountTotal > 0) return accountTotal;
        const computed = Number(property?.areaInSqm || 0) * Number(property?.pricePerSqm || 0);
        return Number.isNaN(computed) ? 0 : computed;
    };
    const topPropertyTotalPrice = topProperty ? getPropertyTotalPrice(topProperty) : 0;
    const topPropertyRemaining = Math.max(topPropertyTotalPrice - topPropertyTotal, 0);

    // Top (largest) single payment
    const topPayment = payments.slice().sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0] || null;

    const styles = {
        width: "100%",
        height: "100%",
        display: "grid",
        gap: "12px",
        // three stacked cards (same column width as before)
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr 1fr 1fr",
        ...style
    }

    return (
        <div style={styles}>
            <Card style={{backgroundColor: "#BAE8F7"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    <div style={{fontSize: "14px", fontWeight: "600"}}>Top Client</div>
                    <div style={{fontSize: "18px", fontWeight: "700"}}>{topClient ? topClient.fullName : "No clients yet"}</div>
                    <div style={{color: "var(--muted)"}}>Total paid: ₱{(topClientTotal || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            </Card>

            <Card style={{backgroundColor: "#C4D7FC"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    <div style={{fontSize: "14px", fontWeight: "600"}}>Top Property</div>
                    <div style={{fontSize: "18px", fontWeight: "700"}}>{topProperty ? getPropertyName(topProperty) : "No properties yet"}</div>
                    <div style={{color: "var(--muted)"}}>Paid: ₱{(topPropertyTotal || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} • Remaining: ₱{(topPropertyRemaining || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            </Card>

            <Card style={{backgroundColor: "#BAE8F7"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    <div style={{fontSize: "14px", fontWeight: "600"}}>Largest Payment</div>
                    <div style={{fontSize: "18px", fontWeight: "700"}}>₱{topPayment ? Number(topPayment.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "—"}</div>
                    <div style={{color: "var(--muted)"}}>
                        {topPayment ? `${(clients[topPayment.clientId]?.fullName || "Unknown client")} • ${new Date(topPayment.paymentDate).toLocaleDateString()}` : "No payments yet"}
                    </div>
                </div>
            </Card>
        </div>
    )
}