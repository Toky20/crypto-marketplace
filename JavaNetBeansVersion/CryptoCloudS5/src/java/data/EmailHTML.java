/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

/**
 *
 * @author Toky
 */
public class EmailHTML {
    public static String confirmationTransactionEmail(String contextPath,String idTransac) {
        return "<!DOCTYPE html>\n" +
"        <html lang=\"en\">\n" +
"        <head>\n" +
"            <meta charset=\"UTF-8\">\n" +
"            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
"            <title>Inscription</title>\n" +
"        </head>\n" +
"        <body style=\"font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; text-align: center;\">\n" +
"            <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\">\n" +
"                <h2 style=\"color: #333;\">Merci de valider la transaction</h2>\n" +
"                <p style=\"color: #555; font-size: 16px;\">\n" +
"                    Copiez le lien ci-dessous et exécutez-le dans Postman (méthode GET/POST) pour valider votre transaction:\n" +
"                </p>\n" +
"                <p style=\"word-break: break-all; color: #007BFF; font-size: 14px;\">"+contextPath+"?id="+idTransac+"</p>\n" +
"                \n" +
"            </div>\n" +
"        </body>\n" +
"        </html>";
    }
}
