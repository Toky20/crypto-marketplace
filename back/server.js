const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Connection = require('./connection.js');
const path = require('path');
const router = express.Router();
const md5 = require('md5');

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

const Utilisateur = require('./user.js');
const SendMail = require('./sendMail.js');
const HtmlGenerator = require('./htmlGenerator.js'); 
const cookieParser = require('cookie-parser');

const Login = require('./login');
const UserAttempt = require('./user_attempt.js');
const Util = require('./util.js');
const MailSender = require('./mailsender.js');
const Authentification = require('./authentification.js');
const GestionCompte = require('./gestioncompte.js');
const crypto = require('crypto');
const PinUtilisateur = require('./pin_utilisateur.js'); 
const Token = require('./token.js');

app.use('/', router);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get('/getBlocTest', async (req, res) => {
//     try {
//         const pool = await Connection.getConnectionPostgres();
//         const result = await Inscription.getBlocTest(pool);
//         res.json(result);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
// });

// app.get('/getOkTest', async (req, res) => {
//     try {
//         const inscription = new Inscription();
//         const repOk = inscription.getDonneeTest();
//         res.json(repOk);
//     } catch (error) {
//       console.error('Error fetching OK test data:', error);
//       res.status(500).json({ error: 'Internal Server Error: Failed to fetch OK test data.' });
//     }
//   });

  // Swagger configuration
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'API documentation for user authentication and management',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                },
            ],
            components: {
                securitySchemes: {
                    BearerToken: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [{ BearerToken: [] }],
        },
        apis: [__filename],
    };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
 * /createUserTemp:
 *   post:
 *     summary: Create a temporary user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 description: Email of the user
 *               mdp:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Internal Server Error
 */
  app.post('/createUserTemp', async (req, res) => {
    try {
        const connection  = await Connection.getConnectionPostgres();
        const mail = req.body.mail;
        const mdp = req.body.mdp;

        const utilisateur_temp = new Utilisateur(undefined, mail, mdp, undefined);
        // console.log(utilisateur_temp.getMail());
        const idUserTemp = await utilisateur_temp.insertUserTemp(connection);
        console.log("Utilisateur_Temp inséré avec succès, ID :", idUserTemp);
        
        // Envoi de l'ID utilisateur dans un cookie
        res.cookie('idUserTemp', idUserTemp, { httpOnly: true, secure: false }); // Configurer `secure: true` pour HTTPS
        const inscriptionHtml = await HtmlGenerator.inscriptionGenerator('http://localhost:3000/createUser?idUserTemp='+idUserTemp);

        await SendMail.reelSend(mail, 'URL d insertion', inscriptionHtml);
        res.status(200).json({  status : 'succes',
                            code: 200,
                            error:null,
                            message: "Compte cree avec succes ! Veuillez activer votre compte via email maintenant. Vous allez etre redirige directement vers la page de login.",
                            data:null});
    } catch (error) {
        return res.json({  status : 'echec',
                                code: 500,
                                error:{ message : "Une erreur est survenue lors de la création de l\'utilisateur"},
                                data:null,
                                message : "Une erreur est survenue lors de la création de l\'utilisateur",
                                token : null});

    }
});


/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Transfer temporary user data to permanent user table
 *     tags: [User Management]
 *     parameters:
 *       - in: query
 *         name: idUserTemp
 *         schema:
 *           type: string
 *           description: ID du compte utilisateur.
 *         required: true
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           description: role du compte attribué.
 *         required: true 
 *     responses:
 *       200:
 *         description: User data transferred successfully
 *       400:
 *         description: Missing temporary user ID
 *       500:
 *         description: Internal Server Error
 */
app.all('/createUser', async (req, res) => {
    try {
        const connection  = await Connection.getConnectionPostgres();

        // Récupération de l'ID utilisateur temporaire depuis les paramètres de requête
        const idUserTemp = req.query.idUserTemp;
        const role = req.query.role;

        if (!idUserTemp || !role) {
            return res.status(400).json({  status : 'echec',
                                code: 400,
                                error:{ message : "URL invalide"},
                                data:null,
                                token : null});
        }
        console.log("ID utilisateur temporaire ", idUserTemp);

        await Utilisateur.transfertDonnees(idUserTemp, role, connection);

        const userResult = await Utilisateur.getUserById(idUserTemp,connection);

        const userAttempt = new UserAttempt();
        const maxAttempts = Util.getMaxAttempts();
        await userAttempt.insertOrUpdateUserAttempt(userResult.getMail(), maxAttempts, false);
        res.status(200).json({  status : 'succes',
                                code: 200,
                                error:null,
                                data:null,
                                token : null,
                                message: 'Utilisateur insere avec succès !'
                              });
    } catch (error) {
      console.error('Error fetching OK test data:', error);
      res.status(500).json({  status : 'echec',
                                code: 500,
                                error: error,
                                data:null,
                                token : null});
    }
  });

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 description: User email
 *               mdp:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 */
app.post('/auth', async (req, res) => {
    const { mail, mdp } = req.body;
    const response = await Authentification.processAuthentication(mail, mdp);

    res.json(response);
});

/**
 * @swagger
 * /reset-attempts:
 *   get:
 *     summary: Réinitialise les tentatives de connexion d'un utilisateur.
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           description: Adresse e-mail de l'utilisateur.
 *         required: true
 *     responses:
 *       200:
 *         description: Tentatives réinitialisées avec succès.
 *       400:
 *         description: Paramètre e-mail manquant.
 *       500:
 *         description: Erreur interne du serveur.
 */
app.get('/reset-attempts', async (req, res) => {
    const { email } = req.query; // Récupérer l'email depuis le query param
    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'L\'email est requis pour reinitialiser les tentatives.'
        });
    }

    try {
        const userAttempt = new UserAttempt();
        const currentAttempts = await userAttempt.getUserAttempt(email);
        if (currentAttempts.isLocked) {
            const maxAttempts = Util.getMaxAttempts();
            await userAttempt.insertOrUpdateUserAttempt(email, maxAttempts, false);
            return res.status(200).json({
                status: 'success',
                message: `Vos tentatives ont ete reinitialisees avec succès à ${maxAttempts} tentatives. Vous pouvez maintenant essayer de vous reconnecter.`
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Aucun compte verrouille trouve avec cet email.'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la reinitialisation des tentatives:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Une erreur est survenue lors de la reinitialisation des tentatives.'
        });
    }
});

/**
 * @swagger
  * /sendPinEmail:
  *  get:
  *    summary: Send a verification PIN to the user's email
  *    description: Generates a PIN for the user and sends it to their email address.
  *    tags:
  *      - User Management
  *    parameters:
  *      - in: query
  *        name: mail_user
  *        required: true
  *        description: The email of the user to whom the PIN will be sent.
  *        schema:
  *          type: string
  *    responses:
  *      '200':
  *        description: PIN sent successfully.
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: string
  *                  example: succes
  *                code:
  *                  type: integer
  *                  example: 200
  *                error:
  *                  type: null
  *                  example: null
  *                message:
  *                  type: string
  *                  example: PIN sent successfully
  *                data:
  *                  type: null
  *                  example: null
  *      '404':
  *        description: User not found.
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: string
  *                  example: echec
  *                code:
  *                  type: integer
  *                  example: 404
  *                error:
  *                  type: object
  *                  properties:
  *                    message:
  *                      type: string
  *                      example: User not found
  *                data:
  *                  type: null
  *                  example: null
  *                token:
  *                  type: null
  *                  example: null
  *      '500':
  *        description: Internal server error occurred.
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: string
  *                  example: echec
  *                code:
  *                  type: integer
  *                  example: 500
  *                error:
  *                  type: object
  *                  properties:
  *                    message:
  *                      type: string
  *                      example: Internal Server Error
  *                data:
  *                  type: null
  *                  example: null
  *                token:
  *                  type: null
  *                  example: null
  *
  */
app.get('/sendPinEmail', async (req, res) => {
    try {
        const { mail_user } = req.query;
        // console.log(mail_user);
        const pool = await Connection.getConnectionPostgres();
        const userResult = await Utilisateur.getUserByMail(mail_user,pool);
        // console.log(userResult);
        
        if (userResult.rowCount === 0) {
            return res.status(404).json({  status : 'echec',
                        code: 404,
                        error:{ message : "User not found"},
                        data:null,
                        token : null});
        }
  
        // Create a new pin
        const pinInstance = new PinUtilisateur(undefined,userResult.getId(),undefined,undefined,undefined);
        console.log(pinInstance.getDate_creation());
        console.log(pinInstance.getPin());
        // Insert pin into DB
        await pinInstance.insertPinUtilisateur(pool);
  
        const pinHtml = await HtmlGenerator.pinGenerator(pinInstance.getPin(), pinInstance.getDate_fin());
  
        // // Send the pin via email
        // const mailHandler = new MailHandler(
        //   userResult.getMail(),
        //   "Your Verification PIN",
        //   `<p>Your PIN is: <strong>${pinInstance.pin}</strong></p>
        //    <p>It is valid until: ${pinInstance.date_fin}</p>`
        // );
        // await mailHandler.sendMail();
        await SendMail.reelSend(mail_user, 'URL', pinHtml);
            return res.status(200).json({  status : 'succes',
                            code: 200,
                            error:null,
                            message: "PIN sent successfully",
                            data:null});
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({  status : 'echec',
                                code: 500,
                                error:{ message : "Internal Server Error"},
                                data:null,
                                token : null});
        }
  });

/**
 * @swagger
 * /verifyPin:
 *   post:
 *     summary: Verify a user's PIN
 *     description: Verify if the user's PIN is valid, not expired, and matches the latest PIN issued for the user.
 *     tags:
 *       - User Management
 *     parameters:
 *       - in: query
 *         name: mail_user
 *         required: true
 *         description: The email of the user whose PIN is to be verified.
 *         schema:
 *           type: string
 *       - in: query
 *         name: pin
 *         required: true
 *         description: The PIN provided by the user for verification.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: PIN verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: succes
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 error:
 *                   type: null
 *                   example: null
 *                 data:
 *                   type: null
 *                   example: null
 *                 token:
 *                   type: string
 *                   example: validTokenHere
 *       '400':
 *         description: PIN has expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: echec
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: PIN has expired
 *                 data:
 *                   type: null
 *                   example: null
 *                 token:
 *                   type: null
 *                   example: null
 *       '404':
 *         description: Failed to verify PIN or no PIN found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: echec
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: No PIN found for this user or Failed to verify PIN
 *                 data:
 *                   type: null
 *                   example: null
 *                 token:
 *                   type: null
 *                   example: null
 *       '500':
 *         description: No valid PIN or invalid PIN entered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: echec
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: No valid PIN, please ask for a new PIN or unvalid inserted PIN, please ask for another PIN
 *                 data:
 *                   type: null
 *                   example: null
 *                 token:
 *                   type: null
 *                   example: null
 *
 */
app.post('/verifyPin', async (req, res) => {
    const { mail_user, pin } = req.query;
    console.log(mail_user);
    console.log(pin);
      try {
        // Fetch the latest pin for the user
        const pool = await Connection.getConnectionPostgres();
        const userResult = await Utilisateur.getUserByMail(mail_user,pool);
        const latestPinUser = await PinUtilisateur.selectPinByMailUserByMaxDateCreation(mail_user, pool);
        console.log(latestPinUser);
        if (!latestPinUser) {
          return res.json({  status : 'echec',
                                code: 404,
                                error:{ message : "No PIN found for this user"},
                                data:null,
                                message : "No PIN found for this user",
                                token : null});
        }

        if (latestPinUser.getStatus() == false) {
        return res.json({  status : 'echec',
                                code: 500,
                                error:{ message : "PIN non valid, Veuillez vous reconnecter à la page de login"},
                                data:null,
                                message : "PIN non valid, Veuillez vous reconnecter à la page de login",
                                token : null});
        }
    
        // Check if the pin is expired
        const now = new Date();
        const dateFin = new Date(latestPinUser.getDate_fin());
    
        console.log(now);
        console.log(dateFin);
        if (dateFin < now) {
          return res.json({  status : 'echec',
                                code: 400,
                                error:{ message : "PIN has expired, Veuillez vous reconnecter à la page de login"},
                                data:null,
                                message : "PIN has expired, Veuillez vous reconnecter à la page de login",
                                token : null});
        }
    
        console.log("last pin " + latestPinUser.getPin());
        // Check if the provided pin matches the latest one
        if (latestPinUser.getPin() == pin) {
          const id = latestPinUser.getId_user();

          // Insérer le token
        var tokenReturn = await Token.createToken(pool,id);
        var idrole=await Token.getIdRoleByToken(pool,tokenReturn);
        latestPinUser.disablePin(pool);

        return res.status(200).json({  status : 'succes',
                                code: 200,
                                error:null,
                                data:null,
                                message : "Connecte avec succes",
                                token : tokenReturn,
                                idrole : idrole
                              });
        } else {
          latestPinUser.disablePin(pool);
          console.log("the mail to update tentative:",mail_user);
          const userAttempt = new UserAttempt();
          const tentative = await userAttempt.getUserAttempt(mail_user);
          await userAttempt.insertOrUpdateUserAttempt(mail_user,tentative.nbTentative,null);
          return res.json({  status : 'echec',
                                code: 500,
                                error:{ message : "unvalid inserted PIN, please ask for another PIN"},
                                data:null,
                                message : "unvalid inserted PIN, please ask for another PIN",
                                token : null});
        }
      } catch (error) {
        //res.status(500).json({ error: "Failed to verify PIN", details: error.message });
        console.error(error);
        return res.json({  status : 'echec',
                                code: 404,
                                error:{ message : "Failed to verify PIN"},
                                data:null,
                                message : "Failed to verify PIN",
                                token : null});
      }
  });
  

/**
 * @swagger
 * /checkToken:
 *   post:
 *     summary: Verify token validity
 *     tags: [User Management]
 *     security:
 *       - BearerToken: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
  app.post('/checkToken', async (req, res) => {
    try {
      // Récupérer le token dans l'en-tête Authorization
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.json({
          status: 'echec',
          code: 400,
          error: { message: 'Token manquant dans l\'entête Authorization' } ,
          data: null,
          token: null
        });
      }

      // Extraire le token de l'en-tête Authorization
      const token = authHeader.split(' ')[1]; // Supposons que l'en-tête est de type "Bearer <token>"
  
      if (!token) {
        return res.json({
          status: 'echec',
          code: 400,
          error: { message: 'Token invalide ou mal formate' },
          data: null,
          token: null
        });
      }
  
      // Obtenir la connexion à la base de données
      const pool = await Connection.getConnectionPostgres();
  
      // Vérifier le token et générer un nouveau token
      const newToken = await Token.verifyAndGenerateNewToken(pool, token);
  
      if (newToken) {
        var idrole=await Token.getIdRoleByToken(pool,newToken);
        // Si le token est valide et qu'un nouveau token a été généré, renvoyer ce nouveau token
        return res.status(200).json({
          status: 'succes',
          code: 200,
          error: null,
          data: null,
          token: newToken,
          idrole: idrole
        });
      } else {
        // Si le token est invalide ou expiré, renvoyer une erreur
        return res.json({
          status: 'echec',
          code: 401,
          error: { message: 'Accès refuse : token invalide ou expire' },
          data: null,
          token: null
        });
      }
    } catch (error) {
      console.error(error);
      return res.json({
        status: 'echec',
        code: 500,
        error: { message: error.message },
        data: null,
        token: null
      });
    }
  });
  

/**
 *  @swagger
 *    /updatePassword:
 *      post:
 *        summary: Update user password
 *        description: This endpoint allows a user to update their password after providing a valid bearer token.
 *        tags:
 *          - User Management
 *        security:
 *          - BearerToken: []
 *        parameters:
 *          - in: query
 *            name: newPassword
 *            required: true
 *            description: The new password to set for the user.
 *            schema:
 *              type: string
 *        responses:
 *          '200':
 *            description: Password updated successfully.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: succes
 *                    code:
 *                      type: integer
 *                      example: 200
 *                    error:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: null
 *                    data:
 *                      type: null
 *                    token:
 *                      type: string
 *                      example: newGeneratedTokenHere
 *          '400':
 *            description: Missing or invalid token.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: echec
 *                    code:
 *                      type: integer
 *                      example: 400
 *                    error:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: Token manquant dans l'entête Authorization
 *                    data:
 *                      type: null
 *                    token:
 *                      type: null
 *          '401':
 *            description: Invalid or expired token.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: echec
 *                    code:
 *                      type: integer
 *                      example: 401
 *                    error:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: "Accès refusé : token invalide ou expiré"
 *                    data:
 *                      type: null
 *                    token:
 *                      type: null
 *          '500':
 *            description: Internal server error.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: echec
 *                    code:
 *                      type: integer
 *                      example: 500
 *                    error:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: Internal error details
 *                    data:
 *                      type: null
 *                    token:
 *                      type: null
 */
  app.post('/updatePassword', async (req, res) => {
    try {
      // Récupérer le token dans l'en-tête Authorization
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(400).json({
          status: 'echec',
          code: 400,
          error: { message: 'Token manquant dans l\'entête Authorization' } ,
          data: null,
          message: 'Token manquant dans l\'entête Authorization',
          token: null
        });
      }
  
      // Extraire le token de l'en-tête Authorization
      const token = authHeader.split(' ')[1]; // Supposons que l'en-tête est de type "Bearer <token>"
  
      if (!token) {
        return res.status(400).json({
          status: 'echec',
          code: 400,
          error: { message: 'Token invalide ou mal formate' },
          data: null,
          message: 'Token invalide ou mal formate',
          token: null
        });
      }
  
      // Obtenir la connexion à la base de données
      const pool = await Connection.getConnectionPostgres();
  
      // Vérifier le token et générer un nouveau token
      const newToken = await Token.verifyAndGenerateNewToken(pool, token);
  
      if (newToken) {
        // Si le token est valide et qu'un nouveau token a été généré, renvoyer ce nouveau token
        
  
         var idUserUpdate=await GestionCompte.getUserIdByToken(newToken);
         console.log(idUserUpdate);
         const { newPassword } = req.query;
         await GestionCompte.updatePassword(idUserUpdate, newPassword);
  
         res.status(200).json({
          status: 'succes',
          code: 200,
          error: null,
          data: null,
          message: 'Mot de passe mis a jour',
          token: newToken
        });
  
      } else {
        // Si le token est invalide ou expiré, renvoyer une erreur
        res.status(401).json({
          status: 'echec',
          code: 401,
          error: { message: 'Accès refuse : token invalide ou expire' },
          data: null,
          message: 'Accès refuse : token invalide ou expire',
          token: null
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'echec',
        code: 500,
        error: error,
        message: error,
        data: null,
        token: null
      });
    }
  });

module.exports = router;
const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`Serveur démarré sur le port ${port}`);
});