<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mettre à jour Commission Config</title>
    <%@ include file="../header.jsp" %>
</head>
<body>

<div class="breadcrumbs">
    <div class="breadcrumbs-inner">
        <div class="row m-0">
            <div class="col-sm-8">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-right">
                            <li><a>Home</a></li>
                            <li><a>Paramètres</a></li>
                            <li class="active">Configuration des commissions</li>
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
                        <strong class="card-title">Configuration des commissions</strong>
                    </div>
                    <div class="card-body">
                        <div class="card-title">
                            <h3 class="text-center">Modifier les taux de commission</h3>
                        </div>
                        <hr>
                        
                        <form id="commissionForm" action="CommissionConfigServlet" method="POST">
                            <div class="form-group">
                                <label for="achat" class="control-label mb-1">Commission Achat (%):</label>
                                <input type="number" 
                                       id="achat" 
                                       name="achat" 
                                       class="form-control"
                                       step="0.001"
                                       required>
                            </div>

                            <div class="form-group">
                                <label for="vente" class="control-label mb-1">Commission Vente (%):</label>
                                <input type="number" 
                                       id="vente" 
                                       name="vente" 
                                       class="form-control"
                                       step="0.001"
                                       required>
                            </div>

                            <div class="form-actions form-group text-center">
                                <button type="submit" class="btn btn-success btn-sm">Mettre à jour</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    </div>



    <script>
        // Charger les données de commission à l'initialisation de la page
        window.onload = function() {
            fetch('<%= request.getContextPath() %>/CommissionConfigServlet?format=json')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data) {
                        document.getElementById('achat').value = data.achat;
                        document.getElementById('vente').value = data.vente;
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données:', error);
                });
        };
    </script>

<%@ include file="../footer.jsp" %>
</body>
</html>
