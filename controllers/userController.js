const db =  require('../config/databasepg');

const userController = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            const role = 'user'; // Assuming all registrations are for regular users
            const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id';
            const { rows } = await db.query(query, [username, password, role]);
            res.status(201).json({ id: rows[0].id, message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const query = 'SELECT id, role FROM users WHERE username = $1 AND password = $2';
            const { rows } = await db.query(query, [username, password]);
            if (rows.length === 0) {
                res.status(401).json({ message: 'Invalid credentials' });
            } else {
                res.status(200).json({ id: rows[0].id, role: rows[0].role, message: 'Login successful' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getSeatAvailability: async (req, res) => {
        // Implement logic to fetch seat availability based on source and destination
    },

    bookSeat: async (req, res) => {
        // Implement logic to book a seat
    },

    getBookingDetails: async (req, res) => {
        // Implement logic to fetch specific booking details
    }
};

module.exports = userController;
