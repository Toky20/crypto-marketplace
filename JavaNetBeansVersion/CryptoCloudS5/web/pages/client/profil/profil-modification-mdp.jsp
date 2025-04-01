
    <title>Modification de mot de passe</title>
    <%@ include file="../header.jsp" %>
    
    <div class="breadcrumbs">
        <div class="breadcrumbs-inner">
            <div class="row m-0">
                <div class="col-sm-8">
                    <div class="page-header float-left">
                        <div class="page-title">
                            <ol class="breadcrumb text-right">
                                <li><a>Home</a></li>
                                <li><a>Mon compte</a></li>
                                <li class="active">Modifer mon mot de passe</li>
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
                    <div class="col-lg-6 offset-md-3">
                        <div class="card">
                            <div class="card-header text-center">
                                <strong class="card-title">Modifer mon mot de passe</strong>
                            </div>
                            <div class="card-body">
                                <!--Card -->
                                <div>
                                    <div class="card-body">
                                        <div class="card-title">
                                        </div>
                                        <hr>

                                        <form id="modifMdpForm">
                                            <div class=" form-group">
                                                <label for="newPassword" class="control-label mb-1">Nouveau mot de passe:</label>
                                                <input type="password" id="newPassword" name="newPassword" class="form-control" required minlength="6">
                                            </div>

                                            <div class="form-actions form-group text-center">
                                                <button type="submit" class="btn btn-success btn-sm">Modifier</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div> <!-- .card -->
                    </div><!--/.col-->


                   
                </div>
            </div>
        </div><!-- .animated -->
    </div><!-- .content -->

    <script>
        const form = document.getElementById('modifMdpForm');

        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log(data);

            fetch('<%= request.getContextPath() %>/client/ClientModificationMdpServlet?' + new URLSearchParams(data).toString(), {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Succès:', data);
                alert(data.message);
                if (data.code === 200) {
                    // Redirection vers la page souhaitée
                    window.location.href = '<%= request.getContextPath() %>/client/ClientMouvementFiatWalletServlet' ; 
                } 
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors de la création de votre compte');
                // Afficher un message d'erreur à l'utilisateur
            });
        });
    </script>
    
    <%@ include file="../footer.jsp" %>
