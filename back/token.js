const sql = require('pg');
const crypto = require('crypto');
const fs = require('fs');

class Token{

    constructor(token, duree, id_utilisateur) {
      this.token = token || null; 
      this.duree = duree || null; 
      this.id_utilisateur = id_utilisateur || null; 
    }

    getIdUtilisateur() {
        return this.id_utilisateur;
    }
    
    setIdUtilisateur(id_utilisateur) {
        this.id_utilisateur = id_utilisateur;
    }

    setToken(token) {
      this.token = token;
    }

    getToken() {
      return this.token;
    }

    setDuree(duree) {
      this.duree = duree; 
    }

    getDuree() {
      return this.duree;
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

    static async createToken(connection, id_utilisateur) {
      const query = `
        INSERT INTO token (token, duree, id_utilisateur)
        VALUES ($1, $2, $3) `;

      try { 
        var token =crypto.randomBytes(15).toString('hex')
        var duree = JSON.parse(await fs.promises.readFile("config.json", 'utf8')).dureeToken;
        const params = [token, duree, id_utilisateur]; 
        console.log(params);
        const result = await Token.executeQuery(query, params, connection);
        return token;
      } catch (error) {
        console.error('Erreur lors de l insertion du token :', error);
        throw error;
      }
    } 



  static async verifyAndGenerateNewToken(connection, token) {
    const query = `
      SELECT token, id_utilisateur 
      FROM token t
      left join token_used tu on t.id_token=tu.id
      WHERE NOW() BETWEEN creation AND creation + duree and tu.id is null 
      AND token = $1`;

    try {
      // Vérification du token existant dans la base de données
      const result = await Token.executeQuery(query, [token], connection);

      if (result && result.length > 0) {
        // Le token est valide, récupérer l'id_utilisateur
        const id_utilisateur = result[0].id_utilisateur;
        const newToken = await this.createToken(connection, id_utilisateur);
        const query2='insert into token_used (id) select id_token from token where token=$1';
        await Token.executeQuery(query2, [token], connection);
        return newToken;
      }

      else {
        // Si le token n'est pas valide ou inexistant, renvoyer une erreur
        console.error("Accès refusé : token invalide ou expiré");
        throw new Error("Accès refusé : token invalide ou expiré");
        return null; // Retourne null avec un message d'erreur
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token : ", error);
      throw new Error(error);
    }
  }

  static async getIdRoleByToken(connection, token) {
    const query = `
        SELECT ur.id_role
        FROM token t
        left join token_used tu on t.id_token=tu.id
        join utilisateur_role ur on ur.id_utilisateur=t.id_utilisateur
        WHERE NOW() BETWEEN creation AND creation + duree and tu.id is null 
        AND t.token = $1`;

    try {
        // Exécution de la requête pour récupérer l'id_role
        const result = await Token.executeQuery(query, [token], connection);

        if (result && result.length > 0) {
            // Si un résultat est trouvé, on retourne le premier id_role
            return result[0].id_role;
        } else {
            // Si aucun résultat n'est trouvé, on lève une erreur
            console.error("Aucun rôle trouvé pour le token : ", token);
            throw new Error("Aucun rôle trouvé pour le token");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du rôle : ", error);
        throw new Error(error);
    }
  }

}
module.exports = Token;



