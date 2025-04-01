<%@page import="model.Utilisateur"%>

    <title>Effectuer un mouvement</title>
    <%@ include file="../header.jsp" %>
    
    <script src="<%= request.getContextPath() %>/script-js/user-info.js"></script>
    
     <div class="breadcrumbs">
        <div class="breadcrumbs-inner">
            <div class="row m-0">
                <div class="col-sm-8">
                    <div class="page-header float-left">
                        <div class="page-title">
                            <ol class="breadcrumb text-right">
                                <li><a>Home</a></li>
                                <li class="active">Gestion de portefeuille FIAT(fonds)</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="content">
        <div class="animated fadeIn">
            
            <div class="row"> 
                <div class="col-lg-4 col-md-6">   
                    <div class="card"> 
                        <div class="card-body">
                            <div class="stat-widget-five">
                                <div class="stat-icon dib flat-color-1">  
                                    <i class="pe-7s-cash"></i>     
                                </div>        
                                <div class="stat-content">     
                                    <div class="text-left dib">
                                        <div class="stat-heading">Mon solde </div>     
                                    </div>

                                    <div class="stat-text">$ <span id="soldeUser"></span></div>
                                </div>     
                            </div>    
                        </div>   
                    </div>    
                </div>        
            </div>
        
  <div class="row">
                    <div class="col-lg-6 offset-md-3">
                        <div class="card">
                            <div class="card-header text-center">
                                <strong class="card-title">Effectuer un depot/retrait sur le compte</strong>
                            </div>
                            <div class="card-body">
                                <!--Card -->
                                <div>
                                    <div class="card-body">
                                        <div class="card-title">
                                            <strong class="card-title">Attendez jusqu'à l'affichage de la boite de dialogue pour voir le resultat de la demande</strong>
                                        </div>
                                        <hr>
                                        <form action="AdminMouvementFiatWalletServlet" method="post">
                                            <input type="hidden" name="idUtilisateur" value="${utilisateur.idUtilisateur}">

                                            <div class=" form-group">
        <label for="montant" class="control-label mb-1">Montant:</label>
        <input type="text" id="montant" name="montant" class="form-control" required>
                                            </div>
                                        </form>

                                        <div class="form-actions form-group text-center">

                                        <button  class="btn btn-success btn-sm" onclick="effectuerMouvement('depot')">Dépôt</button>

                                        <button  class="btn btn-danger btn-sm" onclick="effectuerMouvement('retrait')">Retrait</button>
                                        
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div> <!-- .card -->
                    </div><!--/.col-->

                </div>







    
    
    
    <%@ include file="../footer.jsp" %>
    
    <script>
        loadUserInfo('<%= request.getContextPath() %>/UtilisateurInfoServlet','soldeUser');
        function effectuerMouvement(action) {
          alert("Envoi de la requete, veuillez attendre le message de confirmation avant de quitter la page");
          const montant = document.getElementById("montant").value;
          <%
                Utilisateur utilisateur = (Utilisateur) session.getAttribute("utilisateur");
                int idUtilisateur = utilisateur.getIdUtilisateur();
                double solde = utilisateur.getSolde();
            %>
            const idUtilisateur = <%= idUtilisateur %>;
            const solde = <%= solde %>;

            // Vérification du solde avant d'envoyer la requête
            if (action === 'retrait' && montant > solde) {
                alert("Solde insuffisant");
                return;
            }
            
            // Créer un objet URLSearchParams
            const params = new URLSearchParams();
            params.append('action', action);
            params.append('montant', montant);
            params.append('idUtilisateur', idUtilisateur);

          fetch("AdminMouvementFiatWalletServlet?"+params.toString(), {
                method: 'POST'
            })
          .then(response => response.json())
          .then(data => {
            // Gérer la réponse JSON ici
            console.log(data);
            alert(data.message);
            if(data.code === 200){
                window.location.href = '<%= request.getContextPath() %>/admin/AdminMouvementFiatWalletServlet';
            }
            // Afficher un message de succès ou d'erreur
          })
          .catch(error => {
            console.error('Erreur:', error);
          });
        }
    </script>
