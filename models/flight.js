import { v4 as Id } from 'uuid';

const flights = [
    {
        id: Id(),
        from: 'Paris',
        to: 'Berlin',
        date: '2025-08-15',
        price: 850,
        company: 'Air France'
    },

    {
        id: Id(),
        from: 'Dublin',
        to: 'London',
        date: '2025-10-20',
        price: 850,
        company: 'Air France'
    }
];

class Flight {
    static getAll(id) {
        return flights;
    }

    static getById(id) {
        return flights.find((flight) => flight.id === id);
    }

    static add(flight) {
        const newFlight = {
            id: Id(),
            ...flight
        };
        flights.unshift(newFlight);
        return newFlight;
    }
}

export default Flight;
