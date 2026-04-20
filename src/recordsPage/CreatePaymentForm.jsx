import { useContext, useMemo, useState } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

function getPropertyName(property) {
    return `${property.area} - Blk. ${property.blockNumber} Lot ${property.lotNumber}`;
}

function getRemainingBalance(property, payments) {
    const totalPrice = Number(property.account?.totalPrice || 0);
    const uniquePaymentIds = Array.from(new Set(property.account?.paymentIds || []));
    const totalPaid = uniquePaymentIds.reduce((sum, id) => sum + Number(payments[id]?.amount || 0), 0);
    return Math.max(totalPrice - totalPaid, 0);
}

export default function CreatePaymentForm() {
    const { data, setCurrentPage } = useContext(AppContext);

    const propertyOptions = useMemo(() => {
        return Object.values(data.properties)
            .map(property => {
                const remainingBalance = getRemainingBalance(property, data.payments);
                const activeClientId = property.account?.activeClientId ?? null;
                const activeClientName = activeClientId !== null && activeClientId !== undefined
                    ? (data.clients[activeClientId]?.fullName || "Unknown Client")
                    : null;
                const status = property.account?.status || "available";

                return {
                    propertyId: String(property.id),
                    status,
                    remainingBalance,
                    activeClientId,
                    label: `${getPropertyName(property)} | Status: ${status} | Remaining: ${remainingBalance}${activeClientName ? ` | Buyer: ${activeClientName}` : ""}`
                };
            })
            .filter(option => option.status !== "sold" && option.remainingBalance > 0)
            .sort((a, b) => Number(b.propertyId) - Number(a.propertyId));
    }, [data.clients, data.properties, data.payments]);

    const clientOptions = useMemo(() => {
        return Object.values(data.clients)
            .map(client => ({ id: String(client.id), label: client.fullName }))
            .sort((a, b) => Number(b.id) - Number(a.id));
    }, [data.clients]);

    const hasAnyProperties = Object.keys(data.properties).length > 0;

    const [propertyId, setPropertyId] = useState("");
    const [clientId, setClientId] = useState("");
    const [paymentType, setPaymentType] = useState("partial");
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedPropertyOption = propertyOptions.find(option => option.propertyId === propertyId) || null;
    const selectedRemainingBalance = selectedPropertyOption ? selectedPropertyOption.remainingBalance : 0;
    const isClientLocked = selectedPropertyOption && selectedPropertyOption.activeClientId !== null && selectedPropertyOption.activeClientId !== undefined;
    const lockedClientId = isClientLocked ? String(selectedPropertyOption.activeClientId) : "";
    const selectedClientValue = isClientLocked ? lockedClientId : clientId;
    const fullPaymentAmountValue = selectedRemainingBalance > 0 ? String(selectedRemainingBalance) : "";

    const handleCancel = () => {
        setCurrentPage({ name: "payments", params: {} });
    };

    const handleGoToCreateProperty = () => {
        setCurrentPage({ name: "properties", params: {} });
    };

    const handleGoToClients = () => {
        setCurrentPage({ name: "clients", params: {} });
    };

    const validate = () => {
        const nextErrors = {};
        const dateValue = new Date(paymentDate).getTime();

        if (!propertyId) {
            nextErrors.propertyId = "Please select a property.";
        }

        if (!selectedPropertyOption) {
            nextErrors.propertyId = "Selected property is not available for payment.";
        }

        if (!selectedClientValue || Number.isNaN(Number(selectedClientValue))) {
            nextErrors.clientId = "Please select a valid client.";
        }

        if (paymentType === "partial") {
            const numericAmount = Number(amount);

            if (amount.trim() === "" || Number.isNaN(numericAmount) || numericAmount <= 0) {
                nextErrors.amount = "Amount must be a number greater than 0.";
            } else if (selectedRemainingBalance > 0 && numericAmount > selectedRemainingBalance) {
                nextErrors.amount = "Amount cannot exceed remaining balance.";
            }
        }

        if (paymentType === "full" && selectedRemainingBalance <= 0) {
            nextErrors.amount = "No remaining balance for this property.";
        }

        if (!paymentDate || Number.isNaN(dateValue)) {
            nextErrors.paymentDate = "Please enter a valid payment date.";
        }

        return nextErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitError("");

        const nextErrors = validate();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        if (!selectedClientValue) {
            setSubmitError("Please select a valid client before submitting.");
            return;
        }

        setIsSubmitting(true);

        const result = data.createPaymentForProperty({
            propertyId: Number(propertyId),
            clientId: Number(selectedClientValue),
            amount: paymentType === "full" ? selectedRemainingBalance : Number(amount || 0),
            paymentDate: new Date(paymentDate).setHours(0, 0, 0, 0),
            paymentType
        });

        if (!result.ok) {
            setIsSubmitting(false);
            setSubmitError(result.error || "Unable to save payment.");
            return;
        }

        setCurrentPage({ name: "payments", params: {} });
    };

    return (
        <>
            <ContentHeader>
                <div className="ui-page-header">
                    <span className="ui-page-title">Create Payment</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>New Payment Record</h3>

                    {propertyOptions.length === 0 ? (
                        <div style={{ marginTop: "1rem" }}>
                            <p>
                                {hasAnyProperties
                                    ? "No payable properties found. Choose a property that is not fully paid."
                                    : "No properties found. Add a property first before creating a payment."}
                            </p>
                            <div className="ui-button-row">
                                <button className="btn-ghost" onClick={handleGoToClients}>
                                    Go to Clients
                                </button>
                                <button className="btn-primary" onClick={handleGoToCreateProperty}>
                                    Go to Properties
                                </button>
                                <button className="btn-ghost" onClick={handleCancel}>
                                    Back to Payments
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="ui-form" style={{ maxWidth: "640px" }}>
                            <label className="ui-field">
                                <span>Property</span>
                                <select
                                    value={propertyId}
                                    onChange={(event) => setPropertyId(event.target.value)}
                                >
                                    <option value="">Select a property</option>
                                    {propertyOptions.map(option => (
                                        <option key={option.propertyId} value={option.propertyId}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.propertyId && <span className="ui-error">{errors.propertyId}</span>}
                            </label>

                            <label className="ui-field">
                                <span>Client</span>
                                <select
                                    value={selectedClientValue}
                                    onChange={(event) => setClientId(event.target.value)}
                                    disabled={Boolean(isClientLocked)}
                                >
                                    <option value="">Select a client</option>
                                    {clientOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {isClientLocked && <span className="ui-help">This property already has an installment buyer.</span>}
                                {!isClientLocked && clientOptions.length === 0 && <span className="ui-help">No clients found. Create one from the Clients page.</span>}
                                {errors.clientId && <span className="ui-error">{errors.clientId}</span>}
                            </label>

                            <label className="ui-field">
                                <span>Payment Type</span>
                                <div className="ui-radio-row">
                                    <label className="ui-radio-label">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value="partial"
                                            checked={paymentType === "partial"}
                                            onChange={(event) => setPaymentType(event.target.value)}
                                        />
                                        Partial
                                    </label>
                                    <label className="ui-radio-label">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value="full"
                                            checked={paymentType === "full"}
                                            onChange={(event) => setPaymentType(event.target.value)}
                                        />
                                        Full
                                    </label>
                                </div>
                            </label>

                            <label className="ui-field">
                                <span>Remaining Balance</span>
                                <input
                                    type="text"
                                    value={selectedRemainingBalance > 0 ? selectedRemainingBalance : "-"}
                                    readOnly
                                />
                            </label>

                            <label className="ui-field">
                                <span>Amount</span>
                                {paymentType === "full" ? (
                                    <input
                                        type="text"
                                        value={fullPaymentAmountValue || "-"}
                                        readOnly
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        max={selectedRemainingBalance > 0 ? String(selectedRemainingBalance) : undefined}
                                        value={amount}
                                        onChange={(event) => setAmount(event.target.value)}
                                        placeholder="e.g. 5000"
                                    />
                                )}
                                {errors.amount && <span className="ui-error">{errors.amount}</span>}
                            </label>

                            <label className="ui-field">
                                <span>Payment Date</span>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(event) => setPaymentDate(event.target.value)}
                                />
                                {errors.paymentDate && <span className="ui-error">{errors.paymentDate}</span>}
                            </label>

                            {submitError && <span className="ui-error">{submitError}</span>}

                            <div className="ui-form-actions">
                                <button className="btn-ghost" type="button" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button className="btn-primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Payment"}
                                </button>
                            </div>
                        </form>
                    )}
                </Card>
            </ContentMain>
        </>
    );
}
