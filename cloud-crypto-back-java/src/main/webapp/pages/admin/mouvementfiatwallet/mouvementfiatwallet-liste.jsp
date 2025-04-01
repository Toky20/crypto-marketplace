<%@page import="model.MouvementFiatWallet"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html;charset=UTF-8" %>

<title>Liste des mouvements FIAT</title>
<%@ include file="../header.jsp" %>

<div class="content">
    <div class="animated fadeIn">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <strong class="card-title">Mouvements FIAT</strong>
                    </div>
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Date/Heure</th>
                                    <th>Dépôt</th>
                                    <th>Retrait</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <% 
                                List<MouvementFiatWallet> mouvements = (List<MouvementFiatWallet>) request.getAttribute("mouvements");
                                for (MouvementFiatWallet m : mouvements) { 
                                %>
                                <tr>
                                    <td><%= m.getEmail() %></td>
                                    <td><%= m.getDateheure() %></td>
                                    <td><%= m.getDepot() %></td>
                                    <td><%= m.getRetrait() %></td>
                                    <td>
                                        <a href="<%= request.getContextPath() %>/ValidationMouvementServlet?id=<%= m.getIdmvtwallet() %>" 
                                           class="btn btn-primary btn-sm">
                                            Valider
                                        </a>
                                    </td>
                                </tr>
                                <% } %>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                            
                            </div>

<%@ include file="../footer.jsp" %>