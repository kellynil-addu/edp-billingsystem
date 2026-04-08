import { useState, useCallback, useEffect } from 'react';
import { saveToStorage } from './data';

/**
 * @param {import('./data').RootData} data
 */

export function useAppData(data) {
    const [clients, setClients] = useState(data?.clients || {});
    const [properties, setProperties] = useState(data?.properties || {});
    const [payments, setPayments] = useState(data?.payments || {});
    
    const [lastClientId, setLastClientId] = useState(data?.lastClientId || 0);
    const [lastPropertyId, setLastPropertyId] = useState(data?.lastPropertyId || 0);
    const [lastPaymentId, setLastPaymentId] = useState(data?.lastPaymentId || 0);

    useEffect(() => {
        saveToStorage({clients, properties, payments});
    }, [clients, properties, payments]);

    /**
     * @type {(arg0: import('./data').ClientData)}
     */
    const createClient = useCallback((clientData) => {
        setLastClientId(prev => {
            const newId = prev + 1;
            setClients(prevClients => ({
                ...prevClients,
                [newId]: {
                    ...clientData,
                    id: newId,
                    propertyIds: [],
                    fullName: clientData.fullName || "No name",
                    address: clientData.address || "No address"
                }
            }));
            return newId;
        });
    }, []);

    /**
     * @type {(arg0: import('./data').PropertyData)}
     */
    const createProperty = useCallback((propertyData) => {
        setLastPropertyId(prev => {
            const newId = prev + 1;
            setProperties(prevProperties => ({
                ...prevProperties,
                [newId]: {
                    ...propertyData,
                    id: newId,
                    account: {
                        termDuration: 24,
                        status: "active",
                        totalPrice: propertyData.total || 0,
                        termStart: new Date().setHours(0,0,0,0),
                        downPayment: 0,
                        monthlyPayment: 0,
                        ...propertyData.account,
                        paymentIds: []
                    }
                }
            }));
            return newId;
        });
    }, []);

    /**
     * @type {(arg0: number, arg1: import('./data').PaymentData)}
     */
    const createPaymentForProperty = useCallback((propertyId, { amount, paymentDate }) => {
        setLastPaymentId(prev => {
            const newId = prev + 1;
            
            // Add to payments object, then link it to property
            setPayments(prevPayments => ({
                ...prevPayments,
                [newId]: { id: newId, amount, paymentDate}
            }));

            setProperties(prevProperties => {
                const property = prevProperties[propertyId];
                if (!property) return prevProperties;

                return {
                    ...prevProperties,
                    [propertyId]: {
                        ...property,
                        account: {
                            ...property.account,
                            paymentIds: [...property.account.paymentIds, newId]
                        }
                    }
                };
            });
            return newId;
        });
    }, []);

    /**
     * @type {(arg0: number, arg1: number)}
     */
    const linkPropertyToClient = useCallback((clientId, propertyId) => {
        setClients(prevClients => {
            const client = prevClients[clientId];
            if (!client || !properties[propertyId]) return prevClients;

            return {
                ...prevClients,
                [clientId]: {
                    ...client,
                    propertyIds: [...client.propertyIds, propertyId]
                }
            };
        });
    }, [properties]); 

    /**
     * @type {(arg0: import('./data').ClientData)}
     */
    const editClient = useCallback(({id, fullName, address}) => {
        setClients(prev => {
            const client = prev[id];
            if (!client) return prev;

            return {
                ...prev,
                [id]: {
                    ...client,
                    ...(fullName !== undefined && { fullName }),
                    ...(address !== undefined && { address })
                }
            };
        });
    }, []);

    /**
     * @type {(arg0: import('./data').PropertyData)}
     */
    const editProperty = useCallback((fields) => {
        setProperties(prev => {
            const property = prev[fields.id];
            if (!property) return prev;

            const { account, ...rest } = fields;
            return {
                ...prev,
                [fields.id]: {
                    ...property,
                    ...rest,
                    account: account ? { ...property.account, ...account } : property.account
                }
            };
        });
    }, []);

    /**
     * @type {(arg0: import('./data').PaymentData)}
     */
    const editPayment = useCallback(({id, amount, paymentDate}) => {
        setPayments(prev => {
            const payment = prev[id];
            if (!payment) return prev;

            return {
                ...prev,
                [id]: {
                    ...payment,
                    ...(amount !== undefined && { amount }),
                    ...(paymentDate !== undefined && { paymentDate: paymentDate.getTime() })
                }
            };
        });
    }, []);

    /**
     * @type {(arg0: number, arg1: number)}
     */
    const deletePayment = useCallback((paymentId) => {

        // Remove from payments, then unlink from its property
        setPayments(prev => {
            const { [paymentId]: removed, ...rest } = prev;
            return rest;
        });

        setProperties(prev => {
            const propertyId = Object.values(properties).find(p => p.account.paymentIds.includes(paymentId)).id;
            const property = prev[propertyId];
            if (!property) return prev;

            return {
                ...prev,
                [propertyId]: {
                    ...property,
                    account: {
                        ...property.account,
                        paymentIds: property.account.paymentIds.filter(id => id !== paymentId)
                    }
                }
            };
        });
    }, []);

    /**
     * @type {(arg0: number)}
     */
    const deleteProperty = useCallback((propertyId) => {
        // We need the current state to know what payments to delete
        // In a real app, it's often safer to use a reducer for cascading deletes,
        // but we can do it here by accessing the current state variables.
        
        const property = properties[propertyId];
        if (!property) return;

        setPayments(prev => {
            const newPayments = { ...prev };
            property.account.paymentIds.forEach(id => delete newPayments[id]);
            return newPayments;
        });

        setClients(prev => {
            const newClients = {};
            for (const [id, client] of Object.entries(prev)) {
                newClients[id] = {
                    ...client,
                    propertyIds: client.propertyIds.filter(pid => pid !== propertyId)
                };
            }
            return newClients;
        });

        setProperties(prev => {
            const { [propertyId]: removed, ...rest } = prev;
            return rest;
        });
    }, [properties]);

    /**
     * @type {(arg0: number)}
     */
    const deleteClient = useCallback((clientId) => {
        const client = clients[clientId];
        if (!client) return;

        // 1. Trigger property deletions (which trigger payment deletions)
        // client.propertyIds.forEach(propertyId => deleteProperty(propertyId));

        // 2. Delete the client
        setClients(prev => {
            const { [clientId]: removed, ...rest } = prev;
            return rest;
        });
    }, [clients, deleteProperty]);

    return {
        // State
        clients, properties, payments,
        // Methods
        createClient, createProperty, createPaymentForProperty, linkPropertyToClient,
        editClient, editProperty, editPayment,
        deleteClient, deleteProperty, deletePayment,
    };
}