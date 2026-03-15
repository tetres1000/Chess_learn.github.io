const moveSound = new Audio('move.mp3');
const captureSound = new Audio('capture.mp3');

//inserting the images
function insertImage() {
    document.querySelectorAll('.box').forEach(image => {
        if (image.innerText.length !== 0) {
            if (image.innerText == 'Wpawn' || image.innerText == 'Bpawn') {
                image.innerHTML = `${image.innerText} <img class='all-img all-pown' src="${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            }
            else {
                image.innerHTML = `${image.innerText} <img class='all-img' src="${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            }
        }
    })
}
insertImage()

//Coloring the board

function coloring() {
    const color = document.querySelectorAll('.box')

    color.forEach(color => {
        getId = color.id
        arr = Array.from(getId)
        arr.shift()
        aside = eval(arr.pop())
        aup = eval(arr.shift())
        a = aside + aup

        if (a % 2 == 0) {
            color.style.backgroundColor = 'rgb(232 235 239)'
        }
        if (a % 2 !== 0) {
            color.style.backgroundColor = 'rgb(125 135 150)'
        }
    })
    
    // On vérifie l'échec seulement APRES avoir dessiné le plateau de base
    if (typeof checkGameStatus === "function") {
        checkGameStatus();
    }
}

//function to not remove the same team element

function reddish() {
    document.querySelectorAll('.box').forEach(i1 => {
        if (i1.style.backgroundColor == 'blue') {

            document.querySelectorAll('.box').forEach(i2 => {

                if (i2.style.backgroundColor == 'greenyellow' && i2.innerText.length !== 0) {


                    greenyellowText = i2.innerText

                    blueText = i1.innerText

                    blueColor = ((Array.from(blueText)).shift()).toString()
                    greenyellowColor = ((Array.from(greenyellowText)).shift()).toString()

                    getId = i2.id
                    arr = Array.from(getId)
                    arr.shift()
                    aside = eval(arr.pop())
                    aup = eval(arr.shift())
                    a = aside + aup

                    if (a % 2 == 0 && blueColor == greenyellowColor) {
                        i2.style.backgroundColor = 'rgb(232 235 239)'
                    }
                    if (a % 2 !== 0 && blueColor == greenyellowColor) {
                        i2.style.backgroundColor = 'rgb(125 135 150)'
                    }

                }
            })
        }
    })
}

//reset button
document.getElementById("reset-btn").addEventListener("click", function () {
    location.reload();
});


tog = 1

//  Vérifie si une case est attaquée
function isSquareAttacked(targetId, opponentColor) {
    let attacked = false;
    
    // Calculer les coordonnées de la case cible (identique à votre logique actuelle)
    let targetArr = Array.from(targetId);
    targetArr.shift();
    let t_aside = eval(targetArr.pop());
    targetArr.push('0');
    let t_aup = eval(targetArr.join(''));
    
    // Parcourir toutes les cases pour trouver les pièces adverses
    document.querySelectorAll('.box').forEach(box => {
        if (attacked) return; // Si on a déjà trouvé une attaque, on gagne du temps et on arrête
        
        let piece = box.innerText;
        
        // Si la case contient une pièce de la couleur adverse (ex: "B" ou "W")
        if (piece.length !== 0 && piece.startsWith(opponentColor)) {
            
            let boxArr = Array.from(box.id);
            boxArr.shift();
            let b_aside = eval(boxArr.pop());
            boxArr.push('0');
            let b_aup = eval(boxArr.join(''));
            
            // 1. Attaques de PIONS
            if (piece.includes('pawn')) {
                if (opponentColor === 'W') { // Le pion blanc attaque en diagonale vers le haut
                    if (b_aup + 100 === t_aup && (b_aside + 1 === t_aside || b_aside - 1 === t_aside)) attacked = true;
                } else { // Le pion noir attaque en diagonale vers le bas
                    if (b_aup - 100 === t_aup && (b_aside + 1 === t_aside || b_aside - 1 === t_aside)) attacked = true;
                }
            }
            
            // 2. Attaques de CAVALIERS (Knight)
            else if (piece.includes('knight')) {
                let d_aup = Math.abs(b_aup - t_aup);
                let d_aside = Math.abs(b_aside - t_aside);
                if ((d_aup === 200 && d_aside === 1) || (d_aup === 100 && d_aside === 2)) attacked = true;
            }
            
            // 3. Attaques du ROI adverse (King)
            else if (piece.includes('king')) {
                let d_aup = Math.abs(b_aup - t_aup);
                let d_aside = Math.abs(b_aside - t_aside);
                if (d_aup <= 100 && d_aside <= 1) attacked = true;
            }
            
            // 4. Attaques de TOUR (Rook) ou REINE (Queen) - Lignes droites
            if (piece.includes('rook') || piece.includes('queen')) {
                // Si sur la même colonne
                if (b_aside === t_aside) {
                    let pathClear = true;
                    let min = Math.min(b_aup, t_aup) + 100;
                    let max = Math.max(b_aup, t_aup);
                    // Vérifier s'il y a des obstacles sur le chemin
                    for (let i = min; i < max; i += 100) {
                        if (document.getElementById(`b${i + b_aside}`).innerText.length !== 0) pathClear = false;
                    }
                    if (pathClear) attacked = true;
                }
                // Si sur la même ligne
                if (b_aup === t_aup) {
                    let pathClear = true;
                    let min = Math.min(b_aside, t_aside) + 1;
                    let max = Math.max(b_aside, t_aside);
                    // Vérifier s'il y a des obstacles sur le chemin
                    for (let i = min; i < max; i++) {
                        if (document.getElementById(`b${b_aup + i}`).innerText.length !== 0) pathClear = false;
                    }
                    if (pathClear) attacked = true;
                }
            }
            
            // 5. Attaques de FOU (Bishop) ou REINE (Queen) - Diagonales
            if (piece.includes('bishop') || piece.includes('queen')) {
                let d_aup = Math.abs(b_aup - t_aup);
                let d_aside = Math.abs(b_aside - t_aside);
                // Si le déplacement forme une diagonale parfaite
                if (d_aup / 100 === d_aside && d_aup !== 0) {
                    let pathClear = true;
                    let step_aup = (t_aup > b_aup) ? 100 : -100;
                    let step_aside = (t_aside > b_aside) ? 1 : -1;
                    
                    let curr_aup = b_aup + step_aup;
                    let curr_aside = b_aside + step_aside;
                    
                    // Vérifier chaque case de la diagonale jusqu'à la cible
                    while (curr_aup !== t_aup && curr_aside !== t_aside) {
                        if (document.getElementById(`b${curr_aup + curr_aside}`).innerText.length !== 0) pathClear = false;
                        curr_aup += step_aup;
                        curr_aside += step_aside;
                    }
                    if (pathClear) attacked = true;
                }
            }
        }
    });
    
    return attacked;
}


// 1. Fonction pour trouver l'ID de la case où se trouve le roi
function findKing(color) {
    let kingPos = "";
    document.querySelectorAll('.box').forEach(box => {
        if (box.innerText === color + 'king') {
            kingPos = box.id;
        }
    });
    return kingPos;
}

// 2. Fonction pour Mettre le Roi en ROUGE s'il est en échec
// 2. Fonction pour Mettre le Roi en ROUGE s'il est en échec ET détecter la fin de partie
function checkGameStatus() {
    let wKingPos = findKing('W');
    let bKingPos = findKing('B');
    
    // Affichage visuel immédiat de l'échec (Indépendant de la variable 'tog')
    if (wKingPos && isSquareAttacked(wKingPos, 'B')) {
        document.getElementById(wKingPos).style.backgroundColor = 'red';
    }
    if (bKingPos && isSquareAttacked(bKingPos, 'W')) {
        document.getElementById(bKingPos).style.backgroundColor = 'red';
    }

    // On attend 100ms pour laisser le navigateur dessiner la pièce et mettre à jour le tour (tog)
    setTimeout(() => {
        let currentColor = (tog % 2 !== 0) ? 'W' : 'B';
        let opponentColor = (currentColor === 'W') ? 'B' : 'W';
        let currentKingPos = findKing(currentColor);
        
        if (currentKingPos) {
            let inCheck = isSquareAttacked(currentKingPos, opponentColor);
            
            // Appel de la nouvelle fonction qui simule toutes les possibilités
            let hasMoves = hasLegalMoves(currentColor);

            // Si le joueur ne peut jouer aucune pièce
            if (!hasMoves) {
                if (inCheck) {
                    alert("Échec et Mat ! Victoire des " + (currentColor === 'W' ? "Noirs" : "Blancs"));
                } else {
                    alert("Pat ! Match nul (Aucun mouvement légal mais pas d'échec).");
                }
            }
        }
    }, 100);
}
// 4 Vérifie si un joueur possède au moins un mouvement légal
function hasLegalMoves(color) {
    let movesFound = false;
    let pieces = [];
    
    // Récupérer toutes les cases qui contiennent une pièce de la bonne couleur
    document.querySelectorAll('.box').forEach(box => {
        if (box.innerText.startsWith(color)) pieces.push(box);
    });

    for (let fromBox of pieces) {
        if (movesFound) break; // Si on a trouvé au moins 1 mouvement légal, on arrête de chercher 
        
        let piece = fromBox.innerText;
        let fromArr = Array.from(fromBox.id);
        fromArr.shift();
        let f_aside = eval(fromArr.pop());
        fromArr.push('0');
        let f_aup = eval(fromArr.join(''));

        document.querySelectorAll('.box').forEach(toBox => {
            if (movesFound) return;
            
            let toPiece = toBox.innerText;
            if (toPiece.startsWith(color)) return; // On ne peut pas manger sa propre pièce

            let toArr = Array.from(toBox.id);
            toArr.shift();
            let t_aside = eval(toArr.pop());
            toArr.push('0');
            let t_aup = eval(toArr.join(''));

            let validPseudo = false;

            // SIMULATION DES REGLES THEORIQUES DE DEPLACEMENT 
            // PION
            if (piece.includes('pawn')) {
                let dir = color === 'W' ? 100 : -100;
                let startRow = color === 'W' ? 200 : 700;
                // Avancer de 1
                if (t_aside === f_aside && t_aup === f_aup + dir && toPiece.length === 0) validPseudo = true;
                // Avancer de 2 (départ)
                if (t_aside === f_aside && f_aup === startRow && t_aup === f_aup + dir * 2 && toPiece.length === 0 && document.getElementById(`b${f_aup + dir + f_aside}`).innerText.length === 0) validPseudo = true;
                // Capturer en diagonale
                if (Math.abs(t_aside - f_aside) === 1 && t_aup === f_aup + dir && toPiece.length !== 0) validPseudo = true;
            }
            // CAVALIER
            else if (piece.includes('knight')) {
                let d_aup = Math.abs(f_aup - t_aup);
                let d_aside = Math.abs(f_aside - t_aside);
                if ((d_aup === 200 && d_aside === 1) || (d_aup === 100 && d_aside === 2)) validPseudo = true;
            }
            // ROI
            else if (piece.includes('king')) {
                let d_aup = Math.abs(f_aup - t_aup);
                let d_aside = Math.abs(f_aside - t_aside);
                if (d_aup <= 100 && d_aside <= 1) validPseudo = true;
            }
            // TOUR ou REINE
            if (piece.includes('rook') || piece.includes('queen')) {
                if (f_aside === t_aside) {
                    let pathClear = true;
                    let min = Math.min(f_aup, t_aup) + 100;
                    let max = Math.max(f_aup, t_aup);
                    for (let i = min; i < max; i += 100) {
                        if (document.getElementById(`b${i + f_aside}`).innerText.length !== 0) pathClear = false;
                    }
                    if (pathClear) validPseudo = true;
                }
                if (f_aup === t_aup) {
                    let pathClear = true;
                    let min = Math.min(f_aside, t_aside) + 1;
                    let max = Math.max(f_aside, t_aside);
                    for (let i = min; i < max; i++) {
                        if (document.getElementById(`b${f_aup + i}`).innerText.length !== 0) pathClear = false;
                    }
                    if (pathClear) validPseudo = true;
                }
            }
            // FOU ou REINE
            if (piece.includes('bishop') || piece.includes('queen')) {
                let d_aup = Math.abs(f_aup - t_aup);
                let d_aside = Math.abs(f_aside - t_aside);
                if (d_aup / 100 === d_aside && d_aup !== 0) {
                    let pathClear = true;
                    let step_aup = (t_aup > f_aup) ? 100 : -100;
                    let step_aside = (t_aside > f_aside) ? 1 : -1;
                    let curr_aup = f_aup + step_aup;
                    let curr_aside = f_aside + step_aside;
                    while (curr_aup !== t_aup && curr_aside !== t_aside) {
                        if (document.getElementById(`b${curr_aup + curr_aside}`).innerText.length !== 0) pathClear = false;
                        curr_aup += step_aup;
                        curr_aside += step_aside;
                    }
                    if (pathClear) validPseudo = true;
                }
            }

            //VÉRIFICATION DE LA MISE EN DANGER DU ROI
            // Si le mouvement théorique est valide, on vérifie s'il ne met pas notre propre roi en échec
            if (validPseudo) {
                let originalHTML = fromBox.innerHTML;
                let originalText = fromBox.innerText;
                let targetOriginalHTML = toBox.innerHTML;

                toBox.innerText = originalText;
                fromBox.innerText = '';

                let kingPos = findKing(color);
                let opponentColor = color === 'W' ? 'B' : 'W';
                let inCheck = isSquareAttacked(kingPos, opponentColor);

                // On remet tout en place (très important pour ne rien casser !)
                fromBox.innerHTML = originalHTML;
                toBox.innerHTML = targetOriginalHTML;

                // Si ce mouvement sauve le roi (ou ne le met pas en danger)
                if (!inCheck) {
                    movesFound = true; 
                }
            }
        });
    }
    
    return movesFound;
}

// 3. Fonction pour FILTRER les mouvements illégaux (CORRIGÉE POUR LES IMAGES)
function filterSafeMoves(fromId, color) {
    let opponentColor = color === 'W' ? 'B' : 'W';
    let fromBox = document.getElementById(fromId);
    
    // On sauvegarde le HTML (qui contient l'image) ET le texte
    let originalHTML = fromBox.innerHTML;
    let originalText = fromBox.innerText;

    document.querySelectorAll('.box').forEach(targetBox => {
        if (targetBox.style.backgroundColor === 'greenyellow') {
            
            // SIMULATION DU MOUVEMENT
            let targetOriginalHTML = targetBox.innerHTML;
            let targetOriginalText = targetBox.innerText; // Au cas où on mange une pièce
            
            // Pour la simulation logique, on déplace uniquement le texte
            targetBox.innerText = originalText;
            fromBox.innerText = '';

            // Trouver le roi
            let kingPos = findKing(color);

            // Est-ce que ce mouvement simulé laisse le roi en échec ?
            let inCheck = isSquareAttacked(kingPos, opponentColor);

            // ANNULATION DE LA SIMULATION
            // On restaure le HTML complet (pour récupérer les images intactes !)
            fromBox.innerHTML = originalHTML;
            targetBox.innerHTML = targetOriginalHTML;

            // Si le mouvement est illégal, on lui retire sa couleur verte
            if (inCheck) {
                let arr = Array.from(targetBox.id);
                arr.shift();
                let aside = eval(arr.pop());
                let aup = eval(arr.shift());
                let a = aside + aup;
                
                // On remet la couleur de case normale
                if (a % 2 == 0) {
                    targetBox.style.backgroundColor = 'rgb(232 235 239)';
                } else {
                    targetBox.style.backgroundColor = 'rgb(125 135 150)';
                }
            }
        }
    });
}
document.querySelectorAll('.box').forEach(item => {


    item.addEventListener('click', function () {

        if (item.style.backgroundColor == 'greenyellow' && item.innerText.length == 0) {
            tog = tog + 1
        }

  else if (item.style.backgroundColor == 'greenyellow' && item.innerText.length !== 0) {

            document.querySelectorAll('.box').forEach(i => {
                if (i.style.backgroundColor == 'blue') {
                    blueId = i.id
                    blueText = i.innerText

                    document.getElementById(blueId).innerText = ''
                    item.innerText = blueText
                    coloring()
                    insertImage()
                    
                    // --- NOUVEAU : SON DE CAPTURE ---
                    captureSound.play();

                    tog = tog + 1

                }
            })
        }



        getId = item.id
        arr = Array.from(getId)
        arr.shift()
        aside = eval(arr.pop())
        arr.push('0')
        aup = eval(arr.join(''))
        a = aside + aup

        //function to display the available paths for all pieces

        function whosTurn(toggle) {
            // PAWN

            if (item.innerText == `${toggle}pawn`) {
                item.style.backgroundColor = 'blue';

                if (tog % 2 !== 0 && aup < 800) {
                    // First move for white pawns
                    if (document.getElementById(`b${a + 100}`).innerText.length == 0) {
                        document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow';
                        if (document.getElementById(`b${a + 200}`).innerText.length == 0 && aup < 300) {
                            document.getElementById(`b${a + 200}`).style.backgroundColor = 'greenyellow';
                        }
                    }
                    if (aside < 8 && document.getElementById(`b${a + 100 + 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow';
                    }
                    if (aside > 1 && document.getElementById(`b${a + 100 - 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow';
                    }
                }

                if (tog % 2 == 0 && aup > 100) {
                    // First move for black pawns
                    if (document.getElementById(`b${a - 100}`).innerText.length == 0) {
                        document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow';
                        if (document.getElementById(`b${a - 200}`).innerText.length == 0 && aup > 600) {
                            document.getElementById(`b${a - 200}`).style.backgroundColor = 'greenyellow';
                        }
                    }
                    if (aside < 8 && document.getElementById(`b${a - 100 + 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow';
                    }
                    if (aside > 1 && document.getElementById(`b${a - 100 - 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow';
                    }
                }
                // Second move for pawns
                if (tog % 2 !== 0 && aup >= 800) {
                    if (document.getElementById(`b${a + 100}`).innerText.length == 0) {
                        document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow';
                    }
                    if (aside < 8 && document.getElementById(`b${a + 100 + 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow';
                    }
                    if (aside > 1 && document.getElementById(`b${a + 100 - 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow';
                    }
                }
                if (tog % 2 == 0 && aup <= 100) {
                    if (document.getElementById(`b${a - 100}`).innerText.length == 0) {
                        document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow';
                    }
                    if (aside < 8 && document.getElementById(`b${a - 100 + 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow';
                    }
                    if (aside > 1 && document.getElementById(`b${a - 100 - 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow';
                    }
                }
            }

            // KING

            if (item.innerText == `${toggle}king`) {


                if (aside < 8) {
                    document.getElementById(`b${a + 1}`).style.backgroundColor = 'greenyellow'

                }
                if (aside > 1) {

                    document.getElementById(`b${a - 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aup < 800) {

                    document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow'
                }
                if (aup > 100) {

                    document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow'
                }

                if (aup > 100 && aside < 8) {

                    document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aup > 100 && aside > 1) {

                    document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aup < 800 && aside < 8) {

                    document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aup < 800 && aside > 1) {

                    document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow'
                }

                item.style.backgroundColor = 'blue'

            }

            // KNIGHT

            if (item.innerText == `${toggle}knight`) {


                if (aside < 7 && aup < 800) {
                    document.getElementById(`b${a + 100 + 2}`).style.backgroundColor = 'greenyellow'
                }
                if (aside < 7 && aup > 200) {
                    document.getElementById(`b${a - 100 + 2}`).style.backgroundColor = 'greenyellow'
                }
                if (aside < 8 && aup < 700) {
                    document.getElementById(`b${a + 200 + 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 1 && aup < 700) {
                    document.getElementById(`b${a + 200 - 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 2 && aup < 800) {
                    document.getElementById(`b${a - 2 + 100}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 2 && aup > 100) {
                    document.getElementById(`b${a - 2 - 100}`).style.backgroundColor = 'greenyellow'
                }
                if (aside < 8 && aup > 200) {
                    document.getElementById(`b${a - 200 + 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 1 && aup > 200) {
                    document.getElementById(`b${a - 200 - 1}`).style.backgroundColor = 'greenyellow'
                }

                item.style.backgroundColor = 'blue'

            }

            // QUEEN

            if (item.innerText == `${toggle}queen`) {


                for (let i = 1; i < 9; i++) {

                    if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText == 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText !== 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText == 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText !== 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText == 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText !== 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText == 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText !== 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }



                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }

                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }



                item.style.backgroundColor = 'blue'

            }

            // BISHOP

            if (item.innerText == `${toggle}bishop`) {


                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }

                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }



                item.style.backgroundColor = 'blue'

            }

            // ROOK

            if (item.innerText == `${toggle}rook`) {

                for (let i = 1; i < 9; i++) {

                    if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText == 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText !== 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText == 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText !== 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText == 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText !== 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText == 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                    }
                    else if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText !== 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                item.style.backgroundColor = 'blue'
            }

        }

        // Toggling the turn
        if (tog % 2 !== 0) {
            document.getElementById('tog').innerText = "White's Turn";
            //Couleurs pour les Blancs
            document.getElementById('tog').style.backgroundColor = 'white';
            document.getElementById('tog').style.color = 'black';
            document.getElementById('tog').style.borderColor = 'black';
            
            whosTurn('W');
        }
        if (tog % 2 == 0) {
            document.getElementById('tog').innerText = "Black's Turn";
            //Couleurs pour les Noirs
            document.getElementById('tog').style.backgroundColor = 'black';
            document.getElementById('tog').style.color = 'white';
            document.getElementById('tog').style.borderColor = 'white';
            
            whosTurn('B');
        }
     

        // Retire les alliés des cibles potentielles
        reddish();

        //  : Retire les mouvements qui mettent notre propre roi en échec
        if (item.style.backgroundColor === 'blue') {
            if (tog % 2 !== 0) {
                filterSafeMoves(item.id, 'W');
            } else {
                filterSafeMoves(item.id, 'B');
            }
        }




    })
})


document.querySelectorAll('.box').forEach(hathiTest => {

    hathiTest.addEventListener('click', function () {

        if (hathiTest.style.backgroundColor == 'blue') {

            blueId = hathiTest.id
            blueText = hathiTest.innerText

            document.querySelectorAll('.box').forEach(hathiTest2 => {

                hathiTest2.addEventListener('click', function () {
                    if (hathiTest2.style.backgroundColor == 'greenyellow' && hathiTest2.innerText.length == 0) {
                        document.getElementById(blueId).innerText = ''
                        hathiTest2.innerText = blueText
                        coloring()
                        insertImage()
                        

                        moveSound.play();

                    }

                })
            })

        }

    })

})



z = 0
document.querySelectorAll('.box').forEach(ee => {
  ee.addEventListener('click', function () {
      z = z + 1
      if (z % 2 == 0 && ee.style.backgroundColor !== 'greenyellow') {
          coloring()
      }
  })
})



let tempsBlancs = 600;
let tempsNoirs = 600;
let horlogeDemarree = false;
let jeuTermineAuTemps = false;


document.body.addEventListener('click', function() {
    if (!horlogeDemarree && !jeuTermineAuTemps) {
        let input = document.getElementById('temps-initial');
        if (input && input.value) {
            tempsBlancs = input.value * 60;
            tempsNoirs = input.value * 60;
        }
        document.getElementById('menu-pendule').style.display = 'none';
        horlogeDemarree = true;
    }
}, { once: true });


setInterval(function() {
    if (!horlogeDemarree || jeuTermineAuTemps) return;


    if (typeof tog !== 'undefined') {
        if (tog % 2 !== 0) {
            tempsBlancs--;
            document.getElementById('pendule-blancs').innerText = formater(tempsBlancs);
            document.getElementById('pendule-blancs').classList.add('pendule-active');
            document.getElementById('pendule-noirs').classList.remove('pendule-active');
            if (tempsBlancs <= 0) gameOver("\nBlack wins!");
        } else {
            tempsNoirs--;
            document.getElementById('pendule-noirs').innerText = formater(tempsNoirs);
            document.getElementById('pendule-noirs').classList.add('pendule-active');
            document.getElementById('pendule-blancs').classList.remove('pendule-active');
            if (tempsNoirs <= 0) gameOver("\nWhite wins!");
        }
    }
}, 1000);


function formater(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
}


function gameOver(message) {
    jeuTermineAuTemps = true;
    document.getElementById('message-fin').innerText = "Game Over\n" + message;
    document.getElementById('pendule-blancs').classList.remove('pendule-active');
    document.getElementById('pendule-noirs').classList.remove('pendule-active');
    

    let bouclier = document.createElement('div');
    bouclier.style.position = 'fixed';
    bouclier.style.top = '0';
    bouclier.style.left = '0';
    bouclier.style.width = '100vw';
    bouclier.style.height = '100vh';
    bouclier.style.zIndex = '9999';
    document.body.appendChild(bouclier);
}

// ==========================================
// INTELLIGENCE ARTIFICIELLE (JOUEUR NOIR)
// Zéro modification du code de base requise !
// ==========================================

// 1. Création automatique d'un bouton pour activer/désactiver l'IA
let btnIA = document.createElement('button');
btnIA.innerText = "AI OFF";
btnIA.style.cssText = "padding: 10px 20px; position: absolute; left: 1450px; bottom: 300px; font-size: 1.2rem; margin: -15px auto; display: block; cursor: pointer; background: #34495e; color: white; border-radius: 8px; border: 2px solid #2c3e50; font-family: sans-serif; transition: 0.3s;";
document.querySelector('.container').insertBefore(btnIA, document.getElementById('tog'));

let modeIA = false;
let iaEnCoursDeReflexion = false;

// Comportement du bouton
btnIA.addEventListener('click', () => {
    modeIA = !modeIA;
    btnIA.innerText = modeIA ? "AI ON" : "AI OFF";
    btnIA.style.background = modeIA ? "#27ae60" : "#34495e";
    btnIA.style.borderColor = modeIA ? "#2ecc71" : "#2c3e50";
});

// 2. La boucle de surveillance (Vérifie constamment si c'est le tour de l'IA)
setInterval(() => {
    // Sécurité : On ne joue pas si l'IA est off ou si la partie est finie
    if (!modeIA || (typeof partieTerminee !== 'undefined' && partieTerminee)) return;
    
    // Si c'est au tour des Noirs (tog pair) et que l'IA ne joue pas déjà
    if (typeof tog !== 'undefined' && tog % 2 === 0 && !iaEnCoursDeReflexion) {
        iaEnCoursDeReflexion = true;
        setTimeout(jouerIA, 800); // L'IA fait semblant de réfléchir 0.8 seconde
    } 
    // Si c'est aux Blancs, on réarme l'IA pour le prochain tour
    else if (typeof tog !== 'undefined' && tog % 2 !== 0) {
        iaEnCoursDeReflexion = false; 
    }
}, 250);

// 3. Le cerveau de l'IA
function jouerIA() {
    if (typeof partieTerminee !== 'undefined' && partieTerminee) return;

    // Récupère toutes les cases contenant une pièce Noire ("B")
    let piecesNoires = Array.from(document.querySelectorAll('.box')).filter(box => box.innerText.startsWith('B'));
    
    // Mélange les pièces pour que l'IA soit imprévisible
    piecesNoires.sort(() => Math.random() - 0.5);

    let coupJoue = false;

    // Teste chaque pièce jusqu'à trouver un coup
    for (let piece of piecesNoires) {
        if (coupJoue) break;

        // SIMULATION : L'IA clique sur la pièce
        piece.click(); 

        // Cherche toutes les cases devenues vertes après le clic
        let ciblesPossibles = Array.from(document.querySelectorAll('.box')).filter(box => box.style.backgroundColor === 'greenyellow');

        if (ciblesPossibles.length > 0) {
            // IA GOURMANDE : Elle vérifie s'il y a une pièce à manger
            let cibleChoisie = ciblesPossibles[Math.floor(Math.random() * ciblesPossibles.length)];
            for (let cible of ciblesPossibles) {
                if (cible.innerText.length > 0) { // S'il y a du texte, c'est une pièce Blanche !
                    cibleChoisie = cible;
                    break;
                }
            }

            // SIMULATION : L'IA clique sur la case d'arrivée
            setTimeout(() => {
                cibleChoisie.click();
                
                // Hack de sécurité pour réparer votre variable 'z' après les multiples clics virtuels
                if (typeof z !== 'undefined') z = 0; 
                setTimeout(coloring, 50); // Nettoie le plateau visuellement
                
            }, 500); // Temps de trajet de la pièce

            coupJoue = true;
        } else {
            // Si la pièce cliquée n'a pas de mouvement, l'IA nettoie les couleurs et essaie la suivante
            coloring();
        }
    }
    
    // Si on arrive ici et que coupJoue est false, c'est un échec et mat ou un pat (géré par votre checkGameStatus)
}