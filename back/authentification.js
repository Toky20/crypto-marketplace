const Connection = require('./connection.js');
const express = require('express');
const Login = require('./login');
const UserAttempt = require('./user_attempt.js');
const Util = require('./util.js');
const MailSender = require('./mailsender.js');
const Utilisateur = require('./user.js');
const PinUtilisateur = require('./pin_utilisateur.js');
const HtmlGenerator = require('./htmlGenerator.js');
const SendMail = require('./sendMail.js');

class Authentication {
    static async processAuthentication(email, password) {
        const maxAttempt = Util.getMaxAttempts();
        const userAttempt = new UserAttempt();

        // Étape 1 : Vérification de l'email
        const emailVerification = await Login.verifyEmail(email);
        if (emailVerification.status !== "success") {
            return emailVerification; // Email non trouvé ou erreur
        }

        // Étape 2 : Récupération et comparaison du mot de passe
        try {
            const currentAttempts = await userAttempt.getUserAttempt(email);
            if (!currentAttempts) {
                await userAttempt.insertOrUpdateUserAttempt(email, maxAttempt, false);
            }

            const isPasswordCorrect = await Login.comparePassword(email, password);
            

            // Gestion des tentatives restantes
            if (currentAttempts.isLocked) {
                return {
                    status: "error",
                    code: 403,
                    message: "Votre compte est verrouillé. Réinitialisez vos tentatives.",
                    remainingAttempts: 0,
                    error: {
                        message: "Votre compte a été verrouillé en raison de tentatives de connexion échouées.",
                        details: {
                            error_message: "Votre compte est temporairement verrouillé. Veuillez réinitialiser vos tentatives de connexion.",
                            suggestions: [
                                "Vérifiez vos identifiants.",
                                "Attendez quelques minutes avant d'essayer à nouveau.",
                                "Si vous ne parvenez pas à vous reconnecter, réinitialisez votre mot de passe depuis le mail que nous vous avons renvoyé."
                            ]
                        }
                    }
                };
                
            }

            if (isPasswordCorrect) {
                await userAttempt.insertOrUpdateUserAttempt(email, maxAttempt, false);

                const pool = await Connection.getConnectionPostgres();

                const userResult = await Utilisateur.getUserByMail(email,pool);
                const pinInstance = new PinUtilisateur(undefined,userResult.getId(),undefined,undefined,undefined);
                await pinInstance.insertPinUtilisateur(pool);
                const pinHtml = await HtmlGenerator.pinGenerator(pinInstance.getPin(), pinInstance.getDate_fin());

                await SendMail.reelSend(email, 'URL', pinHtml);
                return {  status : 'succes',
                            code: 200,
                            error:null,
                            message: "PIN sent successfully, dans le cas ou l'email ne vous appartient pas le PIN genere est "+pinInstance.getPin(),
                            data:null};
            }

            if (currentAttempts.nbTentative > 0) {
                await userAttempt.insertOrUpdateUserAttempt(email, currentAttempts.nbTentative - 1, currentAttempts.isLocked);
                return {
                    status: "error",
                    code: 401,
                    message: "Mot de passe incorrect.",
                    remainingAttempts: currentAttempts.nbTentative - 1,
                    error: {
                        message: "Le mot de passe fourni ne correspond pas à celui enregistré.",
                        details: {
                            error_message: "Le mot de passe fourni ne correspond pas à celui enregistré.",
                            suggestions: [
                                "Vérifiez vos identifiants."
                            ]
                        }
                    }
                };
                
            } else {
                await userAttempt.insertOrUpdateUserAttempt(email, 0, true);
                const resetLink = `http://localhost:3000/reset-attempts?email=${encodeURIComponent(email)}`;
                const mailSender = new MailSender();
                const subject = "Votre compte a été verrouillé";
                const message = `
                    <p>Bonjour,</p>
                    <p>Votre compte a été verrouillé après plusieurs tentatives infructueuses de connexion.</p>
                    <p>Pour réinitialiser vos tentatives de connexion, veuillez cliquer sur le lien suivant :</p>
                    <p>Lien pour reinitialiser votre nombre de tentative : ${resetLink}</p>
                    <p>Rajuster les details de votre mail dans le naviguateur </p>
                `;
                mailSender.sendMail(email, subject, message);
                return {
                    status: "error",
                    code: 401,
                    message: "Votre compte a été verrouillé. Un email a été envoyé.",
                    remainingAttempts: 0,
                    error: {
                        message: "Votre compte a été verrouillé en raison de tentatives de connexion échouées.",
                        details: {
                            error_message: "Votre compte est temporairement verrouillé. Un email a été envoyé pour réinitialiser votre mot de passe.",
                            suggestions: [
                                "Vérifiez votre boîte de réception pour un email de réinitialisation.",
                                "Si vous n'avez pas reçu d'email, vérifiez votre dossier de spam.",
                                "Si vous avez besoin d'assistance, contactez notre support."
                            ]
                        }
                    }
                };
                
            }


        } catch (error) {
            return {
                status: "error",
                code: 500,
                message: "Erreur interne lors de l'authentification.",
                details: {
                    error_message: error.message,
                    suggestions: [
                        "Veuillez réessayer plus tard.",
                        "Si le problème persiste, contactez notre support technique."
                    ]
                }
            };
            
        }
    }
}

module.exports = Authentication;
