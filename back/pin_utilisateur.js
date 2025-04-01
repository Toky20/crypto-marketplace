class PinUtilisateur {
  // constructor(id_pin,mail_user,pin,date_creation,duree) {
  constructor(id_pin,id_user,pin,date_creation,duree,status) {
    this.setId_pin(id_pin);
    this.setId_user(id_user);
    // this.setMail_user(mail_user)
    this.setPin(pin);
    this.setDate_creation(date_creation);
    this.setDuree(duree);
    this.setDate_fin();
    this.setStatus(status);
  }

  setId_pin(id) {
    if (id == null) {
      this.id_pin = null;
    } else {
      this.id_pin = id;
    }
  }

  getId_pin() {
    return this.id_pin;
  }

  setId_user(user) {
    this.id_user = user;
  }

  getId_user() {
    return this.id_user;
  }

  // setMail_user(id) {
  //   this.mail_user = id;
  // }

  // getMail_user() {
  //   return this.mail_user;
  // }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  setPin(pin) {
    if (pin == null) {
      this.pin = this.generatePin();
    } else {
      this.pin = pin;
    }
  }

  getPin() {
    return this.pin;
  }

  setDate_creation(date) {
    if (date == null) {
      this.date_creation = new Date();
    } else {
      this.date_creation = date;
    }
  }

  getDate_creation() {
    return this.date_creation;
  }

  setDuree(duree) {
    if (duree == null) {
      this.duree = '00:01:30';
    } else {
      this.duree = duree;
    }
  }

  getDuree() {
    return this.duree;
  }

  setDate_fin() {
    this.date_fin = this.calculateDateFin();
  }

  getDate_fin() {
    return this.date_fin;
  }

  // Converts 'HH:mm:ss' to total seconds
  convertDureeToSeconds(duree) {
    const [hours, minutes, seconds] = duree.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  // Generate a 6-digit random pin
  generatePin() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // Calculate the end date
  calculateDateFin() {
    return new Date(this.date_creation.getTime() + this.convertDureeToSeconds(this.duree) * 1000);
  }

  static async executeQuery(query, params, connection) {
    return new Promise((resolve, reject) => {
      if (params) {
        connection.query(query, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows);
          }
        });
      } else {
        connection.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows);
          }
        });
      }
    });
  }


  // Insert a new pin into the database
  async insertPinUtilisateur(conn) {
    try {
      // INSERT INTO user_pin (pin, creation, duree, date_fin, mail_user)
      const query = `
        INSERT INTO user_pin (pin, creation, duree,id_utilisateur)
        VALUES ($1, $2, $3, $4)
      `;
      const values = [
        this.getPin(),
        this.getDate_creation(),
        this.getDuree(),
        // this.getDate_fin(),
        // this.getMail_user()
        this.getId_user()
      ];
      await PinUtilisateur.executeQuery(query, values, conn);
      console.log("pinUtilisateur inséré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'insertion du pin de l'utilisateur :", error);
      throw error;
    }
  }

  // disable pin when wrong pin delivered
  async disablePin(conn) {
    try {
      const query = "UPDATE user_pin SET status_pin = false WHERE id_pinuser = $1";
      const values = [this.getId_pin()];
      await PinUtilisateur.executeQuery(query, values, conn);
      console.log("devalidation du pin avec succès avec id pin:",this.getId_pin());
    } catch (error) {
      console.error("Erreur lors de la devalidation du pin de l'utilisateur :", error);
      throw error;
    }
  }

  // Fetch the latest pin for a user
  // static async selectPinByMailUserByMaxDateCreation(mail,conn) {
  //   let rep = undefined;
  //   try {
  //     // const query = "SELECT * FROM user_pin WHERE id_utilisateur = (SELECT id_utilisateur FROM utilisateur WHERE email = $1) ORDER BY creation DESC LIMIT 1";
  //     const query = "SELECT * FROM user_pin WHERE id_utilisateur";
  //     const rows = await PinUtilisateur.executeQuery(query, [mail], conn);
  //     if (rows.length > 0) {
  //       // pinUtilisateur = new PinUtilisateur(rows[0].id_pin,rows[0].mail_user,rows[0].pin,rows.date_creation,rows[0].duree);
  //       rep =  new PinUtilisateur(rows[0].id_pinuser,rows[0].id_utilisateur,rows[0].pin,rows.creation,rows[0].duree);
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération du pinutilisateur par mail :", error);
  //     throw error;
  //   }
  //   return rep;
  // }

  static async selectPinByMailUserByMaxDateCreation(mail, conn) {
    let u = undefined;
    try {
      const query = "SELECT * FROM user_pin WHERE id_utilisateur = (SELECT id_utilisateur FROM utilisateur WHERE email = $1) ORDER BY creation DESC LIMIT 1";
      const rows = await PinUtilisateur.executeQuery(query, [mail], conn);

      if (rows.length > 0) {
        u = new PinUtilisateur(rows[0].id_pinuser,rows[0].id_utilisateur,rows[0].pin,rows[0].creation,rows[0].duree,rows[0].status_pin);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du pinutilisateur par mail :", error);
      throw error;
    }
    return u;
  }

}

module.exports = PinUtilisateur;
