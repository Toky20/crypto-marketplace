/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package admin.controller;

import acces.Connexion;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.CryptoTransaction;
import model.Utilisateur;

/**
 *
 * @author Toky
 */
@WebServlet(name = "AdminTransactionCryptoServlet", urlPatterns = {"/admin/AdminTransactionCryptoServlet"})
public class AdminTransactionCryptoServlet extends HttpServlet {
    
     static String pageUrl="/pages/admin/crypto/crypto-interface.jsp";

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
        System.out.println("coucou");
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
        String action = request.getParameter("action");
        HttpSession session = request.getSession();
        Utilisateur utilisateur = (Utilisateur) session.getAttribute("utilisateur");
        int idUtilisateur = utilisateur.getIdUtilisateur();
        System.out.println("id mahagaga"+idUtilisateur);
        String idCrypto = request.getParameter("idCrypto");
        double quantite = Double.parseDouble(request.getParameter("quantite"));
        double prixUnitaire = Double.parseDouble(request.getParameter("prixUnitaire"));
        double commission = Double.parseDouble(request.getParameter("commission"));

        Connection conn;
        CryptoTransaction transaction = null;
         try {
             conn = new Connexion().getConnection();
              transaction =new CryptoTransaction(conn);
         } catch (SQLException ex) {
             ex.printStackTrace();
         }
         // Assurez-vous d'initialiser la connexion à la base de données

        try {
            switch (action) {
                case "acheter":
                    transaction.insererAchat(idUtilisateur, idCrypto, quantite, prixUnitaire, commission);
                    break;
                case "vendre":
                    transaction.insererVente(idUtilisateur, idCrypto, quantite, prixUnitaire, commission);
                    break;
                default:
                    // Gestion d'une action inconnue
                    break;
            }
            response.getWriter().println("Transaction effectuée avec succès");
        } catch (SQLException e) {
            // Gestion des erreurs
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        } catch (InterruptedException ex) {
             Logger.getLogger(AdminTransactionCryptoServlet.class.getName()).log(Level.SEVERE, null, ex);
         } catch (ExecutionException ex) {
             Logger.getLogger(AdminTransactionCryptoServlet.class.getName()).log(Level.SEVERE, null, ex);
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
