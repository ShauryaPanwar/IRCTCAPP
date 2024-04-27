const db =  require('../config/databasepg');
const adminController = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            const role = 'admin'; // Assuming all registrations are for admins
            const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id';
            const { rows } = await db.query(query, [username, password, role]);
            res.status(201).json({ id: rows[0].id, message: 'Admin registered successfully' });
        } catch (error) {
            console.error('Error registering admin:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addTrain: async (req, res) => {
        try {
            const { source, destination, totalSeats } = req.body;
            const query = 'INSERT INTO trains (source, destination, total_seats) VALUES ($1, $2, $3) RETURNING id';
            const { rows } = await db.query(query, [source, destination, totalSeats]);
            res.status(201).json({ id: rows[0].id, message: 'Train added successfully' });
        } catch (error) {
            console.error('Error adding train:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = adminController;
