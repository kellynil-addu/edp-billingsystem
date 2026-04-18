export default function Card({children, style}) {
    const styles = {
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        padding: "12px",
        boxSizing: "border-box",
        minHeight: "100%",
        width: "100%",
        ...style
    }
    
    return (
        <div style={styles}>
            {children}
        </div>
    )
}