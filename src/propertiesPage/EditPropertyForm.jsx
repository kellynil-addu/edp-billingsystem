import { useContext, useState } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

function toNumber(value) {
    return Number(value);
}

export default function EditPropertyForm({ propertyId: propPropertyId }) {
    const { data, currentPage, setCurrentPage } = useContext(AppContext);

    const propertyId = Number(propPropertyId ?? currentPage?.params?.propertyId);
    const property = data.properties[propertyId];

    const [area, setArea] = useState(property?.area || "");
    const [blockNumber, setBlockNumber] = useState(property ? String(property.blockNumber) : "");
    const [lotNumber, setLotNumber] = useState(property ? String(property.lotNumber) : "");
    const [areaInSqm, setAreaInSqm] = useState(property ? String(property.areaInSqm) : "");
    const [pricePerSqm, setPricePerSqm] = useState(property ? String(property.pricePerSqm) : "");
    const [errors, setErrors] = useState({});

    if (!property) {
        return (
            <>
                <ContentHeader>
                    <div className="ui-page-header">
                        <span className="ui-page-title">Edit Property</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Property not found</h3>
                        <button className="btn-primary" onClick={() => setCurrentPage({ name: "properties", params: {} })}>
                            Back to Properties
                        </button>
                    </Card>
                </ContentMain>
            </>
        );
    }

    const handleCancel = () => {
        setCurrentPage({ name: "properties", params: {} });
    };

    const validate = () => {
        const nextErrors = {};

        if (!area.trim()) {
            nextErrors.area = "Area name is required.";
        }

        const block = toNumber(blockNumber);
        const lot = toNumber(lotNumber);
        const sqm = toNumber(areaInSqm);
        const price = toNumber(pricePerSqm);

        if (blockNumber.trim() === "" || Number.isNaN(block) || block <= 0) {
            nextErrors.blockNumber = "Block number must be greater than 0.";
        }

        if (lotNumber.trim() === "" || Number.isNaN(lot) || lot <= 0) {
            nextErrors.lotNumber = "Lot number must be greater than 0.";
        }

        if (areaInSqm.trim() === "" || Number.isNaN(sqm) || sqm <= 0) {
            nextErrors.areaInSqm = "Area in sqm must be greater than 0.";
        }

        if (pricePerSqm.trim() === "" || Number.isNaN(price) || price <= 0) {
            nextErrors.pricePerSqm = "Price per sqm must be greater than 0.";
        }

        return nextErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const nextErrors = validate();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const areaValue = area.trim();
        const blockValue = toNumber(blockNumber);
        const lotValue = toNumber(lotNumber);
        const sqmValue = toNumber(areaInSqm);
        const priceValue = toNumber(pricePerSqm);
        const totalPrice = sqmValue * priceValue;
        const uniquePaymentIds = Array.from(new Set(property.account.paymentIds || []));
        const paidTotal = uniquePaymentIds.reduce((sum, id) => sum + (data.payments[id]?.amount || 0), 0);
        const paymentClientIds = uniquePaymentIds
            .map(id => data.payments[id]?.clientId)
            .filter(id => id !== undefined && id !== null);
        const fallbackActiveClientId = paymentClientIds.length > 0 ? Number(paymentClientIds[paymentClientIds.length - 1]) : null;

        let nextStatus = "available";
        if (uniquePaymentIds.length > 0) {
            nextStatus = totalPrice > 0 && paidTotal >= totalPrice ? "sold" : "in-payment";
        }

        const nextActiveClientId = nextStatus === "in-payment"
            ? (property.account.activeClientId ?? fallbackActiveClientId)
            : null;

        data.editProperty({
            id: propertyId,
            area: areaValue,
            blockNumber: blockValue,
            lotNumber: lotValue,
            areaInSqm: sqmValue,
            pricePerSqm: priceValue,
            account: {
                totalPrice,
                status: nextStatus,
                activeClientId: nextActiveClientId,
                paymentIds: uniquePaymentIds
            }
        });

        setCurrentPage({ name: "properties", params: {} });
    };

    return (
        <>
            <ContentHeader>
                <div className="ui-page-header">
                    <span className="ui-page-title">Edit Property</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Update Property Record</h3>

                    <form onSubmit={handleSubmit} className="ui-form" style={{ maxWidth: "700px" }}>
                        <label className="ui-field">
                            <span>Area</span>
                            <input
                                type="text"
                                value={area}
                                onChange={(event) => setArea(event.target.value)}
                            />
                            {errors.area && <span className="ui-error">{errors.area}</span>}
                        </label>

                        <div className="ui-two-col">
                            <label className="ui-field">
                                <span>Block Number</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={blockNumber}
                                    onChange={(event) => setBlockNumber(event.target.value)}
                                />
                                {errors.blockNumber && <span className="ui-error">{errors.blockNumber}</span>}
                            </label>

                            <label className="ui-field">
                                <span>Lot Number</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={lotNumber}
                                    onChange={(event) => setLotNumber(event.target.value)}
                                />
                                {errors.lotNumber && <span className="ui-error">{errors.lotNumber}</span>}
                            </label>
                        </div>

                        <div className="ui-two-col">
                            <label className="ui-field">
                                <span>Area in sqm</span>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={areaInSqm}
                                    onChange={(event) => setAreaInSqm(event.target.value)}
                                />
                                {errors.areaInSqm && <span className="ui-error">{errors.areaInSqm}</span>}
                            </label>

                            <label className="ui-field">
                                <span>Price per sqm</span>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={pricePerSqm}
                                    onChange={(event) => setPricePerSqm(event.target.value)}
                                />
                                {errors.pricePerSqm && <span className="ui-error">{errors.pricePerSqm}</span>}
                            </label>
                        </div>

                        <div className="ui-form-actions">
                            <button className="btn-ghost" type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="btn-primary" type="submit">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Card>
            </ContentMain>
        </>
    );
}
