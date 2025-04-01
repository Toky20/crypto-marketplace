/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


public class MouvementFiatWallet {
    private int idmvtwallet;
    private Timestamp dateheure;
    private double depot;
    private double retrait;
    private int id_utilisateur;
    
    String email;

    public MouvementFiatWallet(int idmvtwallet, Timestamp dateheure, double depot, double retrait, int id_utilisateur) {
        this.idmvtwallet = idmvtwallet;
        this.dateheure = dateheure;
        this.depot = depot;
        this.retrait = retrait;
        this.id_utilisateur = id_utilisateur;
    }

    public MouvementFiatWallet() {
    }

    public int getIdmvtwallet() {
        return idmvtwallet;
    }

    public void setIdmvtwallet(int idmvtwallet) {
        this.idmvtwallet = idmvtwallet;
    }

    public Timestamp getDateheure() {
        return dateheure;
    }

    public void setDateheure(Timestamp dateheure) {
        this.dateheure = dateheure;
    }

    public double getDepot() {
        return depot;
    }

    public void setDepot(double depot) {
        this.depot = depot;
    }

    public double getRetrait() {
        return retrait;
    }

    public void setRetrait(double retrait) {
        this.retrait = retrait;
    }

    public int getId_utilisateur() {
        return id_utilisateur;
    }

    public void setId_utilisateur(int id_utilisateur) {
        this.id_utilisateur = id_utilisateur;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    

    public void insert(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "INSERT INTO mvtwallet (depot, retrait, id_utilisateur) VALUES (?, ?, ?)";
        PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); 
        stmt.setDouble(1, depot);
        stmt.setDouble(2, retrait);
        stmt.setInt(3, id_utilisateur);
        stmt.executeUpdate();
        stmt.close();
    }
    
    public void insertFromFb(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "INSERT INTO mvtwallet (depot, retrait, id_utilisateur) VALUES (?, ?, (select id_utilisateur from utilisateur where email=?))";
        PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); 
        stmt.setDouble(1, depot);
        stmt.setDouble(2, retrait);
        stmt.setString(3, email);
        stmt.executeUpdate();
        stmt.close();
    }
    
    public void valider(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "INSERT INTO mvtwalletvalid (id) VALUES (?)";
        PreparedStatement stmt = conn.prepareStatement(sql); 
        stmt.setInt(1, idmvtwallet);
        stmt.executeUpdate();

        stmt.close();
        
        Utilisateur u = Utilisateur.getById(getIdUtilisateurByMvtWallet(conn), conn);
        u.updateSoldeFb();
    }
    
    public int getIdUtilisateurByMvtWallet(Connection conn) throws SQLException {
        // Requête SQL pour récupérer l'id_utilisateur depuis idmvtwallet
        String sql = "SELECT id_utilisateur FROM mvtwallet WHERE idmvtwallet = ?";

        // Préparer la requête pour éviter les injections SQL
        PreparedStatement stmt = conn.prepareStatement(sql);

        // Passer l'idmvtwallet comme paramètre à la requête
        stmt.setInt(1, idmvtwallet);

        // Exécuter la requête
        ResultSet rs = stmt.executeQuery();

        // Initialiser la variable pour stocker l'id_utilisateur
        int idUtilisateur = -1; // On initialise avec une valeur invalide au cas où aucun résultat n'est trouvé

        // Vérifier si un résultat a été trouvé
        if (rs.next()) {
            idUtilisateur = rs.getInt("id_utilisateur");
        }

        // Fermer les ressources
        rs.close();
        stmt.close();

        // Retourner l'id_utilisateur trouvé
        return idUtilisateur;
    }

    
    public List<MouvementFiatWallet> getAll(Connection conn) throws SQLException {
        List<MouvementFiatWallet> mouvements = new ArrayList<>();
        String query = "with v as (SELECT\n" +
                "    mv.idmvtwallet,\n" +
                "	mv.dateheure,\n" +
                "	mv.depot,\n" +
                "	mv.retrait,\n" +
                "	u.email\n" +
                "  FROM\n" +
                "    mvtwallet mv\n" +
                "  LEFT JOIN  utilisateur u ON u.id_utilisateur = mv.id_utilisateur\n" +
                "  LEFT JOIN mvtwalletvalid mvwv ON mv.idmvtwallet = mvwv.id\n" +
                "   where  mvwv.id IS NULL\n" +
                "   order by mv.idmvtwallet,mv.dateheure)\n" +
                "   select * from v";

        try (PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                MouvementFiatWallet m = new MouvementFiatWallet();
                m.setIdmvtwallet(rs.getInt("idmvtwallet"));
                m.setDateheure(rs.getTimestamp("dateheure"));
                m.setDepot(rs.getDouble("depot"));
                m.setRetrait(rs.getDouble("retrait"));
                m.setEmail(rs.getString("email"));
                
                mouvements.add(m);
            }
        }
        return mouvements;
    }
}
