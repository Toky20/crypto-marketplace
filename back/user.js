//const bcrypt = require('bcrypt');
const md5 = require('md5');
const admin = require('./firebase.js');
class Utilisateur{
    constructor(id, mail, mdp, date_creation) {
        // if (id !== undefined && mail !== undefined && mdp !== undefined && date_creation !== undefined) {
        //     this.setId(id);
        //     this.setMail(mail);
        //     this.setMdp(mdp);
        //     this.setDateCreation(date_creation);
        // } else {
        //     this.id = '';
        //     this.mail = '';
        //     this.mdp = '';
        //     this.date_creation = '';
        // }
        this.setId(id);
        this.setMail(mail);
        this.setMdp(mdp);
        this.setDateCreation(date_creation);
    } 

    getId() {
        return this.id;
    }
    
    setId(id) {
        // if (typeof id !== "number" || id <= 0) {
        // throw new TypeError("L'identifiant doit être un nombre positif.");
        // }
        this.id = id;
    }
    
    getMail() {
        return this.mail;
    }
    
    setMail(mail) {
        // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        // throw new Error("Format d'adresse e-mail invalide.");
        // }
        this.mail = mail;
    }
    
    getMdp() {
        return this.mdp;
    }

    getMdpwh() {
        return this.mdpwh;
    }
    
    // static async hashPassword(password, saltRounds = 20) {
    //     try {
    //       const hashedPassword = await bcrypt.hash(password, saltRounds);
    //       return hashedPassword;
    //     } catch (error) {
    //       console.error('Erreur lors du hachage du mot de passe:', error);
    //       throw error;
    //     }
    //   }

      async setMdp(mdp) {
        if (typeof mdp !== "string") {
          throw new Error("Le mot de passe doit être une chaîne de caractères d'au moins 8 caractères.");
        }
    
        const hashedPassword = md5(mdp);
        this.mdp = hashedPassword;
        this.mdpwh=mdp;
    }

    // async comparePassword(mdp) {
    //     return await bcrypt.compare(mdp, this.mdp);
    //   }
    
    getDateCreation() {
        return this.dateCreation;
    }
    
    setDateCreation(dateCreation) {
        // if (!(dateCreation instanceof Date)) {
        // throw new TypeError("dateCreation doit être un objet Date valide.");
        // }
        this.dateCreation = dateCreation;
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


      // User
      static async getAllUser(conn) {
        let utilisateurs = [];
        try {
            const query = "SELECT * FROM utilisateur";
            const rows = await Utilisateur.executeQuery(query, null, conn);
    
            for (const row of rows) {
              const id = row.id_utilisateur;
              const mail = row.email;
              const mdp = row.mdp;
              const dateCreation = row.date_inscription;
    
                const utilisateur = new Utilisateur(id, mail, mdp, dateCreation);
                utilisateurs.push(utilisateur);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            throw error; 
        }
    
        return utilisateurs;
    }

    static async getUserById(id, conn) {
      let utilisateur;
      try {
        const query = "SELECT * FROM utilisateur WHERE id_utilisateur = $1";
        const rows = await Utilisateur.executeQuery(query, [id], conn);
  
        if (rows.length > 0) {
          utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
        } else {
          utilisateur = null;
        }
  
        return utilisateur;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        throw error; 
      }
    }

    static async getUserByMail(mail, conn) {
      let u = undefined;
      try {
        const query = "SELECT * FROM utilisateur WHERE email = $1";
        const rows = await Utilisateur.executeQuery(query, [mail], conn);
  
        if (rows.length > 0) {
          u = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
        } else {
          return null;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur par mail :", error);
        throw error;
      }
      return u;
    }
  
    static async getUserByMdp(mdp, conn) {
      try {
        const query = "SELECT * FROM utilisateur WHERE mdp = $1";
        const rows = await Utilisateur.executeQuery(query, [mdp], conn);
  
        if (rows.length > 0) {
          utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
        } else {
          return null;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur par mot de passe :", error);
        throw error;
      }
    }
  
    static async getUserByDateCreation(dateCreation, conn) {
      try {
        const query = "SELECT * FROM utilisateur WHERE date_inscription = $1";
        const rows = await Utilisateur.executeQuery(query, [dateCreation], conn);
  
        if (rows.length > 0) {
          utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
        } else {
          return null;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur par date de création :", error);
        throw error;
      }
    }

    async insertUser(conn) {
      try {
        const query = "INSERT INTO utilisateur (email, mdp, date_inscription, id_utilisateur) VALUES ($1, $2, $3, $4)";
        const values = [this.getMail(), this.getMdp(), this.getDateCreation(), this.getId()];
        await Utilisateur.executeQuery(query, values, conn);
        console.log("Utilisateur inséré avec succès");
      } catch (error) {
        console.error("Erreur lors de l'insertion de l'utilisateur :", error);
        throw error;
      }
    }

    static async updateUserById(id, newMail, newMdp, newDateCreation, conn) {
      try {
        const query = "UPDATE utilisateur SET email = $1, mdp = $2, date_inscription = $3 WHERE id_utilisateur = $4";
        const values = [newMail, newMdp, newDateCreation, id];
        await Utilisateur.executeQuery(query, values, conn);
        console.log("Utilisateur mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur par ID :", error);
        throw error;
      }
    }
  
    static async updateUserByMail(mail, newId, newMdp, newDateCreation, conn) {
      try {
        const query = "UPDATE utilisateur SET id_utilisateur = $1, mdp = $2, date_inscription = $3 WHERE email = $4";
        const values = [newId, newMdp, newDateCreation, mail];
        await Utilisateur.executeQuery(query, values, conn);
        console.log("Utilisateur mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur par mail :", error);
        throw error;
      }
    }
  
    static async updateUserByMdp(mdp, newId, newMail, newDateCreation, conn) {
      try {
        const query = "UPDATE utilisateur SET id_utilisateur = $1, email = $2, date_inscription = $3 WHERE mdp = $4";
        const values = [newId, newMail, newDateCreation, mdp];
        await Utilisateur.executeQuery(query, values, conn);
        console.log("Utilisateur mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur par mot de passe :", error);
        throw error;
      }
    }
  
    static async updateUserByDateCreation(dateCreation, newId, newMail, newMdp, conn) {
      try {
        const query = "UPDATE utilisateur SET id_utilisateur = $1, email = $2, mdp = $3 WHERE date_inscription = $4";
        const values = [newId, newMail, newMdp, dateCreation];
        await Utilisateur.executeQuery(query, values, conn);
        console.log("Utilisateur mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur par date de création :", error);
        throw error;
      }
    }

    // User Temp

      static async getAllUserTemp(conn) {
        let utilisateurs = [];
        try {
            const query = "SELECT * FROM utilisateur_temp";
            const rows = await Utilisateur.executeQuery(query, null, conn);
    
            for (const row of rows) {
                const id = row.id_utilisateur;
                const mail = row.email;
                const mdp = row.mdp;
                const dateCreation = row.date_inscription;
    
                const utilisateur = new Utilisateur(id, mail, mdp, dateCreation);
                utilisateurs.push(utilisateur);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs_temporaire :", error);
            throw error; 
        }
    
        return utilisateurs;
    }

      

    static async getUserTempById(id, conn) {
        let utilisateur;
        try {
          const query = "SELECT * FROM utilisateur_temp WHERE id_utilisateur = $1";
          const rows = await Utilisateur.executeQuery(query, [id], conn);
    
          if (rows.length > 0) {
            utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
          } else {
            utilisateur = null;
          }
    
          return utilisateur;
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          throw error; 
        }
      }


      static async getUserTempByMail(mail, conn) {
        try {
          const query = "SELECT * FROM utilisateur_temp WHERE email = $1";
          const rows = await Utilisateur.executeQuery(query, [mail], conn);
    
          if (rows.length > 0) {
            utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
          } else {
            return null;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur par mail :", error);
          throw error;
        }
      }
    
      static async getUserTempByMdp(mdp, conn) {
        try {
          const query = "SELECT * FROM utilisateur_temp WHERE mdp = $1";
          const rows = await Utilisateur.executeQuery(query, [mdp], conn);
    
          if (rows.length > 0) {
            utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
          } else {
            return null;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur par mot de passe :", error);
          throw error;
        }
      }
    
      static async getUserTempByDateCreation(dateCreation, conn) {
        try {
          const query = "SELECT * FROM utilisateur_temp WHERE date_inscription = $1";
          const rows = await Utilisateur.executeQuery(query, [dateCreation], conn);
    
          if (rows.length > 0) {
            utilisateur = new Utilisateur(rows[0].id_utilisateur, rows[0].email, rows[0].mdp, rows[0].date_inscription);
          } else {
            return null;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur par date de création :", error);
          throw error;
        }
      }

      async insertUserTemp(conn) {
        try {
            const query = "INSERT INTO utilisateur_temp (email, mdp, mdpwh) VALUES ($1, $2, $3) RETURNING id_utilisateur";
            const values = [this.getMail(), this.getMdp(), this.getMdpwh()];
            const result = await Utilisateur.executeQuery(query, values, conn);
            console.log("indro ara"+this.getMdpwh());
            // Récupérer l'ID généré
            const id = result[0].id_utilisateur; 
            this.setId(id); // Si vous avez une méthode pour définir l'ID dans l'objet
            // console.log("Utilisateur_Temp inséré avec succès, ID :", id);
    
            return id; // Retourne l'ID pour utilisation ultérieure
        } catch (error) {
            console.error("Erreur lors de l'insertion de l'utilisateur :", error);
            throw error;
        }
    }
    

      static async updateUserTempteById(id, newMail, newMdp, newDateCreation, conn) {
        try {
          const query = "UPDATE utilisateur_temp SET email = $1, mdp = $2, date_inscription = $3 WHERE id_utilisateur = $4";
          const values = [newMail, newMdp, newDateCreation, id];
          await Utilisateur.executeQuery(query, values, conn);
          console.log("Utilisateur mis à jour avec succès");
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'utilisateur par ID :", error);
          throw error;
        }
      }
    
      static async updateUserTempByMail(mail, newId, newMdp, newDateCreation, conn) {
        try {
          const query = "UPDATE utilisateur_temp SET id_utilisateur = $1, mdp = $2, date_inscription = $3 WHERE email = $4";
          const values = [newId, newMdp, newDateCreation, mail];
          await Utilisateur.executeQuery(query, values, conn);
          console.log("Utilisateur mis à jour avec succès");
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'utilisateur par mail :", error);
          throw error;
        }
      }
    
      static async updateUserTempByMdp(mdp, newId, newMail, newDateCreation, conn) {
        try {
          const query = "UPDATE utilisateur_temp SET id_utilisateur = $1, email = $2, date_inscription = $3 WHERE mdp = $4";
          const values = [newId, newMail, newDateCreation, mdp];
          await Utilisateur.executeQuery(query, values, conn);
          console.log("Utilisateur mis à jour avec succès");
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'utilisateur par mot de passe :", error);
          throw error;
        }
      }
    
      static async updateUserTempByDateCreation(dateCreation, newId, newMail, newMdp, conn) {
        try {
          const query = "UPDATE utilisateur_temp SET id_utilisateur = $1, email = $2, mdp = $3 WHERE date_inscription = $4";
          const values = [newId, newMail, newMdp, dateCreation];
          await Utilisateur.executeQuery(query, values, conn);
          console.log("Utilisateur mis à jour avec succès");
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'utilisateur par date de création :", error);
          throw error;
        }
      }

      static async truncateUserTemp(conn) {
        try {
            const query = "truncate table utilisateur_temp";
            const rows = await Utilisateur.executeQuery(query, null, conn);
            console.log("Utilisateur truncate avec succès");
        } catch (error) {
            console.error("Erreur lors de la truncation de l'user Temporaire :", error);
            throw error; 
        }
    }

      static async transfertDonnees(idUserTemp, role, connection) {
        try {
          const query = "INSERT INTO utilisateur (id_utilisateur, date_inscription, email, mdp) SELECT id_utilisateur, date_inscription, email, mdp FROM utilisateur_temp WHERE id_utilisateur = $1 RETURNING id_utilisateur";
          const values = [idUserTemp];
          const result = await Utilisateur.executeQuery(query, values, connection);
          const idUtilisateur = result[0].id_utilisateur;

          const queryFirebase = "SELECT email, mdpwh FROM utilisateur_temp WHERE id_utilisateur = $1";
          const rowsFirebase = await Utilisateur.executeQuery(queryFirebase, values, connection);
    
          var emailFirebase;
          var mdpFirebase;
          if (rowsFirebase.length > 0) {
            emailFirebase=rowsFirebase[0].email;
            mdpFirebase=rowsFirebase[0].mdpwh;
            console.log(emailFirebase+mdpFirebase);

            const userRecord = await admin.auth().createUser({
              email: emailFirebase,
              password: mdpFirebase,
            });
            console.log("Utilisateur Firebase créé avec succès :", userRecord.uid);

             const db = admin.firestore();
              const userRef = db.collection('soldeusers').doc(emailFirebase); // Utiliser l'email comme ID du document
              await userRef.set({
                email: emailFirebase,
                solde: 0 // Solde initial à 0
              });
          } 

          const queryRole = "INSERT INTO utilisateur_role (id_utilisateur, id_role) VALUES ($1, (select id_role from role where nom_role=$2) )";
          const valuesRole = [idUtilisateur, role];
          await Utilisateur.executeQuery(queryRole, valuesRole, connection);

          const queryDelete = "delete from utilisateur_temp where id_utilisateur=$1";
          const valuesDelete = [idUserTemp];
          await Utilisateur.executeQuery(queryDelete, valuesDelete, connection);

          console.log("Utilisateur verifie, et inscrit");
        } catch (error) {
          console.error("Erreur lors de la verification de l'utilisateur: ", error);
          throw error;
        }
      }

}
module.exports = Utilisateur;