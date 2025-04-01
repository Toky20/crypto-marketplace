<%@page import="model.EvolutionWallet"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<title>Suivi Portefeuille</title>
<%@ include file="../header.jsp" %>

<div class="breadcrumbs">
    <div class="breadcrumbs-inner">
        <div class="row m-0">
            <div class="col-sm-8">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-right">
                            <li><a>Home</a></li>
                            <li><a>Analyses</a></li>
                            <li class="active">Évolution Portefeuille</li>
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
            <div class="col-lg-10 offset-md-1">
                <form action="EvolutionWalletServlet" method="GET">
                    <div class="card">
                        <div class="card-header">
                            <strong>Période d'analyse</strong> 
                        </div>
                        
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="dateMin" class="control-label mb-1">Date début :</label>
                                        <input type="date" id="dateMin" name="dateMin" class="form-control" 
                                               value="<%= request.getParameter("dateMin") != null ? request.getParameter("dateMin") : "" %>">
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="dateMax" class="control-label mb-1">Date fin :</label>
                                        <input type="date" id="dateMax" name="dateMax" class="form-control" 
                                               value="<%= request.getParameter("dateMax") != null ? request.getParameter("dateMax") : "" %>">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <button class="btn btn-primary btn-sm" type="submit">
                                <i class="fa fa-dot-circle-o"></i> Afficher
                            </button>                   
                        </div>
                    </div>
                </form>
            </div>

            <% 
                List<EvolutionWallet> wallets = (List<EvolutionWallet>) request.getAttribute("wallets");
                if (wallets != null && !wallets.isEmpty()) {
            %>
            <div class="col-lg-10 offset-md-1">
                <div class="card">
                    <div class="card-header">
                        <strong class="card-title">Évolution des portefeuilles</strong>
                    </div>
                    
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Total Achats</th>
                                    <th>Total Ventes</th>
                                    <th>Valeur Portefeuille</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                <% for (EvolutionWallet wallet : wallets) { %>
                                <tr>
                                    <td><%= wallet.getEmail() %></td>
                                    <td><%= String.format("%,.2f", wallet.getTotalAchatCrypto()) %> </td>
                                    <td><%= String.format("%,.2f", wallet.getTotalVenteCrypto()) %> </td>
                                    <td class="font-weight-bold"><%= String.format("%,.2f", wallet.getTotalWallet()) %> </td>
                                </tr>
                                <% } %>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <% } %>
        </div>
    </div>
</div>
        
        </div>

<%@ include file="../footer.jsp" %>