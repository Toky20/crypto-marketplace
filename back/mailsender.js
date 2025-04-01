const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        // Configuration du transporteur
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'projetcloud2024@gmail.com',
                pass: 'pvmq hsvv vbha mafv' // Remarque : Évitez de stocker des informations sensibles en clair dans le code.
            }
        });
    }

    // Fonction pour envoyer un email avec gestion d'erreurs
    sendMail(to, subject, message) {
        this.transporter.sendMail({
            from: 'projetcloud2024@gmail.com', // Adresse expéditrice
            to: to, // Destinataire
            subject: subject, // Sujet
            html: message // Contenu en HTML
        }, (err, info) => {
            if (err) {
                console.error("Erreur lors de l'envoi de l'email :", err.message);
            } else {
                console.log("Email envoyé avec succès :", info.response);
            }
        });
    }
}

module.exports = MailSender;
