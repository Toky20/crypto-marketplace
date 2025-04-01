class HtmlGenerator {
    constructor() {}

    static async inscriptionGenerator(apiLink) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Inscription</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Merci de vouloir vous inscrire</h2>
                <p style="color: #555; font-size: 16px;">
                    Copiez le lien ci-dessous et exécutez-le dans Postman (méthode POST) pour finaliser votre inscription pour activer votre compte avec un role de client:
                </p>
                <p style="word-break: break-all; color: #007BFF; font-size: 14px;">${apiLink}&role=Client</p>
                
                <p style="color: #555; font-size: 16px;">
                    Copiez le lien ci-dessous et exécutez-le dans Postman (méthode POST) pour finaliser votre inscription pour activer votre compte avec un role d'administrateur:
                </p>
                <p style="word-break: break-all; color: #007BFF; font-size: 14px;">${apiLink}&role=Administrateur</p>
            
            </div>
        </body>
        </html>
        `;
    }

    static async pinGenerator(pin, date_fin) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification PIN</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Your Verification PIN</h2>
                <p style="color: #555; font-size: 16px;">
                    Your PIN is: <strong style="color: #007BFF;">${pin}</strong>
                </p>
                <p style="color: #555; font-size: 16px;">
                    It is valid until: <strong>${date_fin}</strong>
                </p>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = HtmlGenerator;
