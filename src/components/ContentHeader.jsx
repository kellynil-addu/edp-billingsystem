export default function ContentHeader({children}) {
    const style = {
        display: "flex",
        flex: "4rem 0 0", 
        backgroundColor: "var(--primary-background)",
        boxShadow: "0px 0px 5px rgb(0,0,0,0.2)",
        zIndex: "5"
    };

    return (
        <div style={style}>
            {children}
        </div>
    )
}