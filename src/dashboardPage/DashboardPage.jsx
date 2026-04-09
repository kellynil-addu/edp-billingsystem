import { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";
import {RecentTransactionsList} from "./RecentTransactionsList";

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
                <Card style={{gridRow: "2", gridColumn: "1"}}> Graph here </Card>
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

    const styles = {
        width: "100%", 
        height: "100%", 
        display: "grid", 
        gap: "12px",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        ...style
    }

    return (
        <div style={styles}>
            <Card style={{backgroundColor: "#BAE8F7"}}>a</Card>
            <Card style={{backgroundColor: "#C4D7FC"}}>b</Card>
            <Card style={{backgroundColor: "#C4D7FC"}}>c</Card>
            <Card style={{backgroundColor: "#BAE8F7"}}>d</Card>
        </div>
    )
}