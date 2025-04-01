const md5 = require('md5');
const Connection = require('./connection.js');
const Utilisateur = require('./user.js');
const SendMail = require('./sendMail.js'); 
const PinUtilisateur = require('./pin_utilisateur.js'); 

class Main {
    static async main() {
        const connection  = await Connection.getConnectionPostgres();
        // await Inscription.getBlocTest(connection);
        // const u = await Utilisateur.getAllUserTemp(connection);
        // // const idUserTemp = u.getId();
        // console.log(u[0].getId());

        // await Utilisateur.transfertDonnees(idUserTemp, connection);
        // console.log(u);
        
        // await Utilisateur.transfertDonnees(1, connection);
        // const u = new Utilisateur(undefined, 'john.doe@example.com', 'ok', undefined);
        // await u.insertUserTemp(connection);
        // console.log(u.getMdp());
        // test Simple 
        // const pool = await Connection.getConnectionPostgres();
        // const result = await pool.query('SELECT * FROM bloc');
        // console.log(result.rows);

        // const email = 'projetcloud2024@gmail.com';
        // const password = 'pvmq hsvv vbha mafv';

        // // Créer une instance de SendMail
        // const mailer = new SendMail();

        // // Appel de la méthode `send` pour envoyer un e-mail
        // mailer
        //     .send('rabenaivolucas@gmail.com', 'Sujet de l\'e-mail', 'Ceci est un test d\'envoi d\'e-mail.')
        //     .then((info) => {
        //         console.log('Succès :', info);
        //     })
        //     .catch((error) => {
        //         console.error('Erreur :', error);
        //     });
        // await SendMail.reelSend('rabenaivolucas@gmail.com');
        // await SendMail.reelSend();
        }
}

Main.main();