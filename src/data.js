// Manages saving, loading, creation of data for localStorage

// What to view:
// Access root data: list all payments, every property of every client; list all properties, every client.
// Access client: get details; list all properties; list all payments, every property.
// Access property: get details; list all payments.

// What to edit:
// 

// Doubly linked? That means both should be updated.

/**
 * @typedef {Object} RootData
 * @property {Record<number, ClientData>} clients
 * @property {Record<number, PropertyData>} properties
 * @property {Record<number, PaymentData>} payments
 * @property {number} lastClientId
 * @property {number} lastPropertyId
 * @property {number} lastPaymentId
 */

/**
 * @typedef {Object} ClientData
 * @property {number} id
 * @property {string} fullName
 * @property {string} address
 * @property {number[]} propertyIds
 */

/**
 * @typedef {Object} PropertyData
 * @property {number} id
 * @property {string} area
 * @property {number} blockNumber
 * @property {number} lotNumber
 * @property {number} areaInSqm
 * @property {number} pricePerSqm
 * @property {AccountData} account
 */

/**
 * @typedef {Object} AccountData
 * @property {string} status
 * @property {number} totalPrice
 * @property {number} termStart   // timestamp (ms)
 * @property {number} termDuration
 * @property {number} downPayment
 * @property {number} monthlyPayment
 * @property {number[]} paymentIds
 */

/**
 * @typedef {Object} PaymentData
 * @property {number} id
 * @property {number} amount
 * @property {number} paymentDate // timestamp (ms)
 */

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} fullName
 * @property {string} address
 * @property {Object.<string, Property>} propertyLots
 */

const sample = {
    clients: {
        1: {
            id: 1,
            fullName: "John Doe",
            address: "Davao City",
            propertyIds: [1],
        },

        2: {
            id: 2,
            fullName: "Juan dela Cruz",
            address: "Davao City",
            propertyIds: [2],
        }
    },

    properties: {
        1: {
            id: 1,
            area: 'San Vic area',
            blockNumber: 5,
            lotNumber: 10,
            areaInSqm: 70,
            pricePerSqm: 200,

            account: {
                status: "active",
                totalPrice: 140000,
                remaining: 110000,
                termStart: new Date().setHours(0,0,0,0),
                termDuration: 24,
                downPayment: 20000,
                monthlyPayment: 5000,
                paymentIds: [1,2],
            }
        },

        2: {
            id: 2,
            area: 'San Vic area',
            blockNumber: 8,
            lotNumber: 4,
            areaInSqm: 100,
            pricePerSqm: 250,

            account: {
                status: "active",
                totalPrice: 250000,
                remaining: 170000,
                termStart: new Date().setHours(0,0,0,0),
                termDuration: 12,
                downPayment: 10000,
                monthlyPayment: 20000,
                paymentIds: [3,4,5]
            },
        }
    },

    payments: {
        2: {
            id: 2,
            amount: 6000,
            paymentDate: new Date().setHours(6,0,0,0),
        },
        4: {
            id: 4,
            amount: 4000,
            paymentDate: new Date().setHours(10,21,0,0)
        },
        1: {
            id: 1,
            amount: 30000,
            paymentDate: new Date().setHours(5,30,0,0),
        },
        3: {
            id: 3,
            amount: 20000,
            paymentDate: new Date().setHours(7,44,0,0)
        },
        5: {
            id: 5,
            amount: 10000,
            paymentDate: new Date().setHours(16,11,0,0)
        },
    },

    lastClientId: 1,
    lastPropertyId: 1,
    lastPaymentId: 2,
}

class AppData {
    /**
     * @type {RootData}
     */
    data;

    constructor(data) {
        this.data = data;
    }

    createClient(clientData) {
        const id = ++this.data.lastClientId;

        const client = {
            id,
            ...clientData,
            fullName: "John Doe",
            address: "Davao City"
        }

        this.data.clients[id] = client;

        return new Client(this.data, client);
    }

    createProperty(propertyData) {
        const id = ++this.data.lastPropertyId;

        const property = {
            id,
            ...propertyData,
            account: {
                status: "active",
                totalPrice: total,
                termStart: new Date().setHours(0,0,0,0),
                termDuration: 24,
                downPayment: 0,
                monthlyPayment: 0,
                paymentIds: []
            }
        };

        this.data.properties[id] = property;

        return new Property(this.root, property);
    }

    getAllClients() {
        return Object.values(this.data.clients).map(clientData => new Client(this.data, clientData));
    }

    getAllProperties() {
        return Object.values(this.data.properties).map(propertyData => new Property(this.data, propertyData));
    }

    getAllPayments() {
        return Object.values(this.data.payments).map(paymentData => new Payment(this.data, paymentData));
    }

    getClientById(clientId) {
        return new Client(this.data, this.data.clients[clientId]);
    }

    getPropertyById(propertyId) {
        return new Property(this.data, this.data.properties[propertyId]);
    }

    getPaymentById(paymentId) {
        return new Payment(this.data, this.data.payments[paymentId])
    }
}

class Client {
    /**
     * @type {RootData}
     */
    root;
    /**
     * @type {ClientData}
     */
    data;
    
    constructor(root, data) {
        this.root = root;
        this.data = data;
    }

    get id() { return this.data.id; }
    get fullName() { return this.data.fullName; }
    get address() { return this.data.address; }

    getProperties() {
        return this.data.propertyIds.map(id =>
            new Property(this.root, this.root.properties[id])
        );
    }

    addProperty(propertyId) {
        const property = this.root.properties[propertyId];
        if (property) {
            this.data.propertyIds.push(propertyId);
            return true;
        } else {
            return false;
        }
    }
    
    removeProperty(propertyId) {
        const property = this.root.properties[propertyId];

        if (!property) return false;

        if (!this.data.propertyIds.includes(propertyId)) return false;

        this.data.propertyIds.filter(id => id !== propertyId);

        return true;
    }

    editFields({ fullName, address }) {
        if (fullName !== undefined) this.data.fullName = fullName;
        if (address !== undefined) this.data.address = address;
    }

    delete() {
        // delete all properties (which also deletes payments)
        for (const propertyId of this.data.propertyIds) {
            new Property(this.root, this.root.properties[propertyId]).delete();
        }

        delete this.root.clients[this.id];
    }
}

class Property {

    /**
     * @type {RootData}
     */
    root;
    /**
     * @type {PropertyData}
     */
    data;

    constructor(root, data) {
        this.root = root;
        this.data = data;
    }

    get id() { return this.data.id; }
    get account() { return this.data.account; }
    get area() { return this.data.area; }
    get blockNumber() { return this.data.blockNumber; }
    get lotNumber() { return this.data.lotNumber; }
    get areaInSqm() { return this.data.areaInSqm; }
    get pricePerSqm() { return this.data.pricePerSqm; }

    getPayments() {
        return this.data.account.paymentIds.map(id =>
            new Payment(this.root, this.root.payments[id], this.data)
        );
    }

    getDisplayName() {
        return `${this.area} - Blk. ${this.blockNumber} Lot ${this.lotNumber}`
    }

    get totalPaid() {
        return this.getPayments().reduce((sum, p) => sum + p.amount, 0);
    }

    get remaining() {
        return this.data.account.totalPrice - this.totalPaid;
    }

    addPayment({ amount, paymentDate }) {
        const id = ++this.root.lastPaymentId;

        const payment = {
        id,
        amount,
        paymentDate: paymentDate.getTime()
        };

        this.root.payments[id] = payment;
        this.data.account.paymentIds.push(id);

        return new Payment(this.root, payment, this.data);
    }

    editFields(fields) {
        const { account, ...rest } = fields;
        Object.assign(this.data, rest);

        if (account) Object.assign(this.data.account, account);
    }

    delete() {
        // delete all payments
        for (const pid of this.data.account.paymentIds) {
            delete this.root.payments[pid];
        }

        // remove from clients
        for (const client of Object.values(this.root.clients)) {
            client.propertyIds = client.propertyIds.filter(id => id !== this.id);
        }

        delete this.root.properties[this.id];
    }
}

class Payment {
    /**
     * @type {RootData}
     */
    root;
    /**
     * @type {PaymentData}
     */
    data;

    constructor(root, data, propertyRef) {
        this.root = root;
        this.data = data;
        this.propertyRef = propertyRef;
    }

    get id() { return this.data.id; }
    get amount() { return this.data.amount; }
    get paymentDate() { return new Date(this.data.paymentDate); }

    editFields({ amount, paymentDate }) {
        if (amount !== undefined) this.data.amount = amount;
        if (paymentDate !== undefined) this.data.paymentDate = paymentDate.getTime();
    }

    delete() {
        const ids = this.propertyRef.account.paymentIds;
        this.propertyRef.account.paymentIds = ids.filter(id => id !== this.id);

        delete this.root.payments[this.id];
    }
}

// Return save data if it exists. If not, make a fresh new save data.
export function loadData() {
    const jsonData = localStorage.getItem("data");

    if (jsonData) {
        const data = JSON.parse(jsonData);
        return data;
    } else {
        const data = {...sample};
        saveToStorage(data);
        return data;
    }
}

// Save to localStorage
export function saveToStorage(data) {
    localStorage.setItem("data", JSON.stringify(data));
}
