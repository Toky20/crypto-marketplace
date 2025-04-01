const nodemailer = require('nodemailer');

class SendMail {
    constructor(email = 'projetcloud2024@gmail.com', password = 'pvmq hsvv vbha mafv') {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Utilisation de Gmail
            auth: {
                user: email, // Votre adresse e-mail
                pass: password, // Votre mot de passe ou mot de passe d'application
            },
        });
    }

    async send(to, subject, text) {
        const mailOptions = {
            from: this.transporter.options.auth.user, // Expéditeur
            to: to, // Destinataire
            subject: subject, // Sujet
            html: text, // Contenu du message
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-mail envoyé :', info.response);
            return info;
        } catch (error) {
            console.error('Erreur lors de l\'envoi :', error);
            throw error;
        }
    }

    static async reelSend(email, sujet, message){
        // Créer une instance de SendMail
        const mailer = new SendMail();

        // Appel de la méthode `send` pour envoyer un e-mail
        mailer
            .send(email, sujet, message)
            .then((info) => {
                console.log('Succès :', info);
            })
            .catch((error) => {
                console.error('Erreur :', error);
            });

        }
    }

module.exports = SendMail;
