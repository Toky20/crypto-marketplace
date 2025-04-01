/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package admin.controller;

import acces.Connexion;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.MouvementFiatWallet;
import model.Utilisateur;

/**
 *
 * @author Toky
 */
@WebServlet(name = "AdminMouvementFiatWalletServlet", urlPatterns = {"/admin/AdminMouvementFiatWalletServlet"})
public class AdminMouvementFiatWalletServlet extends HttpServlet {
    
    static String pageUrl="/pages/admin/mouvementfiatwallet/mouvementfiatwallet-saisie.jsp";

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
       
            RequestDispatcher dispatcher = request.getRequestDispatcher(pageUrl);
            dispatcher.forward(request, response);
        
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
        HttpSession session = request.getSession();
        Utilisateur utilisateur = (Utilisateur) session.getAttribute("utilisateur");
        String action = request.getParameter("action");
        double montant = new Double(request.getParameter("montant"));
        int idUtilisateur = utilisateur.getIdUtilisateur(); // Récupérer l'ID de l'utilisateur en session
        String email = utilisateur.getEmail();
        
        MouvementFiatWallet mouvement = new MouvementFiatWallet();
        mouvement.setId_utilisateur(idUtilisateur);
        if ("depot".equals(action)) {
            mouvement.setDepot(montant);
            mouvement.setRetrait(0);
        } else {
            mouvement.setDepot(0);
            mouvement.setRetrait(montant);
        }

        try (Connection conn = new Connexion().getConnection()) {
            mouvement.insert(conn);
            // Créer la réponse JSON
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("code", 200);
            responseBody.put("success", true); // Mettre à false en cas d'erreur
            responseBody.put("message", "Mouvement effectué avec succès, en attente d'un admin pour valider la transaction");

            // Envoyer la réponse JSON
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.print(new Gson().toJson(responseBody));
            out.flush();
        } catch (SQLException e) {
            // Gérer l'exception
            e.printStackTrace();
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
