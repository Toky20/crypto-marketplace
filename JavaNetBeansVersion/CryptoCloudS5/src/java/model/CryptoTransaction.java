/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 *
 * @author Toky
 */
public class CryptoTransaction {
    
     private Connection connection;

    public CryptoTransaction(Connection connection) {
        this.connection = connection;
    }

    public CryptoTransaction() {
    }

    public Connection getConnection() {
        return connection;
    }

    public void setConnection(Connection connection) {
        this.connection = connection;
    }
     
     
     
    public void insererAchat(int idUtilisateur, String idCrypto, double quantite, double prixUnitaire,double commission) throws SQLException, InterruptedException, ExecutionException {
        // Démarrer une transaction pour garantir l'atomicité
        connection.setAutoCommit(false);

        try (PreparedStatement stmtTransaction = connection.prepareStatement(
                "INSERT INTO transaction (id_utilisateur, id_crypto, entree, prixunitaire,commission) VALUES (?, (select id_crypto from crypto where nom=?), ?, ?, ?)");
            PreparedStatement stmtMvtWallet = connection.prepareStatement(
                "INSERT INTO mvtwallet (id_utilisateur, retrait) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);
             PreparedStatement stmtMvtWalletValid = connection.prepareStatement(
                "INSERT INTO mvtwalletvalid (id) VALUES (?)")) {

            // Calculer le montant total du retrait
            double montantRetrait = quantite * prixUnitaire;
            double commissionValue=montantRetrait * commission /100;
            montantRetrait+=commissionValue;

            // Exécuter les requêtes
            stmtTransaction.setInt(1, idUtilisateur);
            stmtTransaction.setString(2, idCrypto);
            stmtTransaction.setDouble(3, quantite);
            stmtTransaction.setDouble(4, prixUnitaire);
            stmtTransaction.setDouble(5, commissionValue);
            stmtTransaction.executeUpdate();

            stmtMvtWallet.setInt(1, idUtilisateur);
            stmtMvtWallet.setDouble(2, montantRetrait);
            stmtMvtWallet.executeUpdate();

            // Récupérer l'ID généré
            ResultSet generatedKeys = stmtMvtWallet.getGeneratedKeys();
            if (generatedKeys.next()) {
                long idMvtWallet = generatedKeys.getInt(1);

                // Insérer l'ID dans mvtwalletvalid
                stmtMvtWalletValid.setLong(1, idMvtWallet);
                stmtMvtWalletValid.executeUpdate();
            } else {
                throw new SQLException("Aucun ID généré pour mvtwallet");
            }
            
            Utilisateur u = Utilisateur.getById(idUtilisateur, connection);
            u.updateSoldeFb();
            
            String email = u.getEmail();

            // Insérer dans Firestore la transaction
            Firestore db = FirestoreClient.getFirestore();

            // Créer la map des données à insérer
            Map<String, Object> transactionData = new HashMap<>();
            transactionData.put("crypto", idCrypto); // Le nom de la crypto
            transactionData.put("date", FieldValue.serverTimestamp()); // Date au format UTC
            transactionData.put("email", email); // Email de l'utilisateur
            transactionData.put("montant", montantRetrait); // Montant du retrait
            transactionData.put("pu", prixUnitaire); // Prix unitaire
            transactionData.put("qte", quantite); // Quantité
            transactionData.put("transaction", "Achat"); // Type de transaction

            // Insérer le document dans la collection 'cryptotransactions'
            // Insérer le document dans la collection 'cryptotransactions'
            DocumentReference docRef = db.collection("cryptotransactions").document();
            WriteResult result = docRef.set(transactionData).get();  // Utilisation de .get() pour bloquer jusqu'à la fin

            // Afficher un message de succès
            System.out.println("Transaction ajoutée à Firestore avec ID: " + docRef.getId() + " et heure: " + result.getUpdateTime());


            // Valider la transaction
            connection.commit();
        } catch (SQLException e) {
            // Annuler la transaction en cas d'erreur
            connection.rollback();
            throw e;
        } finally {
            // Rétablir l'autocommit par défaut
            connection.setAutoCommit(true);
        }
    }

    public void insererVente(int idUtilisateur, String idCrypto, double quantite, double prixUnitaire, double commission) throws SQLException, InterruptedException, ExecutionException {
        // Démarrer une transaction pour garantir l'atomicité
        connection.setAutoCommit(false);

        try (PreparedStatement stmtTransaction = connection.prepareStatement(
                "INSERT INTO transaction (id_utilisateur, id_crypto, sortie, prixunitaire,commission) VALUES (?, (select id_crypto from crypto where nom=?), ?, ?, ?)");
            PreparedStatement stmtMvtWallet = connection.prepareStatement(
                "INSERT INTO mvtwallet (id_utilisateur, depot) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);
             PreparedStatement stmtMvtWalletValid = connection.prepareStatement(
                "INSERT INTO mvtwalletvalid (id) VALUES (?)")) {

            // Calculer le montant total du retrait
            double montantRetrait = quantite * prixUnitaire;
            double commissionValue=montantRetrait * commission /100;
            montantRetrait+=commissionValue;

            // Exécuter les requêtes
            stmtTransaction.setInt(1, idUtilisateur);
            stmtTransaction.setString(2, idCrypto);
            stmtTransaction.setDouble(3, quantite);
            stmtTransaction.setDouble(4, prixUnitaire);
            stmtTransaction.setDouble(5, commissionValue);
            stmtTransaction.executeUpdate();

            stmtMvtWallet.setInt(1, idUtilisateur);
            stmtMvtWallet.setDouble(2, montantRetrait);
            stmtMvtWallet.executeUpdate();

            // Récupérer l'ID généré
            ResultSet generatedKeys = stmtMvtWallet.getGeneratedKeys();
            if (generatedKeys.next()) {
                long idMvtWallet = generatedKeys.getInt(1);

                // Insérer l'ID dans mvtwalletvalid
                stmtMvtWalletValid.setLong(1, idMvtWallet);
                stmtMvtWalletValid.executeUpdate();
            } else {
                throw new SQLException("Aucun ID généré pour mvtwallet");
            }
            
            Utilisateur u = Utilisateur.getById(idUtilisateur, connection);
            u.updateSoldeFb();
            
            String email = u.getEmail();

            // Insérer dans Firestore la transaction
            Firestore db = FirestoreClient.getFirestore();

            // Créer la map des données à insérer
            Map<String, Object> transactionData = new HashMap<>();
            transactionData.put("crypto", idCrypto); // Le nom de la crypto
            transactionData.put("date", FieldValue.serverTimestamp()); // Date au format UTC
            transactionData.put("email", email); // Email de l'utilisateur
            transactionData.put("montant", montantRetrait); // Montant du retrait
            transactionData.put("pu", prixUnitaire); // Prix unitaire
            transactionData.put("qte", quantite); // Quantité
            transactionData.put("transaction", "Vente"); // Type de transaction

            // Insérer le document dans la collection 'cryptotransactions'
            // Insérer le document dans la collection 'cryptotransactions'
            DocumentReference docRef = db.collection("cryptotransactions").document();
            WriteResult result = docRef.set(transactionData).get();  // Utilisation de .get() pour bloquer jusqu'à la fin

            // Afficher un message de succès
            System.out.println("Transaction ajoutée à Firestore avec ID: " + docRef.getId() + " et heure: " + result.getUpdateTime());

            // Valider la transaction
            connection.commit();
        } catch (SQLException e) {
            // Annuler la transaction en cas d'erreur
            connection.rollback();
            throw e;
        } finally {
            // Rétablir l'autocommit par défaut
            connection.setAutoCommit(true);
        }
    }

}
