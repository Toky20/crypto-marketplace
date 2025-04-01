
    <title>Modification de role</title>
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
                                <li class="active">Modifer mon role</li>
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
                                <strong class="card-title">Modifer mon role</strong>
                            </div>
                            <div class="card-body">
                                <!--Card -->
                                <div>
                                    <div class="card-body">
                                        <div class="card-title">
                                        </div>
                                        <hr>

                                        <form id="modifRoleForm">
                                            <div class=" form-group">
                                                <label for="idRole" class="control-label mb-1">Choix de role:</label>
                                                <select name="idRole" id="idRole" class="form-control">
                                                    <option value="1">Administrateur</option>
                                                    <option value="2">Client</option>
                                                </select>
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
        const form = document.getElementById('modifRoleForm');

        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log(data);

            fetch('<%= request.getContextPath() %>/client/ClientModificationRoleServlet?' + new URLSearchParams(data).toString(), {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Succès:', data);
                alert('Role modifié avec succès, veuillez vous reconnecter maintenant');
                if (data.code === 200) {
                    // Redirection vers la page souhaitée
                    window.location.href = '<%= request.getContextPath() %>/LoginRedirectServlet' ; 
                } 
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur de modification de role');
                // Afficher un message d'erreur à l'utilisateur
            });
        });
    </script>
    
    <%@ include file="../footer.jsp" %>