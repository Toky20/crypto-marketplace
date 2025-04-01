/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package admin.controller;

import acces.Connexion;
import java.io.IOException;
import java.sql.Connection;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import model.MouvementFiatWallet;

/**
 *
 * @author itu
 */
@WebServlet(name = "ListeMouvementFiatServlet", urlPatterns = {"/admin/ListeMouvementFiatServlet"})
public class ListeMouvementFiatServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try (Connection conn = new Connexion().getConnection()) {
            MouvementFiatWallet mouvement = new MouvementFiatWallet();
            List<MouvementFiatWallet> mouvements = mouvement.getAll(conn);
            
            request.setAttribute("mouvements", mouvements);
            request.getRequestDispatcher("/pages/admin/mouvementfiatwallet/mouvementfiatwallet-liste.jsp").forward(request, response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
