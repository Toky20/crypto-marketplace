/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import acces.Connexion;
import java.sql.*;
import java.util.*;

public class AnalyseCommission {
    private String typeAnalyse;
    private String crypto;
    private String dateMin;
    private String dateMax;
    
    // Constructeurs, getters et setters
    public AnalyseCommission(String typeAnalyse, String crypto, String dateMin, String dateMax) {
        this.typeAnalyse = typeAnalyse;
        this.crypto = crypto;
        this.dateMin = dateMin;
        this.dateMax = dateMax;
    }

    public String getTypeAnalyse() {
        return typeAnalyse;
    }

    public void setTypeAnalyse(String typeAnalyse) {
        this.typeAnalyse = typeAnalyse;
    }

    public String getCrypto() {
        return crypto;
    }

    public void setCrypto(String crypto) {
        this.crypto = crypto;
    }

    public String getDateMin() {
        return dateMin;
    }

    public void setDateMin(String dateMin) {
        this.dateMin = dateMin;
    }

    public String getDateMax() {
        return dateMax;
    }

    public void setDateMax(String dateMax) {
        this.dateMax = dateMax;
    }
    
    public List<Map<String, Object>> getAnalyseCommission() {
        List<Map<String, Object>> result = new ArrayList<>();

        // Définir la requête de base utilisant la vue v_liste_commission
        String sql = "SELECT * " +
                     "FROM public.v_liste_commission " +
                     "WHERE dateheure BETWEEN ?::date AND ?::date ";

        // Ajouter un filtre pour la cryptomonnaie si nécessaire
        if (!crypto.equals("Tous")) {
            sql += "AND cryptomonnaie = ? ";
        }

        // Ajouter la logique d'analyse pour la somme ou la moyenne
        if (typeAnalyse.equals("Somme")) {
            sql = "WITH v as ("+sql+") SELECT type_transaction, SUM(commission) AS commission from v group by type_transaction";
        } else if (typeAnalyse.equals("Moyenne")) {
            sql = "WITH v as ("+sql+") SELECT type_transaction, AVG(commission) AS commission from v group by type_transaction";
        }

        System.out.println("Requête SQL: " + sql);

        try (Connection conn = new Connexion().getConnection(); 
             PreparedStatement ps = conn.prepareStatement(sql)) {

            // Définir les paramètres de la requête
            ps.setString(1, dateMin);
            ps.setString(2, dateMax);

            // Ajouter un paramètre supplémentaire si un filtre sur la cryptomonnaie est appliqué
            if (!crypto.equals("Tous")) {
                ps.setString(3, crypto);
            }

            ResultSet rs = ps.executeQuery();

            // Si la requête est une agrégation (somme ou moyenne), on récupère directement la valeur
            if (typeAnalyse.equals("Somme") || typeAnalyse.equals("Moyenne")) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    if (typeAnalyse.equals("Somme")) {
                        row.put("type_transaction", rs.getString("type_transaction"));
                        row.put("commission", rs.getBigDecimal("commission"));
                    } else {
                        row.put("type_transaction", rs.getString("type_transaction"));
                        row.put("commission", rs.getBigDecimal("commission"));
                    }
                    result.add(row);
                }
            } 

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return result;
    }

    
}

