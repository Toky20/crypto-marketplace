<%@page import="java.util.*" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<title>Analyse des Commissions</title>
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
                            <li class="active">Commissions</li>
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
                <form action="AnalyseCommissionServlet" method="post">
                    <div class="card">
                        <div class="card-header">
                            <strong>Critères d'analyse</strong>
                        </div>
                        
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="typeAnalyse" class="control-label mb-1">Type d'analyse :</label>
                                        <select name="typeAnalyse" class="form-control">
                                            <% 
                                                List<String> typeAnalyseList = (List<String>) request.getAttribute("typeAnalyseList");
                                                String selectedTypeAnalyse = (String) request.getAttribute("typeAnalyse");
                                                for (String type : typeAnalyseList) {
                                            %>
                                                <option value="<%= type %>" 
                                                    <%= type.equals(selectedTypeAnalyse) ? "selected" : "" %>>
                                                    <%= type %>
                                                </option>
                                            <% } %>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="crypto" class="control-label mb-1">Cryptomonnaie :</label>
                                        <select name="crypto" class="form-control">
                                            <% 
                                                List<String> cryptoList = (List<String>) request.getAttribute("cryptoList");
                                                String selectedCrypto = (String) request.getAttribute("crypto");
                                                for (String crypto : cryptoList) {
                                            %>
                                                <option value="<%= crypto %>" 
                                                    <%= crypto.equals(selectedCrypto) ? "selected" : "" %>>
                                                    <%= crypto %>
                                                </option>
                                            <% } %>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="dateMin" class="control-label mb-1">Date Min :</label>
                                        <input type="date" name="dateMin" class="form-control" 
                                            value="<%= request.getAttribute("dateMin") != null ? request.getAttribute("dateMin") : "" %>" required>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="dateMax" class="control-label mb-1">Date Max :</label>
                                        <input type="date" name="dateMax" class="form-control" 
                                            value="<%= request.getAttribute("dateMax") != null ? request.getAttribute("dateMax") : "" %>" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <button type="submit" class="btn btn-primary btn-sm">
                                <i class="fa fa-dot-circle-o"></i> Valider
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <% 
                List<Map<String, Object>> result = (List<Map<String, Object>>) request.getAttribute("result");
                if (result != null && !result.isEmpty()) { 
            %>
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <strong class="card-title">Résultats de l'analyse</strong>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Type de transaction</th>
                                    <th>Commission</th>
                                </tr>
                            </thead>
                            <tbody>
                                <% for (Map<String, Object> row : result) { %>
                                <tr>
                                    <td><%= row.get("type_transaction") %></td>
                                    <td><%= row.get("commission") %></td>
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