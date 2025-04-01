<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>CryptoTrading</title>
        <script src="https://code.highcharts.com/stock/highstock.js"></script>
        <script src="https://code.highcharts.com/modules/price-indicator.js"></script>
        <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
        
        <script src="<%= request.getContextPath() %>/script-js/user-info.js"></script>
    </head>
    <body>
        <%@ include file="../header.jsp" %>
        
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
            
            <div class="col-lg-12">        
                <div class="card">
                    <div class="card-header">
                        <strong>Choix de la paire à afficher/acheter</strong> 
                    </div>
                            
                    <div class="card-body">
                        <div class="row">
                            <div class="col-4">
                                <div class="form-group" id="zoneDeListeCrypto">  
                                </div> 
                            </div>   
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-lg-12">
                            
                        <div class="card">
                            <div class="card-header">
                                <strong>Graphe (attendez le chargement des cours avant de faire un achat/vente)</strong> 
                            </div>

                            <div class="card-body" id="container"></div>
                        </div>
                    
                </div>
                
                
                <div class="col-lg-6"> 
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header">
                                <strong>Acheter une crypto</strong> 
                            </div>

                            <div class="card-body">
                               <div class="form-group">
                                   <input type="number" id="quantiteAchat" class="form-control" placeholder="Quantité">
                                </div> 
                                    <div class="form-actions form-group text-center">
                                        <button id="acheterButton"  class="btn btn-success btn-sm">Acheter</button>
                                    </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
                
                <div class="col-lg-6">
                    
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header">
                                <strong class="card-title">Cours des cryptos</strong>
                            </div>
                            
                            <div class="card-body">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Crypto</th>
                                            <th>Prix</th>
                                        </tr>
                                    </thead>

                                    <tbody id="PrixActuel"></tbody>
                                </table>
                            </div>
                                
                        </div>
                    </div>
                </div>   
                
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header">
                                <strong class="card-title">Mes cryptos</strong>
                            </div>
                            
                            <div class="card-body">
                                <table id="cryptoTable" class="table">
                                    <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Quantité possédé</th>
                                        <th>Quantité à vendre</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                                
                        </div>
                    </div>
                
                
            </div>
       
       
       <style>
        #container {
            height: 400px;
            min-width: 310px;
        }

        </style>
    <script>
        var commission; // Variable pour stocker le JSON
                    (async () => {
                      try {
                        const response = await fetch('<%= request.getContextPath() %>/CommissionConfigServlet?format=json');

                        if (!response.ok) {
                          throw new Error('Erreur de réseau');
                        }

                        commission = await response.json(); // Stockage du JSON dans 'myData'

                        console.log('Données récupérées et stockées:', commission);
                      } catch (error) {
                        console.error('Erreur lors de la récupération des données:', error);
                      }
                    })();
                    
        // Fonction pour charger les données des cryptos depuis le servlet
        function loadCryptos() {
           fetch(`<%= request.getContextPath() %>/admin/AdminListCryptoServlet`)
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('cryptoTable').querySelector('tbody');
                    tableBody.innerHTML='';
                    data.forEach(crypto => {
                        const row = document.createElement('tr');
                        row.innerHTML = '<td>' + crypto.nomCrypto + '</td>' +
                            '<td>' + crypto.quantiteDetenue + '</td>' +
                            '<td><input type="number" class="quantity" data-max="' + crypto.quantiteDetenue + '"></td>' +
                            '<td><button class="sell-button btn btn-danger btn-sm">Vendre</button></td>';
                        tableBody.appendChild(row);
                    });

                    // Ajouter un écouteur d'événement sur tous les boutons "Vendre"
                    const sellButtons = document.querySelectorAll('.sell-button');
                    sellButtons.forEach(button => {
                        button.addEventListener('click', handleSell);
                    });
                })
                .catch(error => {
                    console.error('Erreur lors du chargement des cryptos:', error);
                });
        }

        // Fonction pour gérer le clic sur le bouton "Vendre"
        function handleSell(event) {
            const button = event.target;
            const row = button.parentNode.parentNode;
            console.log(row);
            
            const idCryptoCell = row.cells[0];
            const idCrypto = idCryptoCell.textContent;
    
            const quantityInput = row.querySelector('.quantity');
            const quantityToSell = quantityInput.value;
            const maxQuantity = quantityInput.dataset.max;

            if (quantityToSell > maxQuantity) {
                alert('La quantité à vendre ne peut pas dépasser la quantité disponible.');
                return;
            }
            
             // Récupérer le graphique Highcharts
                const chart = Highcharts.charts[0];  // Si vous avez un seul graphique, il est à l'index 0

                // Trouver la série visible sélectionnée
                const visibleSeries = chart.series.find(series => series.name === idCrypto);
                
  

                if (visibleSeries) {
                    // Récupérer le dernier point de la série
                    const lastPoint = visibleSeries.options.data[visibleSeries.options.data.length - 1];
                    console.log(visibleSeries);
                    console.log(lastPoint);
                    const lastPrice = lastPoint ? lastPoint.close : null;
                    
                    
                    
                    const commissionVente= commission.vente;
                    console.log(commissionVente);

                    // Envoyer la requête AJAX pour la vente
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '<%= request.getContextPath() %>/admin/AdminTransactionCryptoServlet?action=vendre&idCrypto=' + idCrypto + '&quantite=' + quantityToSell + '&prixUnitaire=' + lastPrice + '&commission=' + commissionVente, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    xhr.send();

                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            console.log('Vente effectuée avec succès');
                            alert('Vente effectuée avec succès');
                            // Mettre à jour l'interface utilisateur en conséquence
                            loadUserInfo('<%= request.getContextPath() %>/UtilisateurInfoServlet','soldeUser');
                            loadCryptos();
                        } else {
                            console.error('Une erreur s\'est produite lors de la vente');
                        }
                    };

                    // Utilisez ce dernier prix dans votre logique de vente
                    console.log('Dernier prix:', lastPrice);


                } else {
                    console.error('Aucune série visible trouvée.');
                }
                
                //let currentPrice = null;
                    //chart.series.forEach(series => {
                        //if (series.name === idCrypto) {
                            // Récupérer le dernier point de cette série (prix actuel)
                            //const lastPoint = series.data[series.data.length - 1];
                            //if (lastPoint) {
                              //  currentPrice = lastPoint.y;
                            //}
                        //}
                    //});
        }

        // Appeler la fonction de chargement au chargement de la page
        
    </script>
    
    
<script>


// Ajuster le timestamp pour l'heure actuelle
function getTimestampForIndex(index) {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime() + (index * 10000); // +10 secondes par index
}

function filterVisibleData(pairData, currentIndex) {
    return pairData.slice(0, currentIndex + 1); // Ne garde que les données jusqu'à l'index actuel
}

var pairsData = [];
console.log(pairsData);

function fetchInitialData() {
    fetch('<%= request.getContextPath() %>/data/crypto-data.json')
        .then(response => response.json())
        .then(data => {
            const midnight = new Date();
            midnight.setHours(0, 0, 0, 0);
            
            pairsData = data.map(pair => ({
                name: pair.nom,
                data: pair.data,
                currentIndex: Math.floor((Date.now() - midnight.getTime()) / 10000)
            }));
            
            createChart();
        })
        .catch(error => console.error('Error loading JSON:', error));
}

function createChart() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    
const options = {
    xAxis: {
        type: 'datetime',
        min: midnight.getTime(),
        max: midnight.getTime() + 86400000 // 24h en ms
    },

    rangeSelector: {
        buttons: [{
            type: 'minute',
            count: 15,
            text: '15m'
        }, {
            type: 'hour',
            count: 1,
            text: '1h'
        }, {
            type: 'all',
            count: 1,
            text: 'All'
        }],
        selected: 1,
        inputEnabled: false,
        enabled: false // Masque toute la barre de sélection de période
    },

    navigator: {
        enabled: false // Désactive complètement la barre de navigation
    },

    series: pairsData.map((pair, index) => {
            const visibleData = filterVisibleData(pair.data, pair.currentIndex).map((d, i) => ({
                x: getTimestampForIndex(i),
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close
            }));

            return {
                name: pair.name,
                data: visibleData,
                type: 'candlestick',
                visible: index === 0,
                dataGrouping: { enabled: false },
                lastPrice: {
                        enabled: true,
                        label: {
                            enabled: true,
                            backgroundColor: 'rgba(255, 255, 255, 0.0)', // 50% de transparence
                            style: {
                                color: '#000000'
                            }
                        }
            
                }
            };
        })


};
// On load, start the interval that adds points
options.chart = {
    events: {
        load() {
            const chart = this;
        
            // Créer le menu déroulant
            const selectElement = document.createElement('select');
            selectElement.id = 'pairSelector';
            selectElement.className='form-control';
            pairsData.forEach((pair) => {
              const option = document.createElement('option');
              option.value = pair.name;
              option.text = pair.name;
              selectElement.appendChild(option);
            });
            document.getElementById('zoneDeListeCrypto').appendChild(selectElement);

            // Écouteur d'événement pour le menu déroulant
            selectElement.addEventListener('change', () => {
              const selectedPair = selectElement.value;
              chart.update({
                series: pairsData.map((pair) => ({
                  name: pair.name,
                  visible: pair.name === selectedPair,
                    lastPrice: {
                        enabled: true,
                        label: {
                            enabled: true,
                            backgroundColor: 'rgba(255, 255, 255, 0.0)', // 50% de transparence
                            style: {
                                color: '#000000'
                            }
                        }
            
                    }
                }))
              });
            });
            
            
            
            
            setInterval(() => {
                const div = document.getElementById('PrixActuel'); // Replace with your actual div ID
                let divContent = '';
                
                const currentTime = new Date().getTime();

                pairsData.forEach(pair => {
                    pair.currentIndex = Math.floor((currentTime - midnight.getTime()) / 10000);
                    const series = chart.series.find(s => s.name === pair.name);

                    if(series && pair.currentIndex < pair.data.length) {
                        const newPoint = {
                            x: getTimestampForIndex(pair.currentIndex),
                            ...pair.data[pair.currentIndex]
                        };
                        

                        if(!series.data.some(p => p.x === newPoint.x)) {
                            series.addPoint(newPoint, true, false);
                        }
                        divContent += `<tr><td>`+series.name+`</td><td>`+newPoint.close +`</td></tr>`;
                    }
                    
                
                });
                
                div.innerHTML = divContent;

                // Ajustement automatique de la plage visible
                chart.xAxis[0].setExtremes(
                    currentTime - 900000,
                    currentTime  // Montrer 1 minute dans le futur
                );

            }, 10000);

        }
    }
};

// Create the chart
Highcharts.stockChart('container', options);
}

</script>

<script>
// Fonction pour gérer le clic sur le bouton "Acheter"
function handleBuy() {
    const quantityInput = document.getElementById('quantiteAchat');
    const quantityToBuy = quantityInput.value;

    if (!quantityToBuy || quantityToBuy <= 0) {
        alert('Veuillez entrer une quantité valide à acheter.');
        return;
    }

    // Récupérer le graphique Highcharts
    const chart = Highcharts.charts[0];  // Si vous avez un seul graphique, il est à l'index 0

    // Trouver la série visible sélectionnée
    const visibleSeries = chart.series.filter(series => series.visible)[0];

    if (visibleSeries) {
        // Récupérer le dernier point de la série
        const lastPoint = visibleSeries.data[visibleSeries.data.length - 1];
        const lastPrice = lastPoint.close; // Dernier prix (clôture)
        
        const seriesName = visibleSeries.name;
        console.log(seriesName);

        // Utilisez ce dernier prix dans votre logique d'achat
        console.log('Dernier prix pour l\'achat:', lastPrice);
        const solde = document.getElementById('soldeUser').textContent;
        var montant=lastPrice*quantityToBuy;
        
        const commissionAchat= commission.achat;
        const commissionValue=montant * commissionAchat /100;
        montant=montant+commissionValue;
        
        if (solde < montant) {
            alert('Solde insuffisant pour cet achat');
            return;
        }
        
        if (solde >= montant) {
            // Toutes les conditions sont remplies, on peut envoyer la requête AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 
            '<%= request.getContextPath() %>/admin/AdminTransactionCryptoServlet?action=acheter&idCrypto='+seriesName+'&quantite='+quantityToBuy+'&prixUnitaire='+lastPrice+'&commission='+commissionAchat, true); // Remplacez 'votreServlet' par le chemin de votre servlet
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.send();

            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log('Transaction effectuée avec succès');
                    alert('Transaction effectuée avec succès');
                    // Mettre à jour l'interface utilisateur en conséquence
                    // Par exemple, afficher un message de confirmation, mettre à jour le solde, etc.
                    loadCryptos();
                    loadUserInfo('<%= request.getContextPath() %>/UtilisateurInfoServlet','soldeUser');
                } else {
                    console.error('Une erreur s est produite lors de la transaction');
                    alert('Une erreur s est produite lors de la transaction');
                }
            };
        }

    } else {
        console.error('Aucune série visible trouvée.');
    }
}

// Ajouter un écouteur d'événement au bouton "Acheter"
document.getElementById('acheterButton').addEventListener('click', handleBuy);
loadUserInfo('<%= request.getContextPath() %>/UtilisateurInfoServlet','soldeUser');
 loadCryptos();
fetchInitialData();
</script>

<%@ include file="../footer.jsp" %>
    </body>
</html>
