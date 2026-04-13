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
                <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Create Property</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>New Property Record</h3>

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem", maxWidth: "700px", marginTop: "0.75rem" }}>
                            <label style={{ display: "grid", gap: "0.35rem" }}>
                                <span style={{ fontWeight: "bold" }}>Area</span>
                                <input
                                    type="text"
                                    value={area}
                                    onChange={(event) => setArea(event.target.value)}
                                    placeholder="e.g. San Vic area"
                                    style={{ padding: "0.55rem" }}
                                />
                                {errors.area && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.area}</span>}
                            </label>

                            <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "1fr 1fr" }}>
                                <label style={{ display: "grid", gap: "0.35rem" }}>
                                    <span style={{ fontWeight: "bold" }}>Block Number</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={blockNumber}
                                        onChange={(event) => setBlockNumber(event.target.value)}
                                        style={{ padding: "0.55rem" }}
                                    />
                                    {errors.blockNumber && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.blockNumber}</span>}
                                </label>

                                <label style={{ display: "grid", gap: "0.35rem" }}>
                                    <span style={{ fontWeight: "bold" }}>Lot Number</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={lotNumber}
                                        onChange={(event) => setLotNumber(event.target.value)}
                                        style={{ padding: "0.55rem" }}
                                    />
                                    {errors.lotNumber && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.lotNumber}</span>}
                                </label>
                            </div>

                            <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "1fr 1fr" }}>
                                <label style={{ display: "grid", gap: "0.35rem" }}>
                                    <span style={{ fontWeight: "bold" }}>Area in sqm</span>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={areaInSqm}
                                        onChange={(event) => setAreaInSqm(event.target.value)}
                                        style={{ padding: "0.55rem" }}
                                    />
                                    {errors.areaInSqm && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.areaInSqm}</span>}
                                </label>

                                <label style={{ display: "grid", gap: "0.35rem" }}>
                                    <span style={{ fontWeight: "bold" }}>Price per sqm</span>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={pricePerSqm}
                                        onChange={(event) => setPricePerSqm(event.target.value)}
                                        style={{ padding: "0.55rem" }}
                                    />
                                    {errors.pricePerSqm && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.pricePerSqm}</span>}
                                </label>
                            </div>

                            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem" }}>
                                <button type="button" onClick={handleCancel} style={{ padding: "0.55rem 0.9rem" }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ padding: "0.55rem 0.9rem", fontWeight: "bold" }}>
                                    Save Property
                                </button>
                            </div>
                        </form>
                </Card>
            </ContentMain>
        </>
    );
}
