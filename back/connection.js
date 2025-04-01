const { Pool } = require('pg');

class Connection {
  static async getConnectionPostgres() {
    try {
        const username = 'postgres';
        const password = 'postgres'; 
        const hostname = 'db';
        const portNumber = '5432';
        const databaseName = 'cloud';
        
        const connectionString = `postgresql://${username}:${password}@${hostname}:${portNumber}/${databaseName}`;

      const pool = new Pool({
        connectionString,
      });

      return pool;
    } catch (err) {
      console.error("Erreur lors de la connexion à la base de données:", err);
      return null;
    }
  }

}

module.exports = Connection;