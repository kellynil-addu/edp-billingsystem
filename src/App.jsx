import { createContext, useEffect, useState } from 'react'
import './index.css'
import Content from './layout/Content'
import Sidebar from './layout/Sidebar'
import DashboardPage from './dashboardPage/DashboardPage';
import RecordsPage from './recordsPage/RecordsPage';
import PaymentDetail from './recordsPage/PaymentDetail';
import { loadData, saveToStorage } from './data';
import PropertiesPage from './propertiesPage/PropertiesPage';
import { useAppData } from './useAppData';

/**
 * @typedef {Object} AppContextValue
 * @property {ReturnType<typeof useAppData>} data
 * @property {(arg0: string) => void} setCurrentPage 
 */

/**
 * @type {React.Context<AppContextValue>}
 */
export const AppContext = createContext(
    /** @type {AppContextValue} */ ({})
);

export default function App() {
    const data = useAppData(loadData());

    const [currentPage, setCurrentPage] = useState({ name: 'dashboard', params: {} });

    const pageToRender = () => {
        switch (currentPage.name) {
            case 'dashboard':
                return <DashboardPage />;
            case 'properties':
                return <PropertiesPage />;
            case 'payments':
                return <RecordsPage />;
            case 'paymentDetail':
                return <PaymentDetail paymentId={currentPage.params.paymentId} />;
            default:
                return <DashboardPage />;
        }
    };

    return (
            <AppContext.Provider value={{data, setCurrentPage}}>
                <div style={{display: "flex", alignItems: "stretch", height: "100vh", width: "100vw", maxHeight: "100vh"}}>
                        <Sidebar/>
                        <Content>
                            {pageToRender()}
                        </Content>
                </div>
            </AppContext.Provider>
    )
}
