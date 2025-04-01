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
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.ListeTransaction;

/**
 *
 * @author Toky
 */
@WebServlet(name = "ListeTransactionServlet", urlPatterns = {"/admin/ListeTransactionServlet"})
public class ListeTransactionServlet extends HttpServlet {
    
    static String pageUrl="/pages/admin/transaction/transaction-liste.jsp";

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
        Connection connection = null;
        List<ListeTransaction> transactions = new ArrayList<>();
        try {
            connection = new Connexion().getConnection(); // Get a connection from pool
            transactions = ListeTransaction.getAll(connection);
        } catch (SQLException e) {
            e.printStackTrace();
            // Handle database errors gracefully (e.g., display a generic error message)
            request.setAttribute("errorMessage", "An error occurred while searching transactions. Please try again later.");
        } finally {
            try {
                connection.close();
            } catch (SQLException ex) {
                System.out.println(ex);
            }
        }

        request.setAttribute("transactions", transactions); // Set transactions for JSP
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

        String utilisateur = request.getParameter("utilisateur");
        String cryptomonnaie = request.getParameter("cryptomonnaie");
        String typeTransaction = request.getParameter("typeTransaction");
        String orderBy = request.getParameter("orderBy"); // Optional ordering
        String ascOrDesc = request.getParameter("ascOrDesc");
        
        request.setAttribute("utilisateur", utilisateur);
        request.setAttribute("cryptomonnaie", cryptomonnaie);
        request.setAttribute("typeTransaction", typeTransaction);
        request.setAttribute("orderBy", orderBy);
        request.setAttribute("ascOrDesc", ascOrDesc);

        // Convert date strings to Timestamps (handle potential parsing errors)
        Date dateDebut = null;
        Date dateFin = null;
        try {
            String dateDebutStr = request.getParameter("dateDebut");
            System.out.println(dateDebutStr);
            if (dateDebutStr != null && !dateDebutStr.isEmpty()) {
                dateDebut = Date.valueOf(dateDebutStr);
                request.setAttribute("dateDebut", dateDebut);
            }
            String dateFinStr = request.getParameter("dateFin");
            if (dateFinStr != null && !dateFinStr.isEmpty()) {
                dateFin = Date.valueOf(dateFinStr);
                request.setAttribute("dateFin", dateFin);
            }
        } catch (IllegalArgumentException e) {
            // Handle invalid date format (e.g., display an error message)
            request.setAttribute("errorMessage", "Invalid date format. Please use YYYY-MM-DD format.");
        }

        Connection connection = null;
        List<ListeTransaction> transactions = new ArrayList<>();
        try {
            connection = new Connexion().getConnection(); // Get a connection from pool
            transactions = ListeTransaction.search(connection, utilisateur, dateDebut, dateFin, cryptomonnaie, typeTransaction, orderBy, ascOrDesc);
        } catch (SQLException e) {
            e.printStackTrace();
            // Handle database errors gracefully (e.g., display a generic error message)
            request.setAttribute("errorMessage", "An error occurred while searching transactions. Please try again later.");
        } finally {
            try {
                connection.close();
            } catch (SQLException ex) {
                System.out.println(ex);
            }
        }

        request.setAttribute("transactions", transactions); // Set transactions for JSP
        RequestDispatcher dispatcher = request.getRequestDispatcher(pageUrl);
        dispatcher.forward(request, response);
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
