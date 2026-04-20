export default function TableCell({ children, ...props }) {
    return (
        <td {...props}>
            {children}
        </td>
    )
}