import { useContext, useState } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";
import ContentHeader from "../components/ContentHeader";
import ContentMain from "../components/ContentMain";

export default function EditClientForm({ clientId: propClientId }) {
    const { data, currentPage, setCurrentPage } = useContext(AppContext);

    const clientId = Number(propClientId ?? currentPage?.params?.clientId);
    const client = data.clients[clientId];

    const [fullName, setFullName] = useState(client?.fullName || "");
    const [address, setAddress] = useState(client?.address || "");
    const [errors, setErrors] = useState({});

    if (!client) {
        return (
            <>
                <ContentHeader>
                    <div className="ui-page-header">
                        <span className="ui-page-title">Edit Client</span>
                    </div>
                </ContentHeader>
                <ContentMain>
                    <Card>
                        <h3>Client not found</h3>
                        <button className="btn-primary" onClick={() => setCurrentPage({ name: "clients", params: {} })}>
                            Back to Clients
                        </button>
                    </Card>
                </ContentMain>
            </>
        );
    }

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

        data.editClient({
            id: clientId,
            fullName: fullName.trim(),
            address: address.trim()
        });

        setCurrentPage({ name: "clients", params: {} });
    };

    return (
        <>
            <ContentHeader>
                <div className="ui-page-header">
                    <span className="ui-page-title">Edit Client</span>
                </div>
            </ContentHeader>

            <ContentMain>
                <Card>
                    <h3>Update Client Record</h3>

                    <form onSubmit={handleSubmit} className="ui-form" style={{ maxWidth: "640px" }}>
                        <label className="ui-field">
                            <span>Full Name</span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                            />
                            {errors.fullName && <span className="ui-error">{errors.fullName}</span>}
                        </label>

                        <label className="ui-field">
                            <span>Address</span>
                            <input
                                type="text"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                            />
                            {errors.address && <span className="ui-error">{errors.address}</span>}
                        </label>

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
