import { createContext, useEffect, useState } from 'react'
import './index.css'
import Content from './layout/Content'
import Sidebar from './layout/Sidebar'
import DashboardPage from './dashboardPage/DashboardPage';
import RecordsPage from './recordsPage/RecordsPage';
import PaymentDetail from './recordsPage/PaymentDetail';
import { loadData, saveToStorage } from './data';

// "Global" values like current page, data, should be stored here
export const AppContext = createContext({
    data: loadData(),
    CurrentPage: null,
});

export default function App() {
    const [data, setData] = useState(loadData());

    // currentPage is an object: { name: string, params: object }
    const [currentPage, setCurrentPage] = useState({ name: 'dashboard', params: {} });

    // Persist data to storage whenever it changes
    useEffect(() => {
        saveToStorage(data);
    }, [data]);

    const pageToRender = () => {
        switch (currentPage.name) {
            case 'dashboard':
                return <DashboardPage />;
            case 'clients':
                return <ClientsPage state={dataState} />;
            case 'payments':
                return <RecordsPage />;
            case 'paymentDetail':
                return <PaymentDetail paymentId={currentPage.params.paymentId} />;
            default:
                return <DashboardPage />;
        }
    };

    return (
            <AppContext.Provider value={{dataState, currentPage, setCurrentPage}}>
                <div style={{display: "flex", alignItems: "stretch", height: "100vh", width: "100vw", maxHeight: "100vh"}}>
                        <Sidebar/>
                        <Content>
                            {pageToRender()}
                        </Content>
                </div>
            </AppContext.Provider>
    )
}
