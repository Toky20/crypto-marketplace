/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Toky
 */
public class UtilisateurCrypto {
    private int idUtilisateur;
    private int idCrypto;
    private String nomCrypto;
    private double quantiteDetenue;

    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public int getIdCrypto() {
        return idCrypto;
    }

    public void setIdCrypto(int idCrypto) {
        this.idCrypto = idCrypto;
    }

    public String getNomCrypto() {
        return nomCrypto;
    }

    public void setNomCrypto(String nomCrypto) {
        this.nomCrypto = nomCrypto;
    }

    public double getQuantiteDetenue() {
        return quantiteDetenue;
    }

    public void setQuantiteDetenue(double quantiteDetenue) {
        this.quantiteDetenue = quantiteDetenue;
    }
    
    public List<UtilisateurCrypto> getByIdUser(Connection connection) throws SQLException {
        List<UtilisateurCrypto> result = new ArrayList<>();
        String query = "SELECT * FROM v_utilisateur_crypto WHERE id_utilisateur = ?";
        PreparedStatement statement = connection.prepareStatement(query);
        statement.setInt(1, idUtilisateur);
        ResultSet resultSet = statement.executeQuery();

        while (resultSet.next()) {
            UtilisateurCrypto uc = new UtilisateurCrypto();
            uc.setIdUtilisateur(resultSet.getInt("id_utilisateur"));
            uc.setIdCrypto(resultSet.getInt("id_crypto"));
            uc.setNomCrypto(resultSet.getString("nom_crypto"));
            uc.setQuantiteDetenue(resultSet.getDouble("quantite_detenue"));
            result.add(uc);
        }

        resultSet.close();
        statement.close();
        return result;
    }
    
    public void updateCryptoSolde(Connection connection) throws SQLException {
        // 1. Récupérer l'utilisateur par ID
        Utilisateur u = Utilisateur.getById(idUtilisateur, connection);
        String email = u.getEmail(); // L'email de l'utilisateur

        // 2. Récupérer les cryptomonnaies de l'utilisateur depuis la base de données
        List<UtilisateurCrypto> cryptoList = getByIdUser(connection);

        // 3. Initialiser Firestore
        Firestore db = FirestoreClient.getFirestore();

        if (cryptoList.isEmpty()) {
            // 4. Si cryptoList est vide, supprimer tous les documents associés à cet utilisateur
            ApiFuture<QuerySnapshot> future = db.collection("cryptousers")
                    .whereEqualTo("email", email)
                    .get();

            try {
                // 4.1 Attendre que la requête soit terminée
                QuerySnapshot querySnapshot = future.get();

                // 4.2 Vérifier s'il existe des documents associés à cet utilisateur
                if (!querySnapshot.isEmpty()) {
                    // 4.3 Supprimer tous les documents associés
                    for (DocumentSnapshot document : querySnapshot.getDocuments()) {
                        DocumentReference docRef = document.getReference();
                        ApiFuture<WriteResult> writeResult = docRef.delete();
                        writeResult.get(); // Attendre que la suppression soit terminée
                        System.out.println("Document supprimé pour l'utilisateur " + email + " et la crypto " + document.getString("crypto"));
                    }
                } else {
                    System.out.println("Aucun document trouvé pour l'utilisateur " + email);
                }

            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("Erreur lors de la suppression : " + e.getMessage());
            }
        } else {
            // 5. Sinon, gérer les ajouts et mises à jour des cryptomonnaies
            for (UtilisateurCrypto uc : cryptoList) {
                // 5.1 Récupérer la référence du document correspondant dans Firestore
                ApiFuture<QuerySnapshot> future = db.collection("cryptousers")
                        .whereEqualTo("email", email)
                        .whereEqualTo("crypto", uc.getNomCrypto())
                        .get();

                try {
                    // 5.2 Attendre que la requête soit terminée
                    QuerySnapshot querySnapshot = future.get();

                    // 5.3 Vérifier s'il existe un document correspondant
                    if (!querySnapshot.isEmpty()) {
                        // Si un document existe, mettre à jour la quantité de crypto
                        DocumentReference docRef = querySnapshot.getDocuments().get(0).getReference();

                        // 5.4 Mettre à jour la quantité de crypto dans le document
                        ApiFuture<WriteResult> writeResult = docRef.update("qte", uc.getQuantiteDetenue());
                        WriteResult result = writeResult.get();

                        // Afficher la date de la mise à jour
                        System.out.println("Quantité de " + uc.getNomCrypto() + " mise à jour à : " + result.getUpdateTime());
                    } else {
                        // Si aucun document trouvé, ajouter un nouveau document pour cette crypto
                        DocumentReference newDocRef = db.collection("cryptousers").document();

                        // Créer un nouvel objet pour le document à ajouter
                        Map<String, Object> newCrypto = new HashMap<>();
                        newCrypto.put("email", email);
                        newCrypto.put("crypto", uc.getNomCrypto());
                        newCrypto.put("qte", uc.getQuantiteDetenue());

                        // 5.5 Ajouter un nouveau document dans la collection "cryptousers"
                        ApiFuture<WriteResult> writeResult = newDocRef.set(newCrypto);
                        writeResult.get(); // On attend que l'ajout soit terminé
                        System.out.println("Ajout de la crypto " + uc.getNomCrypto() + " pour l'utilisateur " + email);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    System.err.println("Erreur lors de la mise à jour ou de l'ajout : " + e.getMessage());
                }
            }
        }
    }


}
