import { useCallback, useEffect, useState } from 'react';
import { saveToStorage } from './data';

function getUniqueIds(ids = []) {
    return Array.from(new Set((ids || []).map(Number).filter(id => !Number.isNaN(id))));
}

function getPropertyTotalPrice(property) {
    const accountTotal = Number(property?.account?.totalPrice);
    if (!Number.isNaN(accountTotal) && accountTotal > 0) {
        return accountTotal;
    }

    const computed = Number(property?.areaInSqm || 0) * Number(property?.pricePerSqm || 0);
    return Number.isNaN(computed) ? 0 : computed;
}

function getTotalPaid(paymentIds, payments) {
    return getUniqueIds(paymentIds).reduce((sum, id) => sum + Number(payments[id]?.amount || 0), 0);
}

function getLastPaymentClientId(paymentIds, payments) {
    const clientIds = getUniqueIds(paymentIds)
        .map(id => payments[id]?.clientId)
        .filter(id => id !== undefined && id !== null)
        .map(Number)
        .filter(id => !Number.isNaN(id));

    return clientIds.length > 0 ? clientIds[clientIds.length - 1] : null;
}

function getNextAvailableId(records) {
    const usedIds = new Set(
        Object.keys(records || {})
            .map(Number)
            .filter(id => !Number.isNaN(id) && id > 0)
    );

    let candidate = 1;
    while (usedIds.has(candidate)) {
        candidate += 1;
    }

    return candidate;
}

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
        saveToStorage({
            clients,
            properties,
            payments,
            lastClientId,
            lastPropertyId,
            lastPaymentId
        });
    }, [clients, properties, payments, lastClientId, lastPropertyId, lastPaymentId]);

    /**
     * @type {(arg0: import('./data').ClientData) => number}
     */
    const createClient = useCallback((clientData) => {
        const newId = getNextAvailableId(clients);

        setLastClientId(prev => Math.max(prev, newId));
        setClients(prevClients => ({
            ...prevClients,
            [newId]: {
                id: newId,
                propertyIds: [],
                fullName: clientData.fullName || 'No name',
                address: clientData.address || 'No address'
            }
        }));

        return newId;
    }, [clients]);

    /**
     * @type {(arg0: import('./data').PropertyData) => number}
     */
    const createProperty = useCallback((propertyData) => {
        const newId = getNextAvailableId(properties);
        const providedTotal = Number(propertyData.account?.totalPrice ?? propertyData.total);
        const calculatedTotal = Number(propertyData.areaInSqm || 0) * Number(propertyData.pricePerSqm || 0);
        const totalPrice = !Number.isNaN(providedTotal) && providedTotal > 0 ? providedTotal : calculatedTotal;

        setLastPropertyId(prev => Math.max(prev, newId));
        setProperties(prevProperties => ({
            ...prevProperties,
            [newId]: {
                ...propertyData,
                id: newId,
                account: {
                    ...propertyData.account,
                    status: 'available',
                    totalPrice,
                    termStart: propertyData.account?.termStart ?? new Date().setHours(0, 0, 0, 0),
                    termDuration: propertyData.account?.termDuration ?? 24,
                    downPayment: propertyData.account?.downPayment ?? 0,
                    monthlyPayment: propertyData.account?.monthlyPayment ?? 0,
                    activeClientId: null,
                    paymentIds: getUniqueIds(propertyData.account?.paymentIds)
                }
            }
        }));

        return newId;
    }, [properties]);

    /**
     * @type {(arg0: { propertyId: number, clientId: number, amount: number, paymentDate: number, paymentType: 'partial' | 'full' }) => {ok: boolean, error?: string, paymentId?: number, amount?: number}}
     */
    const createPaymentForProperty = useCallback(({ propertyId, clientId, amount, paymentDate, paymentType }) => {
        const numericPropertyId = Number(propertyId);
        const numericClientId = Number(clientId);
        const property = properties[numericPropertyId];

        if (!property) {
            return { ok: false, error: 'Property not found.' };
        }

        if (!clients[numericClientId]) {
            return { ok: false, error: 'Please select a valid client.' };
        }

        const existingPaymentIds = getUniqueIds(property.account?.paymentIds);
        const totalPrice = getPropertyTotalPrice(property);
        const totalPaid = getTotalPaid(existingPaymentIds, payments);
        const remainingBalance = Math.max(totalPrice - totalPaid, 0);

        if (remainingBalance <= 0 || property.account?.status === 'sold') {
            return { ok: false, error: 'This property is already fully paid.' };
        }

        const lockedClientId = property.account?.activeClientId;
        const hasLockedClient = lockedClientId !== null && lockedClientId !== undefined;
        const payableClientId = hasLockedClient ? Number(lockedClientId) : numericClientId;

        if (hasLockedClient && payableClientId !== numericClientId) {
            return { ok: false, error: 'This property already has an installment buyer. Use that client for succeeding payments.' };
        }

        const normalizedType = paymentType === 'full' ? 'full' : 'partial';
        let amountToPay = 0;

        if (normalizedType === 'full') {
            amountToPay = remainingBalance;
        } else {
            const numericAmount = Number(amount);

            if (Number.isNaN(numericAmount) || numericAmount <= 0) {
                return { ok: false, error: 'Amount must be greater than 0.' };
            }

            if (numericAmount > remainingBalance) {
                return { ok: false, error: 'Payment exceeds remaining balance.' };
            }

            amountToPay = numericAmount;
        }

        const paymentTimestamp = Number(paymentDate);
        if (Number.isNaN(paymentTimestamp)) {
            return { ok: false, error: 'Invalid payment date.' };
        }

        const newPaymentId = getNextAvailableId(payments);
        const nextTotalPaid = totalPaid + amountToPay;
        const isFullyPaid = nextTotalPaid >= totalPrice;
        const nextStatus = isFullyPaid ? 'sold' : 'in-payment';

        setLastPaymentId(prev => Math.max(prev, newPaymentId));
        setPayments(prevPayments => ({
            ...prevPayments,
            [newPaymentId]: {
                id: newPaymentId,
                amount: amountToPay,
                paymentDate: paymentTimestamp,
                clientId: payableClientId
            }
        }));

        setProperties(prevProperties => {
            const currentProperty = prevProperties[numericPropertyId];
            if (!currentProperty) return prevProperties;

            const dedupedIds = getUniqueIds(currentProperty.account?.paymentIds);
            const nextPaymentIds = dedupedIds.includes(newPaymentId) ? dedupedIds : [...dedupedIds, newPaymentId];

            return {
                ...prevProperties,
                [numericPropertyId]: {
                    ...currentProperty,
                    account: {
                        ...currentProperty.account,
                        status: nextStatus,
                        activeClientId: isFullyPaid ? null : payableClientId,
                        paymentIds: nextPaymentIds
                    }
                }
            };
        });

        setClients(prevClients => {
            const nextClients = {};

            for (const [id, client] of Object.entries(prevClients)) {
                const numericId = Number(id);
                const filteredPropertyIds = getUniqueIds(client.propertyIds).filter(pid => pid !== numericPropertyId);
                const shouldOwnProperty = numericId === payableClientId;

                nextClients[id] = {
                    ...client,
                    propertyIds: shouldOwnProperty ? [...filteredPropertyIds, numericPropertyId] : filteredPropertyIds
                };
            }

            return nextClients;
        });

        return {
            ok: true,
            paymentId: newPaymentId,
            amount: amountToPay
        };
    }, [clients, properties, payments]);

    /**
     * @type {(arg0: import('./data').ClientData) => void}
     */
    const editClient = useCallback(({ id, fullName, address }) => {
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
     * @type {(arg0: import('./data').PropertyData) => void}
     */
    const editProperty = useCallback((fields) => {
        setProperties(prev => {
            const property = prev[fields.id];
            if (!property) return prev;

            const { account, ...rest } = fields;
            const nextAccount = account
                ? {
                    ...property.account,
                    ...account,
                    ...(account.paymentIds !== undefined && { paymentIds: getUniqueIds(account.paymentIds) })
                }
                : property.account;

            return {
                ...prev,
                [fields.id]: {
                    ...property,
                    ...rest,
                    account: nextAccount
                }
            };
        });
    }, []);

    /**
     * @type {(arg0: import('./data').PaymentData) => void}
     */
    const editPayment = useCallback(({ id, amount, paymentDate }) => {
        setPayments(prev => {
            const payment = prev[id];
            if (!payment) return prev;

            const normalizedPaymentDate = paymentDate instanceof Date
                ? paymentDate.getTime()
                : (paymentDate !== undefined ? Number(paymentDate) : undefined);

            return {
                ...prev,
                [id]: {
                    ...payment,
                    ...(amount !== undefined && { amount }),
                    ...(
                        normalizedPaymentDate !== undefined &&
                        !Number.isNaN(normalizedPaymentDate) &&
                        { paymentDate: normalizedPaymentDate }
                    )
                }
            };
        });
    }, []);

    /**
     * @type {(arg0: number) => void}
     */
    const deletePayment = useCallback((paymentId) => {
        const numericPaymentId = Number(paymentId);
        const linkedProperty = Object.values(properties).find(property =>
            getUniqueIds(property.account?.paymentIds).includes(numericPaymentId)
        );

        const nextPayments = { ...payments };
        delete nextPayments[numericPaymentId];

        setPayments(nextPayments);

        if (!linkedProperty) {
            return;
        }

        const propertyId = linkedProperty.id;
        const nextPaymentIds = getUniqueIds(linkedProperty.account?.paymentIds).filter(id => id !== numericPaymentId);
        const totalPrice = getPropertyTotalPrice(linkedProperty);
        const paidTotal = getTotalPaid(nextPaymentIds, nextPayments);

        let nextStatus = 'available';
        if (nextPaymentIds.length > 0) {
            nextStatus = paidTotal >= totalPrice ? 'sold' : 'in-payment';
        }

        const nextActiveClientId = nextStatus === 'in-payment'
            ? getLastPaymentClientId(nextPaymentIds, nextPayments)
            : null;
        const ownerClientId = nextStatus === 'available'
            ? null
            : getLastPaymentClientId(nextPaymentIds, nextPayments);

        setProperties(prev => {
            const property = prev[propertyId];
            if (!property) return prev;

            return {
                ...prev,
                [propertyId]: {
                    ...property,
                    account: {
                        ...property.account,
                        status: nextStatus,
                        activeClientId: nextActiveClientId,
                        paymentIds: nextPaymentIds
                    }
                }
            };
        });

        setClients(prev => {
            const nextClients = {};

            for (const [id, client] of Object.entries(prev)) {
                const numericId = Number(id);
                const filteredPropertyIds = getUniqueIds(client.propertyIds).filter(pid => pid !== propertyId);
                const shouldOwnProperty = ownerClientId !== null && numericId === ownerClientId;

                nextClients[id] = {
                    ...client,
                    propertyIds: shouldOwnProperty ? [...filteredPropertyIds, propertyId] : filteredPropertyIds
                };
            }

            return nextClients;
        });
    }, [properties, payments]);

    /**
     * @type {(arg0: number) => void}
     */
    const deleteProperty = useCallback((propertyId) => {
        const numericPropertyId = Number(propertyId);
        const property = properties[numericPropertyId];
        if (!property) return;

        const paymentIdsToDelete = getUniqueIds(property.account?.paymentIds);

        setPayments(prev => {
            const nextPayments = { ...prev };
            for (const id of paymentIdsToDelete) {
                delete nextPayments[id];
            }
            return nextPayments;
        });

        setClients(prev => {
            const nextClients = {};
            for (const [id, client] of Object.entries(prev)) {
                nextClients[id] = {
                    ...client,
                    propertyIds: getUniqueIds(client.propertyIds).filter(pid => pid !== numericPropertyId)
                };
            }
            return nextClients;
        });

        setProperties(prev => {
            const { [numericPropertyId]: _removed, ...rest } = prev;
            return rest;
        });
    }, [properties]);

    /**
     * @type {(arg0: number) => void}
     */
    const deleteClient = useCallback((clientId) => {
        const numericClientId = Number(clientId);
        const client = clients[numericClientId];
        if (!client) return;

        const ownedPropertyIds = getUniqueIds(client.propertyIds);
        const activePropertyIds = Object.values(properties)
            .filter(property => Number(property.account?.activeClientId) === numericClientId)
            .map(property => property.id);
        const propertyIdsToReset = getUniqueIds([...ownedPropertyIds, ...activePropertyIds]);
        const propertyIdsToResetSet = new Set(propertyIdsToReset);
        const paymentIdsToDelete = getUniqueIds(
            propertyIdsToReset.flatMap(propertyId => properties[propertyId]?.account?.paymentIds || [])
        );

        setPayments(prev => {
            if (paymentIdsToDelete.length === 0) {
                return prev;
            }

            const nextPayments = { ...prev };
            for (const paymentId of paymentIdsToDelete) {
                delete nextPayments[paymentId];
            }

            return nextPayments;
        });

        setProperties(prev => {
            if (propertyIdsToReset.length === 0) {
                return prev;
            }

            const nextProperties = { ...prev };

            for (const propertyId of propertyIdsToReset) {
                const property = nextProperties[propertyId];
                if (!property) {
                    continue;
                }

                nextProperties[property.id] = {
                    ...property,
                    account: {
                        ...property.account,
                        status: 'available',
                        activeClientId: null,
                        paymentIds: []
                    }
                };
            }

            return nextProperties;
        });

        setClients(prev => {
            const nextClients = {};

            for (const [id, existingClient] of Object.entries(prev)) {
                if (Number(id) === numericClientId) {
                    continue;
                }

                nextClients[id] = {
                    ...existingClient,
                    propertyIds: getUniqueIds(existingClient.propertyIds).filter(pid => !propertyIdsToResetSet.has(pid))
                };
            }

            return nextClients;
        });
    }, [clients, properties]);

    return {
        clients,
        properties,
        payments,
        createClient,
        createProperty,
        createPaymentForProperty,
        editClient,
        editProperty,
        editPayment,
        deleteClient,
        deleteProperty,
        deletePayment
    };
}