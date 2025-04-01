/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import acces.Connexion;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class EvolutionWallet {

    private String email;
    private Timestamp dateheure;
    private double totalAchatCrypto;
    private double totalVenteCrypto;
    private double totalWallet;

    // Constructeur
    public EvolutionWallet(String email, Timestamp dateheure, double totalAchatCrypto, double totalVenteCrypto, double totalWallet) {
        this.email = email;
        this.dateheure = dateheure;
        this.totalAchatCrypto = totalAchatCrypto;
        this.totalVenteCrypto = totalVenteCrypto;
        this.totalWallet = totalWallet;
    }

    public EvolutionWallet() {
    }
    
    

    // Getters et setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Timestamp getDateheure() {
        return dateheure;
    }

    public void setDateheure(Timestamp dateheure) {
        this.dateheure = dateheure;
    }

    public double getTotalAchatCrypto() {
        return totalAchatCrypto;
    }

    public void setTotalAchatCrypto(double totalAchatCrypto) {
        this.totalAchatCrypto = totalAchatCrypto;
    }

    public double getTotalVenteCrypto() {
        return totalVenteCrypto;
    }

    public void setTotalVenteCrypto(double totalVenteCrypto) {
        this.totalVenteCrypto = totalVenteCrypto;
    }

    public double getTotalWallet() {
        return totalWallet;
    }

    public void setTotalWallet(double totalWallet) {
        this.totalWallet = totalWallet;
    }
    
    public List<EvolutionWallet> getAll() throws SQLException {
        List<EvolutionWallet> wallets = new ArrayList<>();
        
        String query = "select email, sum(total_achats_crypto) as total_achats_crypto ,\n" +
            "sum(total_ventes_crypto) as total_ventes_crypto,\n" +
            "total_wallet \n" +
            "from v_evolution_wallet\n" +
            "group by email,total_wallet";
        
        try (Connection connection = new Connexion().getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            
            while (resultSet.next()) {
                String email = resultSet.getString("email");
                double totalAchatCrypto = resultSet.getDouble("total_achats_crypto");
                double totalVenteCrypto = resultSet.getDouble("total_ventes_crypto");
                double totalWallet = resultSet.getDouble("total_wallet");
                
                EvolutionWallet wallet = new EvolutionWallet(email, dateheure, totalAchatCrypto, totalVenteCrypto, totalWallet);
                wallets.add(wallet);
            }
        }
        return wallets;
    }
    
    public List<EvolutionWallet> getEvolutionByDateRange(Date datedebut, Date datefin) throws SQLException {
        List<EvolutionWallet> wallets = new ArrayList<>();

        String query = "WITH filtered_transactions AS (\n" +
            "    SELECT \n" +
            "        id_utilisateur,\n" +
            "        SUM((entree*prixunitaire)+commission) AS total_achat,\n" +
            "        SUM((sortie*prixunitaire)+commission) AS total_vente\n" +
            "    FROM transaction\n" +
            "    WHERE dateheure BETWEEN ? AND ?\n" +
            "    GROUP BY id_utilisateur\n" +
            "),\n" +
            "cumulative_fiat AS (\n" +
            "    SELECT \n" +
            "        mw.id_utilisateur,\n" +
            "        SUM(mw.depot) - SUM(mw.retrait) AS solde\n" +
            "    FROM mvtwallet mw\n" +
            "    JOIN mvtwalletvalid mvw ON mw.idmvtwallet = mvw.id\n" +
            "    WHERE mw.dateheure BETWEEN ? AND ? AND mvw.id IS NOT NULL\n" +
            "    GROUP BY mw.id_utilisateur\n" +
            ")\n" +
            "SELECT \n" +
            "    u.email,\n" + // Récupération de l'email
            "    COALESCE(ft.total_achat, 0) AS total_achat,\n" +
            "    COALESCE(ft.total_vente, 0) AS total_vente,\n" +
            "    COALESCE(cf.solde, 0) AS solde\n" +
            "FROM utilisateur u\n" +
            "LEFT JOIN filtered_transactions ft ON u.id_utilisateur = ft.id_utilisateur\n" +
            "LEFT JOIN cumulative_fiat cf ON u.id_utilisateur = cf.id_utilisateur\n" +
            "ORDER BY u.id_utilisateur;";

        try (Connection connection = new Connexion().getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            // Paramètres pour les dates (utilisés 2 fois dans la requête)
            statement.setDate(1, datedebut);
            statement.setDate(2, datefin);
            statement.setDate(3, datedebut);
            statement.setDate(4, datefin);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String email = resultSet.getString("email");
                    double totalAchat = resultSet.getDouble("total_achat");
                    double totalVente = resultSet.getDouble("total_vente");
                    double solde = resultSet.getDouble("solde");

                    // Dateheure non présente dans les résultats, mise à null
                    EvolutionWallet wallet = new EvolutionWallet(email, null, totalAchat, totalVente, solde);
                    wallets.add(wallet);
                }
            }
        }
        return wallets;
    }
}

