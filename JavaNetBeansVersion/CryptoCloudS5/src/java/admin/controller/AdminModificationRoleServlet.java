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
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Utilisateur;

/**
 *
 * @author Toky
 */
@WebServlet(name = "AdminModificationRoleServlet", urlPatterns = {"/admin/AdminModificationRoleServlet"})
public class AdminModificationRoleServlet extends HttpServlet {


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
        RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/admin/profil/profil-modification-role.jsp");
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
        int idUtilisateur = utilisateur.getIdUtilisateur();
        utilisateur.setIdUtilisateur(idUtilisateur);
        // Récupération des paramètres depuis la requête
        int idRole = Integer.parseInt(request.getParameter("idRole"));


        try (Connection connection = new Connexion().getConnection()) {
            utilisateur.updateRole(connection, idRole);

            // Créer la réponse JSON
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("code", 200);
            // Envoyer la réponse JSON
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.print(new Gson().toJson(responseBody));
            out.flush();
        } catch (SQLException e) {
            // Gestion des erreurs
            e.printStackTrace();
            // Redirection vers une page d'erreur ou affichage d'un message d'erreur
            response.sendRedirect("erreurModificationRole.jsp");
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
