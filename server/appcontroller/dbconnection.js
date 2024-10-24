const mysql = require('mysql2/promise');

async function dbconnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin123',
            database: 'solarops',
        });
        console.log('Connected to MySQL database');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        throw error;
    }
}

async function fetchData(email) {
    const connection = await dbconnection();
    const [rows] = await connection.query('SELECT * FROM organizations WHERE email = ?', [email]);
    connection.end(); // Close the connection
    return rows;
}

async function insertData({ organizationName, email, password, location }) {
    const connection = await dbconnection();
    const [result] = await connection.query(
        'INSERT INTO organizations (organization_name, email, password, location) VALUES (?, ?, ?, ?)',
        [organizationName, email, password, location]
    );
    connection.end(); // Close the connection
    return result;
}

async function fetchDataByEmailAndOrganization(email, organizationName) {
    const connection = await dbconnection();
    const [rows] = await connection.execute('SELECT * FROM organizations WHERE email = ? AND organization_name = ?', [email, organizationName]);
    await connection.end();
    return rows;
  }

module.exports = {
    fetchData,
    insertData,
    fetchDataByEmailAndOrganization
};

