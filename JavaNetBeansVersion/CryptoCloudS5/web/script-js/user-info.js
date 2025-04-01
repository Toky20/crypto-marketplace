function loadUserInfo(url,idToShow) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const user = JSON.parse(xhr.responseText);
                        console.log(user);
                        const userDiv = document.getElementById(idToShow);
                        userDiv.innerHTML = user.solde;
                    } else {
                        console.error('Erreur lors du chargement des informations utilisateur.');
                    }
                };
                xhr.send();
            }
            
            