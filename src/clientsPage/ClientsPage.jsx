import { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";
import ClientsRecordList from "./ClientsRecordList";

export default function ClientsPage() {
    const { setCurrentPage } = useContext(AppContext);

    const handleCreateClient = () => {
        setCurrentPage({ name: "createClient", params: {} });
    };

    return (
        <>
            <ContentHeader>
                <div style={{ display: "flex", padding: "1rem", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Clients</span>
                    <button onClick={handleCreateClient} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>New Client</button>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Clients</h3>
                    <ClientsRecordList />
                </Card>
            </ContentMain>
        </>
    );
}
