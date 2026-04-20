import { FaHome, FaUsers, FaBuilding, FaMoneyBill, FaInfoCircle } from "react-icons/fa";
import { useContext } from "react";
import styles from "./Sidebar.module.css";
import { AppContext } from "../App";

export default function Sidebar() {
    const { setCurrentPage } = useContext(AppContext);

    return (
        <>
            <div className={styles["sidebar"]}>
                <div className={styles["sidebarPanel"]}>
                    <span style={{ fontSize: "24px", color: "var(--accent)", fontWeight: "bold" }}> App Name Here </span>
                    <SidebarTab onClick={() => setCurrentPage({ name: 'dashboard' })} icon={FaHome}> Dashboard </SidebarTab>

<SidebarTab onClick={() => setCurrentPage({ name: 'clients' })} icon={FaUsers}> Clients </SidebarTab>

<SidebarTab onClick={() => setCurrentPage({ name: 'properties' })} icon={FaBuilding}> Properties </SidebarTab>

<SidebarTab onClick={() => setCurrentPage({ name: 'payments' })} icon={FaMoneyBill}> Payments </SidebarTab>

<SidebarTab onClick={() => setCurrentPage({ name: 'about' })} icon={FaInfoCircle}> About </SidebarTab>
                    
                </div>
            </div>
        </>
    );
}

function TemporaryIconPlaceholder() {
    return (
        <div style={{ display: "inline", minHeight: "48px", minWidth: "48px", backgroundColor: "green" }}>
            icon
        </div>
    )
}

function SidebarTab({ onClick, icon, children }) {
    const IconComponent = icon;

    return (
        <div className={styles["sidebarTab"]} onClick={onClick}>
            {IconComponent ? <IconComponent /> : null}
            {children}
        </div>
    )
}
