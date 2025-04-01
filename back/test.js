const Connection = require('./connection.js');
const express = require('express');
const Login = require('./login');
const UserAttempt = require('./user_attempt.js');
const Util = require('./util.js');
const MailSender = require('./mailsender.js');
const Authentification = require('./authentification.js');
const GestionCompte = require('./gestioncompte.js');
const crypto = require('crypto');


// async function insertData() {
//     const pool = await Connection.getConnectionPostgres();

//     if (!pool) {
//         console.error("Impossible de se connecter à la base de données.");
//         return;
//     }

//     try {
//         // Requête SQL pour insérer des données dans la table `utilisateur`
//         const query = `
//             INSERT INTO utilisateur (date_inscription, email, mdp)
//             VALUES (NOW(), 'vony@example.com', '1234')
//         `;

//         // Exécution de la requête
//         const result = await pool.query(query);

//         console.log("Données insérées avec succès !");
//     } catch (error) {
//         console.error("Erreur lors de l'insertion des données :", error.message);
//     } finally {
//         // Fermer la connexion
//         pool.end();
//     }
// }


const app = express();
app.use(express.json());

// Route POST pour vérifier l'email
app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    const response = await Login.verifyEmail(email);
    res.status(response.code).json(response);
});

app.post('/get-password', async (req, res) => {
    const { email } = req.body;
    const response = await Login.getPasswordByEmail(email);

    res.status(response.code).json(response);
});


app.post('/compare-password', async (req, res) => {
    const { email, password } = req.body;
    const maxAttempt = Util.getMaxAttempts();
    console.log("nombre max de tentative : " + maxAttempt);
    
    const userAttempt = new UserAttempt();

    
    try {
        const currentAttempts = await userAttempt.getUserAttempt(email);     
      
        if (!currentAttempts) {
            console.log("utilisateur non trouve");
            await userAttempt.insertOrUpdateUserAttempt(email, maxAttempt, false);
            console.log("Nouvel utilisateur, initialisation des tentatives.");
        }

        const isPasswordCorrect = await Login.comparePassword(email, password); // Vérifie le mot de passe
        if (isPasswordCorrect) {
            // Si le mot de passe est correct, renvoyer une réponse de succès
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Connexion réussie.'
            });
        } else {
            // Si le mot de passe est incorrect, récupérer les tentatives actuelles et gérer le verrouillage
            const currentAttempts = await userAttempt.getUserAttempt(email);

            if (currentAttempts.isLocked) {
                return res.status(403).json({
                    status: 'error',
                    code: 403,
                    message: 'Votre compte est verrouillé en raison de trop nombreuses tentatives infructueuses.',
                    remainingAttempts: 0 // Ajout du nombre de tentatives restantes (0 ici car verrouillé)
                });
            }

            // Si le mot de passe est incorrect, décrémenter les tentatives restantes et renvoyer une réponse
            if (currentAttempts.nbTentative > 0) {
                await userAttempt.insertOrUpdateUserAttempt(email, currentAttempts.nbTentative - 1, currentAttempts.isLocked);
                return res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Mot de passe incorrect.',
                    remainingAttempts: currentAttempts.nbTentative - 1, // Nombre de tentatives restantes
                    error: {
                        message: 'Le mot de passe fourni ne correspond pas à celui enregistré.',
                        details: {
                            error_message: 'Le mot de passe fourni ne correspond pas à celui enregistré.',
                            suggestions: [
                                'Vérifiez vos identifiants.',
                                'Essayez de réinitialiser votre mot de passe.'
                            ]
                        }
                    }
                });
            } else {
                await userAttempt.insertOrUpdateUserAttempt(email, 0, true); 
                const resetLink = `http://localhost:3000/reset-attempts?email=${encodeURIComponent(email)}`;
            
                const mailSender = new MailSender();
                // Envoi de l'email avec le lien
                const subject = 'Votre compte a été verrouillé';
                const message = `
                    <p>Bonjour,</p>
                    <p>Votre compte a été verrouillé après plusieurs tentatives infructueuses de connexion.</p>
                    <p>Pour réinitialiser vos tentatives de connexion, veuillez cliquer sur le lien suivant :</p>
                    <p>Lien pour reinitialiser votre nombre de tentative : ${resetLink}</p>
                    <p>Rajuster les details de votre mail dans le naviguateur </p>
                `;
                console.log("vous allez recevoir un mail");
                
                mailSender.sendMail(email, subject, message); // Envoyer l'email avec le lien
            
                console.log("mail envoyé avec succes");
                
                return res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Mot de passe incorrect. Votre compte a été verrouillé après plusieurs tentatives infructueuses. Nous vous envoyons un email pour réinitialiser le nombre de tentatives.',
                    remainingAttempts: 0 // Aucun essai restant après le verrouillage
                });
            }
            
        }
    } catch (error) {
        console.error('Error during password comparison:', error.message);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Une erreur est survenue lors de la comparaison du mot de passe.'
        });
    }
});



app.get('/reset-attempts', async (req, res) => {
    const { email } = req.query; // Récupérer l'email depuis le query param
    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'L\'email est requis pour réinitialiser les tentatives.'
        });
    }

    try {
        const userAttempt = new UserAttempt();
        const currentAttempts = await userAttempt.getUserAttempt(email);
        if (currentAttempts.isLocked) {
            const maxAttempts = Util.getMaxAttempts();
            await userAttempt.insertOrUpdateUserAttempt(email, maxAttempts, false);
            return res.status(200).json({
                status: 'success',
                message: `Vos tentatives ont été réinitialisées avec succès à ${maxAttempts} tentatives. Vous pouvez maintenant essayer de vous reconnecter.`
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Aucun compte verrouillé trouvé avec cet email.'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation des tentatives:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Une erreur est survenue lors de la réinitialisation des tentatives.'
        });
    }
});

app.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    const response = await Authentification.processAuthentication(email, password);

    res.status(response.code).json(response);
});


async function testPassword() {
    const email = 'vony@example.com';
    const providedPassword = 'nouveauMotDePasse123'; // Changez le mot de passe pour tester

    const isPasswordCorrect = await Login.comparePassword(email, providedPassword);
    if (isPasswordCorrect) {
        console.log('Le mot de passe est correct.');
    } else {
        console.log('Le mot de passe est incorrect.');
    }
}

testPassword();

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

