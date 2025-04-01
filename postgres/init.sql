CREATE DATABASE cloud;
\c cloud;

CREATE TABLE utilisateur(
   id_utilisateur serial,
   date_inscription timestamp NOT NULL ,
   email VARCHAR(100) NOT NULL,
   mdp VARCHAR(255) NOT NULL,
   PRIMARY KEY(id_utilisateur),
   UNIQUE(email)
);

CREATE TABLE role (
  id_role SERIAL PRIMARY KEY,
  nom_role VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO role (id_role,nom_role) VALUES (1,'Administrateur');
INSERT INTO role (id_role,nom_role) VALUES (2,'Client');

CREATE TABLE utilisateur_role (
  id_utilisateur INTEGER REFERENCES utilisateur(id_utilisateur),
  id_role INTEGER REFERENCES role(id_role),
  PRIMARY KEY (id_utilisateur, id_role)
);

CREATE TABLE token(
   id_token serial,
   token VARCHAR(255) NOT NULL,
   creation timestamp NOT NULL DEFAULT now(),
   duree TIME NOT NULL,
   id_utilisateur INT NOT NULL,
   PRIMARY KEY(id_token),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE utilisateur_temp(
   id_utilisateur serial,
   date_inscription timestamp NOT NULL DEFAULT now(),
   email VARCHAR(100) NOT NULL,
   mdp VARCHAR(255) NOT NULL,
   mdpwh VARCHAR(255),
   PRIMARY KEY(id_utilisateur),
   UNIQUE(email)
);

CREATE TABLE user_pin(
   id_pinuser serial,
   pin VARCHAR(255) NOT NULL,
   creation timestamp NOT NULL DEFAULT now(),
   duree TIME NOT NULL,
   id_utilisateur INT NOT NULL,
   status_pin bool default true,
   PRIMARY KEY(id_pinuser),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);
CREATE TABLE user_attempts (
    mail VARCHAR(255) PRIMARY KEY,
    nb_tentative INT DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE
);

CREATE TABLE token_used
(
    id integer
);

CREATE TABLE crypto(
   id_crypto INTEGER,
   nom VARCHAR(100) ,
   prixdepart NUMERIC(15,3),
   PRIMARY KEY(id_crypto)
);

INSERT INTO crypto (id_crypto, nom, prixdepart)
VALUES
  (1, 'BITCOIN', 50000.00),
  (2, 'ETHEREUM', 3000.00),
  (3, 'CARDANO', 2.00),
  (4, 'XPR', 0.50),
  (5, 'SOLANA', 100.00),
  (6, 'LITECOIN', 150.00),
  (7, 'DOGECOIN', 0.25),
  (8, 'AVALANCHE', 50.00),
  (9, 'RAVENCOIN', 0.05),
  (10, 'ATOM', 20.00);

CREATE TABLE commission_config(
   achat NUMERIC(6,3),
   vente NUMERIC(6,3)
);

INSERT INTO commission_config 
(achat,vente) VALUES (5,5);

CREATE TABLE transaction(
   idtransac SERIAL,
   id_utilisateur INTEGER NOT NULL,
   id_crypto INTEGER NOT NULL,
   dateheure TIMESTAMP NOT NULL DEFAULT NOW(),
   entree NUMERIC(15,8) DEFAULT 0,
   sortie NUMERIC(15,8) DEFAULT 0,
   prixunitaire NUMERIC(15,4) DEFAULT 0,
   commission NUMERIC(15,4) DEFAULT 0,
   PRIMARY KEY(idtransac),
   FOREIGN KEY(id_crypto) REFERENCES crypto(id_crypto),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE mvtwallet(
   idmvtwallet SERIAL,
   dateheure TIMESTAMP NOT NULL DEFAULT now(),
   depot NUMERIC(15,2)  DEFAULT 0,
   retrait NUMERIC(15,2)  DEFAULT 0,
   id_utilisateur INTEGER NOT NULL,
   PRIMARY KEY(idmvtwallet),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE mvtwalletvalid
(
    id integer UNIQUE
);

CREATE TABLE crypto_favori (
    id_crypto_favori serial,
    id_utilisateur int,
    id_crypto int,
    PRIMARY KEY(id_crypto_favori),
    FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur),    
    FOREIGN KEY(id_crypto) REFERENCES crypto(id_crypto)
);

CREATE TABLE cloudinary (
  id_cloudinary SERIAL,
    id_utilisateur int,
    secure_url TEXT,
    PRIMARY KEY (id_cloudinary),
    FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE OR REPLACE VIEW v_liste_transaction
 AS
SELECT
    u.email AS utilisateur,
    t.dateheure,
    c.nom AS cryptomonnaie,
    CASE 
        WHEN t.entree > 0 THEN 'Achat'
        WHEN t.sortie > 0 THEN 'Vente'
        ELSE 'Erreur'
    END AS type_transaction,
    CASE 
        WHEN t.entree > 0 THEN t.entree
        WHEN t.sortie > 0 THEN t.sortie
        ELSE 0
    END AS quantite,
  prixunitaire,
  CASE 
        WHEN t.entree > 0 THEN t.entree*prixunitaire
        WHEN t.sortie > 0 THEN t.sortie*prixunitaire
        ELSE 0
    END AS montant,
  commission
FROM
    transaction t
INNER JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
INNER JOIN crypto c ON t.id_crypto = c.id_crypto
ORDER BY u.id_utilisateur, t.dateheure;



CREATE VIEW public.v_utilisateur_solde
 AS
WITH SoldeParUtilisateur AS (
  SELECT
    u.id_utilisateur,
    SUM(COALESCE(mw.depot, 0)) - SUM(COALESCE(mw.retrait, 0)) AS solde
  FROM
    utilisateur u
  LEFT JOIN mvtwallet mw ON u.id_utilisateur = mw.id_utilisateur
  LEFT JOIN mvtwalletvalid mvwv ON mw.idmvtwallet = mvwv.id
   where  mvwv.id IS not NULL
  GROUP BY u.id_utilisateur
)
SELECT
  u.id_utilisateur,
  COALESCE(s.solde, 0) AS solde
FROM
  utilisateur u
LEFT JOIN SoldeParUtilisateur s ON u.id_utilisateur = s.id_utilisateur;



CREATE or replace VIEW public.v_utilisateur_crypto
 AS
SELECT 
   u.id_utilisateur,
   u.email,
   c.id_crypto,
    c.nom AS nom_crypto,
    SUM(t.entree) - SUM(t.sortie) AS quantite_detenue
FROM 
    utilisateur u
JOIN 
    transaction t ON u.id_utilisateur = t.id_utilisateur
JOIN 
    crypto c ON t.id_crypto = c.id_crypto
GROUP BY 
    u.id_utilisateur, u.email, c.id_crypto, c.nom
HAVING 
    SUM(t.entree) - SUM(t.sortie) > 0;    

CREATE VIEW public.v_liste_commission
 AS
SELECT
    t.dateheure,
    c.nom AS cryptomonnaie,
    CASE 
        WHEN t.entree > 0 THEN 'Achat'
        WHEN t.sortie > 0 THEN 'Vente'
        ELSE 'Erreur'
    END AS type_transaction,
    t.commission
FROM
    transaction t
INNER JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
INNER JOIN crypto c ON t.id_crypto = c.id_crypto
ORDER BY t.dateheure;    

INSERT INTO utilisateur_temp (email,mdp,date_inscription) VALUES
('notahina.rzf@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('rabenaivolucas@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('tokisword@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('randriamanantenavony@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('nancyrabezakarison@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('manda.andriambololona1@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('matthieuandrianarisoa@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('maheryrambinitsoa.14@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('rabenjamandresy@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('rojo.rabenanahary@gmail.com','e10adc3949ba59abbe56e057f20f883e',now());

INSERT INTO utilisateur (email,mdp,date_inscription) VALUES
('notahina.rzf@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('rabenaivolucas@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('tokisword@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('randriamanantenavony@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('nancyrabezakarison@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('manda.andriambololona1@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('matthieuandrianarisoa@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('maheryrambinitsoa.14@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('rabenjamandresy@gmail.com','e10adc3949ba59abbe56e057f20f883e',now()),
('rojo.rabenanahary@gmail.com','e10adc3949ba59abbe56e057f20f883e',now());

INSERT INTO user_attempts (mail,nb_tentative) VALUES
('notahina.rzf@gmail.com', 4),
('rabenaivolucas@gmail.com', 4),
('tokisword@gmail.com', 4),
('randriamanantenavony@gmail.com', 4),
('nancyrabezakarison@gmail.com', 4),
('manda.andriambololona1@gmail.com', 4),
('matthieuandrianarisoa@gmail.com', 4),
('maheryrambinitsoa.14@gmail.com', 4),
('rabenjamandresy@gmail.com', 4),
('rojo.rabenanahary@gmail.com', 4);

INSERT INTO utilisateur_role (id_utilisateur,id_role) VALUES
(1,1),(2,1),
(3,1),(4,1),
(5,1),(6,1),
(7,1),(8,1),
(9,1),(10,1);

-- mvtwallet (Dépôt de 1000€ pour chaque utilisateur)
INSERT INTO mvtwallet (dateheure, depot, retrait, id_utilisateur)
VALUES 
('2025-01-01 09:00:00', 1000.00, 0.00, 1),
('2025-01-01 09:00:00', 1000.00, 0.00, 2),
('2025-01-01 09:00:00', 1000.00, 0.00, 3),
('2025-01-01 09:00:00', 1000.00, 0.00, 4),
('2025-01-01 09:00:00', 1000.00, 0.00, 5),
('2025-01-01 09:00:00', 1000.00, 0.00, 6),
('2025-01-01 09:00:00', 1000.00, 0.00, 7),
('2025-01-01 09:00:00', 1000.00, 0.00, 8),
('2025-01-01 09:00:00', 1000.00, 0.00, 9),
('2025-01-01 09:00:00', 1000.00, 0.00, 10);

-- mvtwalletvalid (Validation des dépôts)
INSERT INTO mvtwalletvalid (id) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

-- Transaction (Achat de 950€ de crypto + 50€ de commission)
-- Chaque utilisateur achète une crypto différente (1 à 10)
INSERT INTO transaction (id_utilisateur, id_crypto, dateheure, entree, prixunitaire, commission)
VALUES
-- Utilisateur 1 achète BITCOIN (950€ / 50000 = 0.019 BTC)
(1, 1, '2025-01-01 10:00:00', 0.019, 50000.0000, 50.0000),
-- Utilisateur 2 achète ETHEREUM (950€ / 3000 = 0.3167 ETH)
(2, 2, '2025-01-01 10:00:00', 0.3167, 3000.0000, 50.0000),
-- Utilisateur 3 achète CARDANO (950€ / 2 = 475 ADA)
(3, 3, '2025-01-01 10:00:00', 475.0000, 2.0000, 50.0000),
-- [...] (Continuer pour les autres utilisateurs et cryptos)
(4, 4, '2025-01-01 10:00:00', 1900.0000, 0.5000, 50.0000), -- XPR (950€ / 0.5 = 1900 XPR)
(5, 5, '2025-01-01 10:00:00', 9.5000, 100.0000, 50.0000),  -- SOLANA
(6, 6, '2025-01-01 10:00:00', 6.3333, 150.0000, 50.0000),  -- LITECOIN
(7, 7, '2025-01-01 10:00:00', 3800.0000, 0.2500, 50.0000), -- DOGECOIN
(8, 8, '2025-01-01 10:00:00', 19.0000, 50.0000, 50.0000),  -- AVALANCHE
(9, 9, '2025-01-01 10:00:00', 19000.0000, 0.0500, 50.0000),-- RAVENCOIN
(10, 10, '2025-01-01 10:00:00', 47.5000, 20.0000, 50.0000);-- ATOM

-- mvtwallet (Retrait de 1000€ par achat : 950€ + 50€ de commission)
INSERT INTO mvtwallet (dateheure, depot, retrait, id_utilisateur)
VALUES 
('2025-01-01 10:00:00', 0.00, 1000.00, 1),
('2025-01-01 10:00:00', 0.00, 1000.00, 2),
('2025-01-01 10:00:00', 0.00, 1000.00, 3),
('2025-01-01 10:00:00', 0.00, 1000.00, 4),
('2025-01-01 10:00:00', 0.00, 1000.00, 5),
('2025-01-01 10:00:00', 0.00, 1000.00, 6),
('2025-01-01 10:00:00', 0.00, 1000.00, 7),
('2025-01-01 10:00:00', 0.00, 1000.00, 8),
('2025-01-01 10:00:00', 0.00, 1000.00, 9),
('2025-01-01 10:00:00', 0.00, 1000.00, 10);

-- mvtwalletvalid (Validation des achats)
INSERT INTO mvtwalletvalid (id) VALUES (11), (12), (13), (14), (15), (16), (17), (18), (19), (20);

-- Transaction (Vente avec +10% de gain et 5% de commission)
INSERT INTO transaction (id_utilisateur, id_crypto, dateheure, sortie, prixunitaire, commission)
VALUES
-- Utilisateur 1 vend BITCOIN à 55000€ (+10%)
(1, 1, '2025-01-02 11:00:00', 0.019, 55000.0000, 52.2500), -- 0.019 * 55000 = 1045€ ; 5% = 52.25€
-- Utilisateur 2 vend ETHEREUM à 3300€ (+10%)
(2, 2, '2025-01-02 11:00:00', 0.3167, 3300.0000, 52.2500),
-- [...] (Continuer pour les autres utilisateurs)
(3, 3, '2025-01-02 11:00:00', 475.0000, 2.2000, 52.2500), -- CARDANO
(4, 4, '2025-01-02 11:00:00', 1900.0000, 0.5500, 52.2500), -- XPR
(5, 5, '2025-01-02 11:00:00', 9.5000, 110.0000, 52.2500),  -- SOLANA
(6, 6, '2025-01-02 11:00:00', 6.3333, 165.0000, 52.2500),  -- LITECOIN
(7, 7, '2025-01-02 11:00:00', 3800.0000, 0.2750, 52.2500), -- DOGECOIN
(8, 8, '2025-01-02 11:00:00', 19.0000, 55.0000, 52.2500),  -- AVALANCHE
(9, 9, '2025-01-02 11:00:00', 19000.0000, 0.0550, 52.2500),-- RAVENCOIN
(10, 10, '2025-01-02 11:00:00', 47.5000, 22.0000, 52.2500);-- ATOM

-- mvtwallet (Dépôt après vente : 1045€ - 52.25€ = 992.75€)
INSERT INTO mvtwallet (dateheure, depot, retrait, id_utilisateur)
VALUES 
('2025-01-02 11:00:00', 992.75, 0.00, 1),
('2025-01-02 11:00:00', 992.75, 0.00, 2),
('2025-01-02 11:00:00', 992.75, 0.00, 3),
('2025-01-02 11:00:00', 992.75, 0.00, 4),
('2025-01-02 11:00:00', 992.75, 0.00, 5),
('2025-01-02 11:00:00', 992.75, 0.00, 6),
('2025-01-02 11:00:00', 992.75, 0.00, 7),
('2025-01-02 11:00:00', 992.75, 0.00, 8),
('2025-01-02 11:00:00', 992.75, 0.00, 9),
('2025-01-02 11:00:00', 992.75, 0.00, 10);

-- mvtwalletvalid (Validation des ventes)
INSERT INTO mvtwalletvalid (id) VALUES (21), (22), (23), (24), (25), (26), (27), (28), (29), (30);

-- mvtwallet (5 dépôts et 5 retraits aléatoires)
INSERT INTO mvtwallet (dateheure, depot, retrait, id_utilisateur)
VALUES 
('2025-01-03 12:00:00', 500.00, 0.00, 1),  -- Dépôt
('2025-01-03 12:00:00', 0.00, 300.00, 2),  -- Retrait
('2025-01-03 12:00:00', 700.00, 0.00, 3),  -- Dépôt
('2025-01-03 12:00:00', 0.00, 200.00, 4),  -- Retrait
('2025-01-03 12:00:00', 400.00, 0.00, 5),  -- Dépôt
('2025-01-03 12:00:00', 0.00, 600.00, 6),  -- Retrait
('2025-01-03 12:00:00', 800.00, 0.00, 7),  -- Dépôt
('2025-01-03 12:00:00', 0.00, 100.00, 8),  -- Retrait
('2025-01-03 12:00:00', 900.00, 0.00, 9),  -- Dépôt
('2025-01-03 12:00:00', 0.00, 250.00, 10); -- Retrait

-- mvtwalletvalid (Validation des mouvements)
INSERT INTO mvtwalletvalid (id) VALUES (31), (32), (33), (34), (35), (36), (37), (38), (39), (40);

























