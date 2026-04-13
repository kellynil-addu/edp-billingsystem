import { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";
import { PropertiesRecordList } from "./PropertiesRecordList";

export default function PropertiesPage() {
    const { setCurrentPage } = useContext(AppContext);

    const handleCreateProperty = () => {
        setCurrentPage({ name: "createProperty", params: {} });
    };

    return (
        <>
        <ContentHeader>
            <div style={{display: "flex", padding: "1rem", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}> Properties </span>
                <button onClick={handleCreateProperty} style={{ padding: "0.5rem 0.9rem", fontWeight: "bold" }}>New Property</button>
            </div>
        </ContentHeader>
        <ContentMain>
            {/* <div style={{width: "48rem", backgroundColor: "white", borderRadius: "1rem", padding: "1rem"}}> */}
            <Card>
                <h3>Properties</h3>
                <PropertiesRecordList/>
            </Card>
            {/* </div> */}
        </ContentMain>
        </>
    )
}