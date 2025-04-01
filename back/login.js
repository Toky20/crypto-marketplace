const Connection = require('./connection.js');
const crypto = require('crypto');


class Login {
    // Méthode pour vérifier l'email
    static async verifyEmail(email) {
        if (!email) {
            return {
                status: "error",
                code: 400,
                message: "L'email est requis.",
                error: {
                    message: "L'email est requis.",
                    details: {
                        error_message: "Aucun email fourni.",
                        suggestions: ["Inclure un champ 'email' dans le corps de la requête."]
                    }
                }
            };
        }

        const pool = await Connection.getConnectionPostgres();

        if (!pool) {
            return {
                status: "error",
                code: 500,
                message: "Erreur de connexion à la base de données.",
                error: {
                    message: "Erreur de connexion à la base de données.",
                    details: {
                        error_message: "Impossible de se connecter à PostgreSQL.",
                        suggestions: ["Vérifiez les informations de connexion au serveur PostgreSQL."]
                    }
                }
            };
        }

        try {
            const query = 'SELECT email FROM utilisateur WHERE email = $1';
            const values = [email];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                // Email non trouvé
                return {
                    status: "error",
                    code: 404,
                    message: "Email introuvable.",
                    error: {
                        message: "Email introuvable.",
                        details: {
                            error_message: `L'email '${email}' n'existe pas dans la base de données.`,
                            suggestions: ["Vérifiez que l'email est correct.", "Créez un utilisateur avec cet email."]
                        }
                    }
                };
            }

            // Email trouvé
            return {
                status: "success",
                code: 200,
                data: {
                    email: result.rows[0].email
                }
            };
        } catch (error) {
            // Erreur lors de la requête SQL
            return {
                status: "error",
                code: 500,
                message: "Erreur lors de la vérification de l'email.",
                error: {
                    message: "Erreur lors de la vérification de l'email.",
                    details: {
                        error_message: error.message,
                        suggestions: ["Vérifiez la syntaxe de la requête SQL.", "Vérifiez la structure de la table 'utilisateur'."]
                    }
                }
            };
        } finally {
            pool.end(); // Fermer la connexion
        }
    }

    static async getPasswordByEmail(email) {
        if (!email) {
            return {
                status: "error",
                code: 400,
                error: {
                    message: "L'email est requis.",
                    details: {
                        error_message: "Aucun email fourni.",
                        suggestions: ["Inclure un champ 'email' dans le corps de la requête."]
                    }
                }
            };
        }

        const pool = await Connection.getConnectionPostgres();

        if (!pool) {
            return {
                status: "error",
                code: 500,
                error: {
                    message: "Erreur de connexion à la base de données.",
                    details: {
                        error_message: "Impossible de se connecter à PostgreSQL.",
                        suggestions: ["Vérifiez les informations de connexion au serveur PostgreSQL."]
                    }
                }
            };
        }

        try {
            const query = 'SELECT mdp FROM utilisateur WHERE email = $1';
            const values = [email];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return {
                    status: "error",
                    code: 404,
                    error: {
                        message: "Email introuvable.",
                        details: {
                            error_message: `L'email '${email}' n'existe pas dans la base de données.`,
                            suggestions: ["Vérifiez que l'email est correct.", "Créez un utilisateur avec cet email."]
                        }
                    }
                };
            }

            return {
                status: "success",
                code: 200,
                data: {
                    email: email,
                    password: result.rows[0].mdp
                }
            };
        } catch (error) {
            return {
                status: "error",
                code: 500,
                error: {
                    message: "Erreur lors de la récupération du mot de passe.",
                    details: {
                        error_message: error.message,
                        suggestions: ["Vérifiez la syntaxe de la requête SQL.", "Vérifiez la structure de la table 'utilisateur'."]
                    }
                }
            };
        } finally {
            pool.end();
        }
    }


    // static async comparePassword(email, providedPassword) {
    //     const response = await this.getPasswordByEmail(email);
    
    //     if (response.status !== "success") {
    //         return false; // Retourne false si l'email n'existe pas ou en cas de problème
    //     }
    
    //     const storedPassword = response.data.password;
    //     if (providedPassword !== storedPassword) {
    //         return false; // Retourne false si le mot de passe ne correspond pas
    //     }
    
    //     return true; // Retourne true si le mot de passe est correct
    // }

static async comparePassword(email, providedPassword) {
    const response = await this.getPasswordByEmail(email);

    if (response.status !== "success") {
        return false; 
    }

    const storedPasswordHash = response.data.password;
    const hashedProvidedPassword = crypto.createHash('md5').update(providedPassword).digest('hex');

    if (hashedProvidedPassword !== storedPasswordHash) {
        return false;
    }
    return true; 
}

 
}

module.exports = Login;
