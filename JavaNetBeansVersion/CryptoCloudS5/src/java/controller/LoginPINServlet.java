/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Toky
 */
@WebServlet(name = "LoginPINServlet", urlPatterns = {"/LoginPINServlet"})
public class LoginPINServlet extends HttpServlet {

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("mail");
        
        // Vérification si l'email est non vide et non null
        if (email != null && !email.isEmpty()) {
            // Email valide, on stocke l'email dans un attribut de la requête
            request.setAttribute("email", email);

            // On redirige vers loginPIN.jsp
            RequestDispatcher dispatcher = request.getRequestDispatcher("pages/loginPIN.jsp");
            dispatcher.forward(request, response);
        } else {
            // Email invalide, on redirige vers une autre page
            response.sendRedirect("pages/login.jsp");
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        
        String email = request.getParameter("mail");
        String PIN = request.getParameter("PIN");
        
        String url = "http://localhost:3000/verifyPin?mail_user="+email+"&pin="+PIN; 

        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // Configurer la requête
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");

        // Envoyer les données
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes("");
        wr.flush();
        wr.close();
        
        int responseCode = con.getResponseCode(); 
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
            new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder responseServer = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            responseServer.append(inputLine);
        }
        in.close();

        // Get the response string
        String serverResponse = responseServer.toString();

       
        response.setContentType("application/json");
        response.getWriter().write(serverResponse);
    }
}
