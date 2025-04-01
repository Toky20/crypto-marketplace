/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package admin.controller;

import java.io.IOException;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import model.AnalyseCommission;

@WebServlet(name = "AnalyseCommissionServlet", urlPatterns = {"/admin/AnalyseCommissionServlet"})
public class AnalyseCommissionServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Initialiser les options pour les "type analyse" et "crypto"
        request.setAttribute("cryptoList", Arrays.asList("Tous", "BITCOIN", "ETHEREUM", "CARDANO", "XPR", "SOLANA", "LITECOIN", "DOGECOIN", "AVALANCHE", "RAVENCOIN", "ATOM"));
        request.setAttribute("typeAnalyseList", Arrays.asList("Somme", "Moyenne"));
        
        // Afficher la page JSP
        request.getRequestDispatcher("/pages/admin/commission/commission-analyse.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Récupérer les données du formulaire
        String typeAnalyse = request.getParameter("typeAnalyse");
        String crypto = request.getParameter("crypto");
        String dateMin = request.getParameter("dateMin");
        String dateMax = request.getParameter("dateMax");
        
        // Ajoute ces valeurs à l'objet requête pour les utiliser dans la JSP
        request.setAttribute("typeAnalyse", typeAnalyse);
        request.setAttribute("crypto", crypto);
        request.setAttribute("dateMin", dateMin);
        request.setAttribute("dateMax", dateMax);
        // Créer une instance de AnalyseCommission avec les paramètres
        AnalyseCommission analyse = new AnalyseCommission(typeAnalyse, crypto, dateMin, dateMax);
        
        // Appeler la méthode getAnalyseCommission pour récupérer les résultats
        List<Map<String, Object>> result = analyse.getAnalyseCommission();
        
        request.setAttribute("cryptoList", Arrays.asList("Tous", "BITCOIN", "ETHEREUM", "CARDANO", "XPR", "SOLANA", "LITECOIN", "DOGECOIN", "AVALANCHE", "RAVENCOIN", "ATOM"));
        request.setAttribute("typeAnalyseList", Arrays.asList("Somme", "Moyenne"));
        
        // Passer les résultats à la page JSP
        request.setAttribute("result", result);
        request.getRequestDispatcher("/pages/admin/commission/commission-analyse.jsp").forward(request, response);
    }
}

