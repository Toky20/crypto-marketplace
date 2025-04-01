/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import acces.Connexion;
import com.google.gson.Gson;
import java.sql.*;

public class CommissionConfig {

    private double achat;
    private double vente;

    // Constructeur
    public CommissionConfig(double achat, double vente) {
        this.achat = achat;
        this.vente = vente;
    }

    // Getters et setters
    public double getAchat() {
        return achat;
    }

    public void setAchat(double achat) {
        this.achat = achat;
    }

    public double getVente() {
        return vente;
    }

    public void setVente(double vente) {
        this.vente = vente;
    }

    // Méthode pour récupérer les commissions depuis la base de données
    public static CommissionConfig getAll() {
        CommissionConfig commissionConfig = null;
        try (Connection connection = new Connexion().getConnection();
             PreparedStatement ps = connection.prepareStatement("SELECT * FROM commission_config");
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                commissionConfig = new CommissionConfig(rs.getDouble("achat"), rs.getDouble("vente"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return commissionConfig;
    }

    // Méthode pour mettre à jour les commissions dans la base de données
    public static boolean update(double achat, double vente) {
        try (Connection connection = new Connexion().getConnection();
             PreparedStatement ps = connection.prepareStatement("UPDATE commission_config SET achat = ?, vente = ?")) {
            
            ps.setDouble(1, achat);
            ps.setDouble(2, vente);
            int rowsUpdated = ps.executeUpdate();
            return rowsUpdated > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Méthode pour convertir un objet CommissionConfig en JSON
    public static String toJson(CommissionConfig commissionConfig) {
        Gson gson = new Gson();
        return gson.toJson(commissionConfig);
    }
}

