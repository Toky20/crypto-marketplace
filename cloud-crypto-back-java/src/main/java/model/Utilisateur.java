/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import acces.Connexion;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author Toky
 */
public class Utilisateur {
    
    private int idUtilisateur;
    private double solde;
    private String email;

    public Utilisateur() {
    }

    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public double getSolde() {
        return solde;
    }

    public void setSolde(double solde) {
        this.solde = solde;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public static Utilisateur getByToken(String token, Connection conn) throws SQLException {
        // Requête pour récupérer l'id_utilisateur à partir du token
        String sql = "SELECT id_utilisateur FROM token WHERE token=?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, token);
        ResultSet rs = pstmt.executeQuery();

        int idUtilisateur = -1;
        if (rs.next()) {
            idUtilisateur = rs.getInt("id_utilisateur");
        }
        rs.close();
        pstmt.close();

        // Si l'idUtilisateur n'a pas été trouvé, on retourne null
        if (idUtilisateur == -1) {
            return null;
        }

        // Requête pour récupérer le solde de l'utilisateur
        sql = "SELECT solde FROM v_utilisateur_solde WHERE id_utilisateur=?";
        pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, idUtilisateur);
        rs = pstmt.executeQuery();

        double solde = 0.0;
        if (rs.next()) {
            solde = rs.getDouble("solde");
        }
        rs.close();
        pstmt.close();
        
        // Requête pour récupérer l'email de l'utilisateur
        sql = "SELECT email FROM utilisateur WHERE id_utilisateur=?";
        pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, idUtilisateur);
        rs = pstmt.executeQuery();

        String email = null;
        if (rs.next()) {
            email = rs.getString("email");
        }
        rs.close();
        pstmt.close();

        // Création et retour de l'objet Utilisateur
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(idUtilisateur);
        utilisateur.setSolde(solde);
        utilisateur.setEmail(email);
        return utilisateur;
    }
    
    public static Utilisateur getById(int idUtilisateur, Connection conn) throws SQLException {
        // Si l'idUtilisateur n'a pas été trouvé, on retourne null
        if (idUtilisateur == -1) {
            return null;
        }

        // Requête pour récupérer le solde de l'utilisateur
        String sql = "SELECT solde FROM v_utilisateur_solde WHERE id_utilisateur=?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, idUtilisateur);
        ResultSet rs = pstmt.executeQuery();

        double solde = 0.0;
        if (rs.next()) {
            solde = rs.getDouble("solde");
        }
        rs.close();
        pstmt.close();
        
        // Requête pour récupérer l'email de l'utilisateur
        sql = "SELECT email FROM utilisateur WHERE id_utilisateur=?";
        pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, idUtilisateur);
        rs = pstmt.executeQuery();

        String email = null;
        if (rs.next()) {
            email = rs.getString("email");
        }
        rs.close();
        pstmt.close();

        // Création et retour de l'objet Utilisateur
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(idUtilisateur);
        utilisateur.setSolde(solde);
        utilisateur.setEmail(email);
        return utilisateur;
    }
    
    public void updateSoldeFb() {
        // Récupérer l'instance Firestore
        Firestore db = FirestoreClient.getFirestore();

        // Référence au document correspondant à cet email dans la collection soldeusers
        //DocumentReference userRef = db.collection("soldeusers").document(email);

        // Effectuer la requête pour rechercher l'utilisateur par son email
        ApiFuture<QuerySnapshot> future = db.collection("soldeusers")
                .whereEqualTo("email", email)
                .get();

        try {
            // Attendre le résultat de la requête
            QuerySnapshot querySnapshot = future.get();

            // Vérifier s'il y a un document correspondant
            if (!querySnapshot.isEmpty()) {
                // Récupérer le premier document trouvé (on suppose qu'il y a un seul utilisateur avec cet email)
                DocumentSnapshot document = querySnapshot.getDocuments().get(0);

                // Obtenir la référence du document
                DocumentReference userRef = document.getReference();

                // Mettre à jour le champ solde du document
                ApiFuture<WriteResult> writeResult = userRef.update("solde", solde);

                // Attendre le résultat de la mise à jour
                WriteResult result = writeResult.get();
                System.out.println("Solde mis à jour à : " + result.getUpdateTime());
            } else {
                System.out.println("Aucun utilisateur trouvé avec l'email : " + email);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Erreur lors de la mise à jour : " + e.getMessage());
        }
    }
    
    public void updateRole(Connection connection, int idRole) throws SQLException {
        // Requête SQL pour mettre à jour le rôle de l'utilisateur
        String sql = "UPDATE utilisateur_role SET id_role = ? WHERE id_utilisateur = ?";

        try ( // Préparation de la requête
                PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, idRole);
            statement.setInt(2, this.idUtilisateur);
            // Exécution de la requête
            int rowsUpdated = statement.executeUpdate();
            if (rowsUpdated == 0) {
                // Aucun enregistrement mis à jour, gérer l'erreur
                throw new SQLException("Aucun rôle trouvé pour l'utilisateur " + idUtilisateur);
            }
            // Fermeture des ressources
        }
    }
}
