import { useContext, useState } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

export default function CreateClientForm() {
    const { data, setCurrentPage } = useContext(AppContext);

    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({});

    const handleCancel = () => {
        setCurrentPage({ name: "clients", params: {} });
    };

    const validate = () => {
        const nextErrors = {};

        if (!fullName.trim()) {
            nextErrors.fullName = "Full name is required.";
        }

        if (!address.trim()) {
            nextErrors.address = "Address is required.";
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

        data.createClient({
            fullName: fullName.trim(),
            address: address.trim()
        });

        setCurrentPage({ name: "clients", params: {} });
    };

    return (
        <>
            <ContentHeader>
                <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Create Client</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>New Client Record</h3>

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem", maxWidth: "640px", marginTop: "0.75rem" }}>
                        <label style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Full Name</span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                placeholder="e.g. Juan Dela Cruz"
                                style={{ padding: "0.55rem" }}
                            />
                            {errors.fullName && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.fullName}</span>}
                        </label>

                        <label style={{ display: "grid", gap: "0.35rem" }}>
                            <span style={{ fontWeight: "bold" }}>Address</span>
                            <input
                                type="text"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                                placeholder="e.g. Davao City"
                                style={{ padding: "0.55rem" }}
                            />
                            {errors.address && <span style={{ color: "#b00020", fontSize: "0.9rem" }}>{errors.address}</span>}
                        </label>

                        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem" }}>
                            <button type="button" onClick={handleCancel} style={{ padding: "0.55rem 0.9rem" }}>
                                Cancel
                            </button>
                            <button type="submit" style={{ padding: "0.55rem 0.9rem", fontWeight: "bold" }}>
                                Save Client
                            </button>
                        </div>
                    </form>
                </Card>
            </ContentMain>
        </>
    );
}
