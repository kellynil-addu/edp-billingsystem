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
                <div className="ui-page-header">
                    <span className="ui-page-title">Clients</span>
                    <button className="btn-primary btn-page-action" onClick={handleCreateClient}>New Client</button>
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
