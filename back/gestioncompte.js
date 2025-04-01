const Connection = require('./connection.js');
const { Pool } = require('pg');
const crypto = require('crypto'); // Utilisation de crypto pour le hachage MD5
const admin = require('./firebase.js');

class GestionCompte {
    // Fonction pour obtenir l'ID de l'utilisateur par le token
    static async getUserIdByToken(token) {
        const pool = await Connection.getConnectionPostgres();
        
        if (!pool) {
            throw new Error('Impossible de se connecter à la base de donnees');
        }

        const query = `
            SELECT id_utilisateur 
            FROM token t
            left join token_used tu on t.id_token=tu.id
            where tu.id is null
            and NOW() BETWEEN creation AND creation + duree 
            AND token = $1
        `;

        try {
            const res = await pool.query(query, [token]);

            if (res.rows.length === 0) {
                throw new Error('Token non valide ou expire');
            }

            return res.rows[0].id_utilisateur;
        } catch (err) {
            console.error('Erreur lors de la recuperation de l\'ID de l\'utilisateur :', err.message);
            throw err;
        }
    }

    static async executeQuery(query, params, connection) {
        return new Promise((resolve, reject) => {
          if (params) {
            connection.query(query, params, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result.rows);
              }
            });
          } else {
            connection.query(query, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result.rows);
              }
            });
          }
        });
      }

    // Fonction pour mettre à jour le mot de passe d'un utilisateur
    static async updatePassword(userId, newPassword) {
        const pool = await Connection.getConnectionPostgres();

        if (!pool) {
            throw new Error('Impossible de se connecter à la base de donnees');
        }

        // Hachage du mot de passe avec MD5
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        const query = `
            UPDATE utilisateur
            SET mdp = $1
            WHERE id_utilisateur = $2
        `;

        const queryFirebase = "SELECT email FROM utilisateur WHERE id_utilisateur = $1";
        const rowsFirebase = await GestionCompte.executeQuery(queryFirebase, [userId], pool);
    
        var emailFirebase;
        if (rowsFirebase.length > 0) {
            emailFirebase=rowsFirebase[0].email;
            const user = await admin.auth().getUserByEmail(emailFirebase);
            await admin.auth().updateUser(user.uid, {
                password: newPassword,
            });
            console.log("Mot de passe Firebase mis à jour avec succès (via email)");
        }

        try {
            const res = await pool.query(query, [hashedPassword, userId]);

            if (res.rowCount === 0) {
                throw new Error('Utilisateur non trouve ou mise à jour echouee');
            }

            return 'Mot de passe mis a jour avec succès';
        } catch (err) {
            console.error('Erreur lors de la mise à jour du mot de passe :', err.message);
            throw err;
        }
    }
}

module.exports = GestionCompte;
