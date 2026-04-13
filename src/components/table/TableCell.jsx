export default function TableCell({ children, ...props }) {
    return (
        <td className="m-0 p-2" {...props}>
            {children}
        </td>
    )
}