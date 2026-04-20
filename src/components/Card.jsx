export default function Card({ children, style, className = "" }) {
    return (
        <div className={`app-card ${className}`.trim()} style={style}>
            {children}
        </div>
    )
}