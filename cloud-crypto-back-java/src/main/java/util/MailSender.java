/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class MailSender {
    static String htmlContent="text/html; charset=utf-8";
    static String textPlainContent="text/plain";
    public static void main(String[] args) {
        MailSender sender = new MailSender();
        
        // Remplacez les valeurs par vos informations
        String recipient = "tokisword@gmail.com";
        String subject = "Test d'envoi d'email depuis Java";
        String body = "";

        sender.sendEmail(recipient, subject, body);
    }
    
    private Session session;

    public MailSender() {
        // Configuration des propriétés du serveur SMTP
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        //props.put("mail.smtp.socketFactory.port", "465");

        //props.put("mail.smtp.host", System.getenv("EMAIL_HOST"));
        //props.put("mail.smtp.socketFactory.port", System.getenv("EMAIL_PORT"));
        //props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        //props.put("mail.smtp.port", "465");
        props.put("mail.smtp.port", "587");

        props.put("mail.smtp.ssl.protocols", "TLSv1.2"); // Force TLSv1.2
        //props.put("mail.debug", "true"); // Enable debugging


        // Authentification
        Session session = Session.getDefaultInstance(props,
                new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication("projetcloud2024@gmail.com", "pvmq hsvv vbha mafv");
                    }
                });
        this.session = session;
    }

    // Méthode pour envoyer un email
    public void sendEmail(String recipient, String subject, String body) {
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("projetcloud2024@gmail.com"));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(recipient));
            message.setSubject(subject);
            message.setContent(body, htmlContent);

            Transport.send(message);
            System.out.println("Email envoyé avec succès");
        } catch (MessagingException e) {
            System.out.println("Erreur lors de l'envoi de l'email: " + e);
            e.printStackTrace();
        }
    }
}
