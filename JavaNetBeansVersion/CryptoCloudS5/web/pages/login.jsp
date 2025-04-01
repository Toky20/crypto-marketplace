<html class="no-js" lang=""> 
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Connexion</title>
    <meta name="description" content="Connexion">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" href="https://i.imgur.com/QRAUqs9.png">
    <link rel="shortcut icon" href="https://i.imgur.com/QRAUqs9.png">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.0/normalize.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pixeden-stroke-7-icon@1.2.3/pe-icon-7-stroke/dist/pe-icon-7-stroke.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.0/css/flag-icon.min.css">
    <link rel="stylesheet" href="../assets/css/cs-skin-elastic.css">
    <link rel="stylesheet" href="../assets/css/style.css">

    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>

</head>
<body class="bg-dark">

    <div class="sufee-login d-flex align-content-center flex-wrap">
        <div class="container">
            <div class="login-content">
                <div class="login-logo">
                    <a>
                        <img class="align-content" src="../images/" alt="">
                    </a>
                </div>
                <div class="login-form">
                    <div class="text-center">
                        <strong class="card-title">Connexion</strong>
                    </div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control" placeholder="Email" id="mail" name="mail" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" class="form-control" placeholder="Password" id="motDePasse" name="motDePasse" required="">
                        </div>

                        <button type="submit" class="btn btn-success btn-flat m-b-30 m-t-30">Se connecter</button>
                        <div class="register-link m-t-15 text-center">
                            <p>Vous n'avez pas encore un compte ? <a href="<%= request.getContextPath() %>/InscriptionServlet"> Inscrivez vous ici</a></p>
                        </div>
                    </form>
                </div>
                
                <!-- Ajoutez cette section après la div "login-form" -->
                <div class="container mt-5">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Comptes disponibles</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-warning">
                                Ces comptes sont par défaut tous administrateur (modifiable une fois connecté dans la section "Mon compte"),
                                le mot de passe est 123456 pour touts les comptes
                            </div>
                            <table class="table table-striped" id="usersTable">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>rojo.rabenanahary@gmail.com</td></tr>
                                    <tr><td>notahina.rzf@gmail.com</td></tr>
                                    <tr><td>rabenaivolucas@gmail.com</td></tr>
                                    <tr><td>tokisword@gmail.com</td></tr>
                                    <tr><td>randriamanantenavony@gmail.com</td></tr>
                                    <tr><td>nancyrabezakarison@gmail.com</td></tr>
                                    <tr><td>manda.andriambololona1@gmail.com</td></tr>
                                    <tr><td>matthieuandrianarisoa@gmail.com</td></tr>
                                    <tr><td>maheryrambinitsoa.14@gmail.com</td></tr>
                                    <tr><td>rabenjamandresy@gmail.com</td></tr>   
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.4/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-match-height@0.7.2/dist/jquery.matchHeight.min.js"></script>
    <script src="../assets/js/main.js"></script>

    <script>
        const form = document.getElementById('loginForm');

        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const mailToSend=data.mail;
            
            console.log(data.mail);

            fetch('<%= request.getContextPath() %>/LoginServlet?' + new URLSearchParams(data).toString(), {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Succès:', data);
                alert(data.message);
                if (data.code === 200) {
                    // Redirection vers la page souhaitée
                    window.location.href = '<%= request.getContextPath() %>/LoginPINServlet?mail='+mailToSend; // Remplacez par l'URL de votre page
                } 
                // Afficher un message de succès à l'utilisateur
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors du login');
                // Afficher un message d'erreur à l'utilisateur
            });
        });
    </script>

</body>
</html>
