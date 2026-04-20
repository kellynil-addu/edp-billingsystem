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
                <div className="ui-page-header">
                    <span className="ui-page-title">Create Client</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>New Client Record</h3>

                    <form onSubmit={handleSubmit} className="ui-form" style={{ maxWidth: "640px" }}>
                        <label className="ui-field">
                            <span>Full Name</span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                placeholder="e.g. Juan Dela Cruz"
                            />
                            {errors.fullName && <span className="ui-error">{errors.fullName}</span>}
                        </label>

                        <label className="ui-field">
                            <span>Address</span>
                            <input
                                type="text"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                                placeholder="e.g. Davao City"
                            />
                            {errors.address && <span className="ui-error">{errors.address}</span>}
                        </label>

                        <div className="ui-form-actions">
                            <button className="btn-ghost" type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="btn-primary" type="submit">
                                Save Client
                            </button>
                        </div>
                    </form>
                </Card>
            </ContentMain>
        </>
    );
}
