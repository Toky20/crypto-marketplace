package model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class UserImage {
    private int id;
    private int id_utilisateur;
    private String secure_url;
    private String imagePath;
    private String mail;
   
    public UserImage() {
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
    
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
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

    public String getSecure_url() {
        return secure_url;
    }
    public void setSecure_url(String secure_url) {
        this.secure_url = secure_url;
    }
    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void insertFromFb(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "INSERT INTO cloudinary (id_utilisateur, secure_url) VALUES ((select id_utilisateur from utilisateur where email=?), ?)";
        PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); 
        stmt.setString(1, this.mail);
        stmt.setString(2, this.secure_url);
        stmt.executeUpdate();
        stmt.close();
    }

    public void writeToDb(Connection conn) throws SQLException {
        if (recordExists(conn)) {
            updateFromFb(conn);
        } else {
            insertFromFb(conn);
        }
    }
    
    private boolean recordExists(Connection conn) throws SQLException {
        String checkSql = "SELECT COUNT(*) FROM cloudinary WHERE id_utilisateur = ?";
        try (PreparedStatement stmt = conn.prepareStatement(checkSql)) {
            stmt.setInt(1, this.id_utilisateur);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }
    
    private void updateFromFb(Connection conn) throws SQLException {
        String updateSql = "UPDATE cloudinary SET secure_url = ? WHERE id_utilisateur = (select id_utilisateur from utilisateur where email=?)";
        try (PreparedStatement stmt = conn.prepareStatement(updateSql)) {
            stmt.setString(1, this.secure_url);
            stmt.setString(2, this.mail);
            stmt.executeUpdate();
        }
    }

    public void deleteFromFb(Connection conn) throws SQLException {
        // Requête préparée pour éviter les injections SQL
        String sql = "DELETE FROM cloudinary WHERE secure_url = ? AND id_utilisateur = ?";
        PreparedStatement stmt = conn.prepareStatement(sql); 
        stmt.setString(1, this.secure_url);
        stmt.setInt(2, this.id_utilisateur);
        stmt.executeUpdate();
        stmt.close();
    }

    public static List<UserImage> getAll(Connection conn) throws Exception {
        List<UserImage> list = new ArrayList<>();
        String query = "SELECT * FROM cloudinary";

        try (PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet res = stmt.executeQuery()) {

            while (res.next()) {
                UserImage userImage = new UserImage();
                userImage.setId(res.getInt("id_cloudinary"));
                userImage.setId_utilisateur(res.getInt("id_utilisateur"));
                userImage.setSecure_url(res.getString("secure_url"));
                userImage.setMail(conn);
                list.add(userImage);
            }
        }
        return list;
    }

    public List<UserImage> getUserImageByIdUtilisateur(Connection conn) throws SQLException, Exception {
        List<UserImage> list = new ArrayList<>();
        String query = "SELECT * FROM cloudinary WHERE id_utilisateur = ?";

        PreparedStatement stmt = null;
        ResultSet res = null;

        try {
            stmt = conn.prepareStatement(query);
            stmt.setInt(1,id_utilisateur);
            res = stmt.executeQuery();
            while (res.next()) {
                UserImage userImage = new UserImage();
                userImage.setId(res.getInt("id_cloudinary"));
                userImage.setId_utilisateur(res.getInt("id_utilisateur"));
                userImage.setSecure_url(res.getString("secure_url"));
                userImage.setMail(conn);
                list.add(userImage);
            }
        } catch (Exception e) {
            throw e;
        }
        return list;
    }
    
    public List<UserImage> getUserImageByMail(Connection conn,String mail) throws SQLException, Exception {
        List<UserImage> list = new ArrayList<>();
        String query = "SELECT * FROM cloudinary WHERE id_utilisateur = (select id_utilisateur from utilisateur where email=?)";

        PreparedStatement stmt = null;
        ResultSet res = null;

        try {
            stmt = conn.prepareStatement(query);
            stmt.setString(1,mail);
            res = stmt.executeQuery();
            while (res.next()) {
                UserImage userImage = new UserImage();
                userImage.setId(res.getInt("id_cloudinary"));
                userImage.setId_utilisateur(res.getInt("id_utilisateur"));
                userImage.setSecure_url(res.getString("secure_url"));
                userImage.setMail(conn);
                list.add(userImage);
            }
        } catch (Exception e) {
            throw e;
        }
        return list;
    }
}
