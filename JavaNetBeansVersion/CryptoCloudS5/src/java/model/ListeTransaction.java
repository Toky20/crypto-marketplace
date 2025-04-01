/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class ListeTransaction {
    private String utilisateur;
    private Timestamp dateHeure;
    private String cryptomonnaie;
    private String typeTransaction;
    private double quantite;
    double prixunitaire;
    double montant;
    double commission;

    public String getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(String utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Timestamp getDateHeure() {
        return dateHeure;
    }

    public void setDateHeure(Timestamp dateHeure) {
        this.dateHeure = dateHeure;
    }

    public String getCryptomonnaie() {
        return cryptomonnaie;
    }

    public void setCryptomonnaie(String cryptomonnaie) {
        this.cryptomonnaie = cryptomonnaie;
    }

    public String getTypeTransaction() {
        return typeTransaction;
    }

    public void setTypeTransaction(String typeTransaction) {
        this.typeTransaction = typeTransaction;
    }

    public double getQuantite() {
        return quantite;
    }

    public void setQuantite(double quantite) {
        this.quantite = quantite;
    }

    public double getPrixunitaire() {
        return prixunitaire;
    }

    public void setPrixunitaire(double prixunitaire) {
        this.prixunitaire = prixunitaire;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public double getCommission() {
        return commission;
    }

    public void setCommission(double commission) {
        this.commission = commission;
    }
    
    
    
    public static List<ListeTransaction> getAll(Connection connection) throws SQLException {
        List<ListeTransaction> transactions = new ArrayList<>();
        String sql = "SELECT * FROM v_liste_transaction";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                ListeTransaction transaction = new ListeTransaction();
                transaction.setUtilisateur(resultSet.getString("utilisateur"));
                transaction.setDateHeure(resultSet.getTimestamp("dateheure"));
                transaction.setCryptomonnaie(resultSet.getString("cryptomonnaie"));
                transaction.setTypeTransaction(resultSet.getString("type_transaction"));
                transaction.setQuantite(resultSet.getDouble("quantite"));
                
                transaction.setPrixunitaire(resultSet.getDouble("prixunitaire"));
                transaction.setMontant(resultSet.getDouble("montant"));
                transaction.setCommission(resultSet.getDouble("commission"));
                transactions.add(transaction);
            }
        }
        return transactions;
    }

    
    public static List<ListeTransaction> search(Connection connection, 
                                           String utilisateur, 
                                           Date dateDebut, 
                                           Date dateFin, 
                                           String cryptomonnaie, 
                                           String typeTransaction,
                                           String orderBy,
                                           String ascOrDesc) throws SQLException {
        List<ListeTransaction> transactions = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM v_liste_transaction WHERE 1=1");

        if (utilisateur != null && !utilisateur.isEmpty()) {
            sql.append(" AND lower(utilisateur) LIKE ?");
        }
        if (dateDebut != null) {
            sql.append(" AND dateheure >= ?");
        }
        if (dateFin != null) {
            sql.append(" AND dateheure <= ?");
        }
        if (cryptomonnaie != null && !cryptomonnaie.isEmpty()) {
            sql.append(" AND lower(cryptomonnaie) LIKE ?");
        }
        if (typeTransaction != null && !typeTransaction.isEmpty()) {
            sql.append(" AND lower(type_transaction) = ?");
        }

        if (orderBy != null && !orderBy.isEmpty()) {
            if (ascOrDesc != null && !ascOrDesc.isEmpty()) {
                sql.append(" ORDER BY ").append(orderBy).append(" ").append(ascOrDesc);
            } else {
            sql.append(" ORDER BY ").append(orderBy);}
        }

        try (PreparedStatement statement = connection.prepareStatement(sql.toString())) {
            System.out.println(sql.toString());
            int index = 1;
            if (utilisateur != null && !utilisateur.isEmpty()) {
                statement.setString(index++, "%" + utilisateur.toLowerCase() + "%");
            }
            if (dateDebut != null) {
                statement.setDate(index++, dateDebut);
            }
            if (dateFin != null) {
                statement.setDate(index++, dateFin);
            }
            if (cryptomonnaie != null && !cryptomonnaie.isEmpty()) {
                statement.setString(index++, "%" + cryptomonnaie.toLowerCase() + "%");
            }
            if (typeTransaction != null && !typeTransaction.isEmpty()) {
                statement.setString(index++, typeTransaction.toLowerCase());
            }

            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                ListeTransaction transaction = new ListeTransaction();
                transaction.setUtilisateur(resultSet.getString("utilisateur"));
                transaction.setDateHeure(resultSet.getTimestamp("dateheure"));
                transaction.setCryptomonnaie(resultSet.getString("cryptomonnaie"));
                transaction.setTypeTransaction(resultSet.getString("type_transaction"));
                transaction.setQuantite(resultSet.getDouble("quantite"));
                
                transaction.setPrixunitaire(resultSet.getDouble("prixunitaire"));
                transaction.setMontant(resultSet.getDouble("montant"));
                transaction.setCommission(resultSet.getDouble("commission"));
                
                transactions.add(transaction);
            }
        }
        return transactions;
    }
}
