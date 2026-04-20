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
            <div className="ui-page-header">
                <span className="ui-page-title">Properties</span>
                <button className="btn-primary btn-page-action" onClick={handleCreateProperty}>New Property</button>
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