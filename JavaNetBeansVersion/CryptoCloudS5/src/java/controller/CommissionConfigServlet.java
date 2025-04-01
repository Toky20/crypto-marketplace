/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import javax.servlet.annotation.WebServlet;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.HashMap;
import model.CommissionConfig;

/**
 *
 * @author Toky
 */
@WebServlet(name = "CommissionConfigServlet", urlPatterns = {"/CommissionConfigServlet"})
public class CommissionConfigServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Récupérer la commission depuis la base de données
        String format = request.getParameter("format");
        
        if ("json".equals(format)) {
            CommissionConfig commissionConfig = CommissionConfig.getAll();
        
            // Convertir en JSON avec Gson
            String jsonResponse = commissionConfig != null ? CommissionConfig.toJson(commissionConfig) : "{}";

            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print(jsonResponse);
            out.flush();
        } else {
        
        RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/admin/commission/commission-update.jsp");
        dispatcher.forward(request, response);
        }
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Récupérer les paramètres directement depuis la requête
        String achatStr = request.getParameter("achat");
        String venteStr = request.getParameter("vente");

        // Créer un HashMap pour la réponse
        //HashMap<String, Object> responseMap = new HashMap<>();

        // Traiter les valeurs
        try {
            double achat = Double.parseDouble(achatStr);
            double vente = Double.parseDouble(venteStr);

            // Mise à jour des commissions dans la base de données
            boolean success = CommissionConfig.update(achat, vente);

            // Répondre avec le statut de succès ou d'échec
            //responseMap.put("status", success ? "success" : "failure");
            //responseMap.put("message", success ? "Configuration mise à jour" : "Erreur lors de la mise à jour");

        } catch (NumberFormatException e) {
            // En cas d'erreur de formatage
            //responseMap.put("status", "failure");
            //responseMap.put("message", "Paramètres invalides");
        }

        RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/admin/commission/commission-update.jsp");
        dispatcher.forward(request, response);
    }
}