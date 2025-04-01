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
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Toky
 */
@WebServlet(name = "InscriptionServlet", urlPatterns = {"/InscriptionServlet"})
public class InscriptionServlet extends HttpServlet {

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
        response.sendRedirect("pages/inscription.jsp");
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
        String url = "http://localhost:3000/createUserTemp"; 
        
        String email = request.getParameter("mail");
        String motDePasse = request.getParameter("motDePasse");

        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // Configurer la requête
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");

        // Données à envoyer dans le corps de la requête
        String data = "{\"mail\": \""+email+"\", \"mdp\": \""+motDePasse+"\"}";

        // Envoyer les données
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(data);
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
