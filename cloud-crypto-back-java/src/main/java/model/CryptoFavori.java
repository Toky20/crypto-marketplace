package model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class CryptoFavori {
    private int id_crypto_favori;
    private int id_utilisateur;
    private int id_crypto;
    private String mail;
    private String status;

    public CryptoFavori() {
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public void setMail(Connection conn) throws Exception {
        String query = "SELECT email FROM utilisateur WHERE id_utilisateur=?";

        PreparedStatement stmt = null;
        ResultSet res = null;

        try {
            stmt = conn.prepareStatement(query);
            stmt.setInt(1,this.id_utilisateur);
            res = stmt.executeQuery();
            if (res.next()) this.mail = res.getString("email");
        } catch (Exception e) {
            throw e;
        }
    }

    public int getId_crypto_favori() {
        return id_crypto_favori;
    }
    public void setId_crypto_favori(int id_crypto_favori) {
        this.id_crypto_favori = id_crypto_favori;
    }
    public int getId_utilisateur() {
        return id_utilisateur;
    }
    public void setId_utilisateur(int id_utilisateur) {
        this.id_utilisateur = id_utilisateur;
    }

    public void setId_utilisateur(Connection conn) throws Exception {
        String query = "SELECT id_utilisateur FROM utilisateur WHERE email=?";

        PreparedStatement stmt = null;
        ResultSet res = null;

        try {
            stmt = conn.prepareStatement(query);
            stmt.setString(1,this.mail);
            res = stmt.executeQuery();
            if (res.next()) this.id_utilisateur = res.getInt("id_utilisateur");
        } catch (Exception e) {
            throw e;
        }
    }

    public int getId_crypto() {
        return id_crypto;
    }
    public void setId_crypto(int id_crypto) {
        this.id_crypto = id_crypto;
    }

    public void insert(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "INSERT INTO crypto_favori (id_utilisateur, id_crypto) VALUES ((select id_utilisateur from utilisateur where email=?), ?)";
        PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); 
        stmt.setString(1, this.mail);
        stmt.setInt(2, this.id_crypto);
        stmt.executeUpdate();
        stmt.close();
    }

    public void insertFromFb(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "INSERT INTO crypto_favori (id_utilisateur, id_crypto) VALUES ((select id_utilisateur from utilisateur where email=?), ?)";
        PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); 
        stmt.setString(1, this.mail);
        stmt.setInt(2, this.id_crypto);
        stmt.executeUpdate();
        stmt.close();
    }

    public void deleteFromFb(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        try {
            String sql = "DELETE FROM crypto_favori WHERE id_crypto = ? AND id_utilisateur= ?";
            PreparedStatement stmt = conn.prepareStatement(sql); 
            stmt.setInt(1, this.id_crypto);
            stmt.setInt(2, this.id_utilisateur);
            stmt.executeUpdate();
            stmt.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
    }

    public void delete(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "DELETE FROM crypto_favori WHERE id_crypto_favori = ?";
        PreparedStatement stmt = conn.prepareStatement(sql); 
        stmt.setInt(1, this.id_crypto_favori);
        stmt.executeUpdate();
        stmt.close();
    }

    public void actionById_crypto_favoriFromFb(Connection conn) throws SQLException {
        if (this.id_crypto_favori == -1) insertFromFb(conn);
        else deleteFromFb(conn);
    }

    public void actionById_crypto_favori(Connection conn) throws SQLException {
        if (this.id_crypto_favori == -1) insertFromFb(conn);
        else deleteFromFb(conn);
    }

    public void actionByStatusFromFb(Connection conn) throws SQLException {
        if (this.status.equals("favorite")){
            insertFromFb(conn);
            System.out.println("tsy fafakna");
        } 
        else deleteFromFb(conn);
    }

    public void actionByStatus(Connection conn) throws SQLException {
        if (this.status.equals("favorite")) insert(conn);
        else delete(conn);
    }

    public static List<CryptoFavori> getAll(Connection conn) throws SQLException {
        List<CryptoFavori> cryptoFavoris = new ArrayList<>();
        String query = "SELECT * FROM crypto_favori";

        try (PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet res = stmt.executeQuery()) {

            while (res.next()) {
                CryptoFavori cryptoFavori = new CryptoFavori();
                cryptoFavori.setId_crypto(res.getInt("id_crypto"));
                cryptoFavori.setId_crypto_favori(res.getInt("id_crypto_favori"));
                cryptoFavori.setId_utilisateur(res.getInt("id_utilisateur"));
                cryptoFavoris.add(cryptoFavori);
            }
        }
        return cryptoFavoris;
    }

    public List<CryptoFavori> getCryptoFavorisByIdUtilisateur(Connection conn) throws SQLException, Exception {
        List<CryptoFavori> cryptoFavoris = new ArrayList<>();
        String query = "SELECT * FROM crypto_favori WHERE id_utilisateur = ?";

        PreparedStatement stmt = null;
        ResultSet res = null;

        try {
            stmt = conn.prepareStatement(query);
            stmt.setInt(1,id_utilisateur);
            res = stmt.executeQuery();
            while (res.next()) {
                CryptoFavori cryptoFavori = new CryptoFavori();
                cryptoFavori.setId_crypto(res.getInt("id_crypto"));
                cryptoFavori.setId_crypto_favori(res.getInt("id_crypto_favori"));
                cryptoFavori.setId_utilisateur(res.getInt("id_utilisateur"));
                cryptoFavoris.add(cryptoFavori);
            }
        } catch (Exception e) {
            throw e;
        }
        return cryptoFavoris;
    }
    
    
    public List<CryptoFavori> getByCrypto(Connection conn, String nomcrypt) throws SQLException, Exception {
        List<CryptoFavori> cryptoFavoris = new ArrayList<>();
        String query = "SELECT * FROM crypto_favori WHERE id_crypto = (select id_crypto from crypto where nom=?)";

        PreparedStatement stmt = null;
        ResultSet res = null;

        try {
            stmt = conn.prepareStatement(query);
            stmt.setString(1,nomcrypt);
            res = stmt.executeQuery();
            while (res.next()) {
                CryptoFavori cryptoFavori = new CryptoFavori();
                cryptoFavori.setId_crypto(res.getInt("id_crypto"));
                cryptoFavori.setId_crypto_favori(res.getInt("id_crypto_favori"));
                cryptoFavori.setId_utilisateur(res.getInt("id_utilisateur"));
                cryptoFavoris.add(cryptoFavori);
            }
        } catch (Exception e) {
            throw e;
        }
        return cryptoFavoris;
    }
}