import { createContext, useState } from 'react'
import './index.css'
import Content from './layout/Content'
import Sidebar from './layout/Sidebar'
import DashboardPage from './dashboardPage/DashboardPage';
import RecordsPage from './recordsPage/RecordsPage';
import PaymentDetail from './recordsPage/PaymentDetail';
import { loadData } from './data';
import PropertiesPage from './propertiesPage/PropertiesPage';
import { useAppData } from './useAppData';
import CreatePaymentForm from './recordsPage/CreatePaymentForm';
import CreatePropertyForm from './propertiesPage/CreatePropertyForm';
import EditPropertyForm from './propertiesPage/EditPropertyForm';
import ClientsPage from './clientsPage/ClientsPage';
import CreateClientForm from './clientsPage/CreateClientForm';
import EditClientForm from './clientsPage/EditClientForm';
import ViewClientForm from './clientsPage/ViewClientForm';
import ViewPropertyForm from './propertiesPage/ViewPropertyForm';
import ViewPaymentForm from './recordsPage/ViewPaymentForm';

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
            case 'clients':
                return <ClientsPage />;
            case 'properties':
                return <PropertiesPage />;
            case 'payments':
                return <RecordsPage />;
            case 'paymentDetail':
                return <PaymentDetail paymentId={currentPage.params.paymentId} />;
            case 'viewPayment':
                return <ViewPaymentForm paymentId={currentPage.params.paymentId} />;
            case 'createClient':
                return <CreateClientForm />;
            case 'viewClient':    
                return <ViewClientForm clientId={currentPage.params.clientId} />;
            case 'editClient':
                return <EditClientForm clientId={currentPage.params.clientId} />;
            case 'createPayment':
                return <CreatePaymentForm />;
            case 'viewProperty':
                return <ViewPropertyForm propertyId={currentPage.params.propertyId} />;
            case 'createProperty':
                return <CreatePropertyForm />;
            case 'editProperty':
                return <EditPropertyForm propertyId={currentPage.params.propertyId} />;
            default:
                return <DashboardPage />;
        }
    };

    return (
            <AppContext.Provider value={{data, currentPage, setCurrentPage}}>
                <div style={{display: "flex", alignItems: "stretch", height: "100vh", width: "100vw", maxHeight: "100vh"}}>
                        <Sidebar/>
                        <Content>
                            {pageToRender()}
                        </Content>
                </div>
            </AppContext.Provider>
    )
}
