/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;


public class Crypto {
    private int id_crypto;
    private String nom;
    private double prixdepart;

    public Crypto(int id_crypto, String nom, double prixdepart) {
        this.id_crypto = id_crypto;
        this.nom = nom;
        this.prixdepart = prixdepart;
    }

    public Crypto() {
    }

    public int getId_crypto() {
        return id_crypto;
    }

    public void setId_crypto(int id_crypto) {
        this.id_crypto = id_crypto;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public double getPrixdepart() {
        return prixdepart;
    }

    public void setPrixdepart(double prixdepart) {
        this.prixdepart = prixdepart;
    }
    
    public List<Crypto> getAll(Connection connection) throws SQLException {
        List<Crypto> cryptos = new ArrayList<>();
        String sql = "SELECT * FROM crypto";
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                Crypto crypto = new Crypto();
                crypto.setId_crypto(resultSet.getInt("id_crypto"));
                crypto.setNom(resultSet.getString("nom"));
                crypto.setPrixdepart(resultSet.getDouble("prixdepart"));
                cryptos.add(crypto);
            }
        }
        return cryptos;
    }
}
