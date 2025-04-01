/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.List;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.EvolutionWallet;

/**
 *
 * @author itu
 */
@WebServlet(name = "EvolutionWalletServlet", urlPatterns = {"/EvolutionWalletServlet"})
public class EvolutionWalletServlet extends HttpServlet {

    

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
        try {
            // Récupération des paramètres
            String dateMinStr = request.getParameter("dateMin");
            String dateMaxStr = request.getParameter("dateMax");

            // Validation des dates
            if (dateMinStr == null || dateMaxStr == null || dateMinStr.isEmpty() || dateMaxStr.isEmpty()) {
                throw new IllegalArgumentException("Dates manquantes");
            }

            // Conversion en java.sql.Date
            Date dateMin = Date.valueOf(dateMinStr);
            Date dateMax = Date.valueOf(dateMaxStr);

            // Appel de la méthode
            List<EvolutionWallet> wallets = new EvolutionWallet().getEvolutionByDateRange(dateMin, dateMax);

            request.setAttribute("wallets", wallets);
            RequestDispatcher dispatcher = request.getRequestDispatcher("pages/admin/portefeuille/suivie.jsp");
            dispatcher.forward(request, response);

        } catch (IllegalArgumentException e) {
            request.setAttribute("error", "Format de date invalide (yyyy-MM-dd requis)");
            RequestDispatcher dispatcher = request.getRequestDispatcher("pages/admin/portefeuille/suivie.jsp");
            dispatcher.forward(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
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
