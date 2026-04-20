import { AppContext } from "../App";

export default function Content({children}) {
    const divStyle = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: "100%",
        overflow: "none",
        backgroundColor: "var(--primary-background)",        
    };

    return (
        <div style={divStyle}>
            {children}
        </div>
    )
}