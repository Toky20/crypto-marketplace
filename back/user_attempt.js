const Connection = require('./connection.js');

class UserAttempt {
    constructor() {
        // Pas besoin d'initialiser `this.pool` dans le constructeur
    }

    async insertOrUpdateUserAttempt(mail, nbTentative, isLocked = false) {
        try {
            // Récupérez le pool via Connection
            const pool = await Connection.getConnectionPostgres();

            if (!pool) {
                throw new Error("Impossible de récupérer une connexion à la base de données.");
            }

            const query = `
                INSERT INTO user_attempts (mail, nb_tentative, is_locked)
                VALUES ($1, $2, $3)
                ON CONFLICT (mail) 
                DO UPDATE SET 
                    nb_tentative = EXCLUDED.nb_tentative,
                    is_locked = EXCLUDED.is_locked;
            `;
            const values = [mail, nbTentative, isLocked];

            await pool.query(query, values); // Utilisation du pool pour exécuter la requête
            console.log(`User attempt for ${mail} inserted/updated successfully.`);
        } catch (error) {
            console.error('Error inserting/updating user attempt:', error.message);
            throw error;
        }
    }

    // async getUserAttempt(mail) {
    //     try {
    //         const pool = await Connection.getConnectionPostgres();
    //         if (!pool) {
    //             throw new Error("Impossible de récupérer une connexion à la base de données.");
    //         }

    //         // Requête pour récupérer les tentatives actuelles de l'utilisateur
    //         const query = 'SELECT nb_tentative, is_locked FROM user_attempts WHERE mail = $1';
    //         const values = [mail];
    //         const result = await pool.query(query, values);

    //         // Si l'utilisateur existe dans la base de données, retourner les tentatives et l'état de verrouillage
    //         if (result.rows.length > 0) {
    //             const user = result.rows[0];
    //             return {
    //                 nbTentative: user.nb_tentative,
    //                 isLocked: user.is_locked
    //             };
    //         } else {
    //             // Si l'utilisateur n'existe pas, renvoyer null ou une valeur par défaut
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error('Error retrieving user attempt:', error.message);
    //         throw error;
    //     }
    // }

    async getUserAttempt(mail) {
        try {
            console.log("Début de la méthode getUserAttempt avec l'email :", mail);
            const pool = await Connection.getConnectionPostgres();
            if (!pool) {
                throw new Error("Impossible de récupérer une connexion à la base de données.");
            }
    
            const query = 'SELECT nb_tentative, is_locked FROM user_attempts WHERE mail = $1';
            const values = [mail];
            console.log("Exécution de la requête :", query, "avec les valeurs :", values);
    
            const result = await pool.query(query, values);
            console.log("Résultat de la requête :", result.rows);
    
            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log("Utilisateur trouvé :", user);
                return {
                    nbTentative: user.nb_tentative,
                    isLocked: user.is_locked
                };
            } else {
                console.log("Aucun utilisateur trouvé avec cet email.");
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des tentatives utilisateur :', error.message);
            throw error;
        }
    }

}

module.exports = UserAttempt;
