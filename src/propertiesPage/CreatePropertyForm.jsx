import { useContext, useState } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

function toNumber(value) {
    return Number(value);
}

export default function CreatePropertyForm() {
    const { data, setCurrentPage } = useContext(AppContext);
    const [area, setArea] = useState("");
    const [blockNumber, setBlockNumber] = useState("");
    const [lotNumber, setLotNumber] = useState("");
    const [areaInSqm, setAreaInSqm] = useState("");
    const [pricePerSqm, setPricePerSqm] = useState("");
    const [errors, setErrors] = useState({});

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

        data.createProperty({
            area: areaValue,
            blockNumber: blockValue,
            lotNumber: lotValue,
            areaInSqm: sqmValue,
            pricePerSqm: priceValue,
            total: totalPrice,
            account: {
                status: "available",
                totalPrice,
                termStart: new Date().setHours(0, 0, 0, 0),
                paymentIds: []
            }
        });

        setCurrentPage({ name: "properties", params: {} });
    };

    return (
        <>
            <ContentHeader>
                <div className="ui-page-header">
                    <span className="ui-page-title">Create Property</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>New Property Record</h3>

                    <form onSubmit={handleSubmit} className="ui-form" style={{ maxWidth: "700px" }}>
                            <label className="ui-field">
                                <span>Area</span>
                                <input
                                    type="text"
                                    value={area}
                                    onChange={(event) => setArea(event.target.value)}
                                    placeholder="e.g. San Vic area"
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
                                    Save Property
                                </button>
                            </div>
                        </form>
                </Card>
            </ContentMain>
        </>
    );
}
