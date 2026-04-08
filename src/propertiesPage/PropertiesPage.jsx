import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";
import { PropertiesRecordList } from "./PropertiesRecordList";

export default function PropertiesPage() {
    return (
        <>
        <ContentHeader>
            <div style={{display: "flex", padding: "1rem", alignItems: "center"}}>
                <span style={{fontSize: "20px", fontWeight: "bold"}}> Properties </span>
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