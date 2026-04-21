import { FaHome, FaUsers, FaBuilding, FaMoneyBill, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import styles from "./Sidebar.module.css";
import { AppContext } from "../App";

export default function Sidebar() {
    const { session, setCurrentPage } = useContext(AppContext);

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarPanel}>
                    <img className={styles.logo} src="/logo.png" alt="Billing system logo" />

                    <SidebarTab activeKey="dashboard" onClick={() => setCurrentPage({ name: "dashboard" })} icon={FaHome}>Dashboard</SidebarTab>
                    <SidebarTab activeKey="client" onClick={() => setCurrentPage({ name: "clients" })} icon={FaUsers}>Clients</SidebarTab>
                    <SidebarTab activeKey="propert" onClick={() => setCurrentPage({ name: "properties" })} icon={FaBuilding}>Properties</SidebarTab>
                    <SidebarTab activeKey="payment" onClick={() => setCurrentPage({ name: "payments" })} icon={FaMoneyBill}>Payments</SidebarTab>
                    {/* <SidebarTab activeKey="about" onClick={() => setCurrentPage({ name: "about" })} icon={FaInfoCircle}>About</SidebarTab> */}
                </div>

                <div className={styles.bottomPanel}>
                    <span className={styles.userMeta}>Hello, {session.current.username} ({session.current.email})</span>
                    <button className={`btn-ghost ${styles.logoutButton}`} onClick={() => session.signOut()}>
                        <FaSignOutAlt />
                        Log out
                    </button>
                </div>
            </aside>
        </>
    );
}

function SidebarTab({ onClick, icon, children, activeKey }) {
    const IconComponent = icon;

    const { currentPage } = useContext(AppContext);

    const isActive = currentPage.name.toLowerCase().includes(activeKey);

    return (
        <button
            type="button"
            className={`${styles.sidebarTab} ${isActive ? styles.sidebarTabActive : ""}`}
            onClick={onClick}
        >
            {IconComponent ? <IconComponent className={styles.sidebarIcon} /> : null}
            <span className={styles.sidebarLabel}>{children}</span>
        </button>
    )
}
