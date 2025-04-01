/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package acces;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author itu
 */
public class Connexion {
    public Connection getConnection() throws SQLException{
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException ex) {
            //Logger.getLogger(Connection.class.getName()).log(Level.SEVERE, null, ex);
        }
        String url="jdbc:postgresql://localhost:5432/cloud";
        Connection con = DriverManager.getConnection(url, "postgres", "2348");
        return con;
    }
}
