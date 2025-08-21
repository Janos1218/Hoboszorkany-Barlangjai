// Karakter adatok objektum
let characterData = {
    skill: 0,
    stamina: 0,
    luck: 0,
    equipment: [],
    gold: 0,
    gems: 0,
    potions: [],
    food: 0
};

// Harcállapot változók
let combatState = {
    inCombat: false,
    currentRound: 0,
    luckTestAvailable: false,
    lastAttacker: null, // 'player' vagy 'monster'
    player: {
        skill: 0,
        stamina: 0,
        luck: 0,
        originalStamina: 0
    },
    monster: {
        name: "",
        skill: 0,
        stamina: 0,
        originalStamina: 0
    }
};

function addEquipment() {
    const input = document.getElementById('new-equipment');
    if (input.value.trim() !== '') {
        characterData.equipment.push(input.value.trim());
        input.value = '';
        saveCharacterData();
        renderEquipment();
    }
}

// Ital hozzáadása
function addPotion() {
    const input = document.getElementById('new-potion');
    if (input.value.trim() !== '') {
        characterData.potions.push({
            name: input.value.trim(),
            uses: 2
        });
        input.value = '';
        saveCharacterData();
        renderPotions();
    }
}

// Felszerelés törlése
function removeEquipment(index) {
    characterData.equipment.splice(index, 1);
    saveCharacterData();
    renderEquipment();
}

// Ital használata
function usePotion(index) {
    if (characterData.potions[index].uses > 1) {
        characterData.potions[index].uses--;
    } else {
        characterData.potions.splice(index, 1);
    }
    saveCharacterData();
    renderPotions();
}

// Felszerelés megjelenítése
function renderEquipment() {
    const container = document.getElementById('equipment-list');
    container.innerHTML = '';
    
    characterData.equipment.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'equipment-item';
        div.innerHTML = `
            <span>${item}</span>
            <span class="delete-btn" onclick="removeEquipment(${index})">✕</span>
        `;
        container.appendChild(div);
    });
}

// Italok megjelenítése
function renderPotions() {
    const container = document.getElementById('potions-list');
    container.innerHTML = '';
    
    characterData.potions.forEach((potion, index) => {
        const div = document.createElement('div');
        div.className = 'potion-item';
        div.innerHTML = `
            <span>${potion.name}</span>
            <span class="potion-uses">(${potion.uses}/2)</span>
            <span class="delete-btn" onclick="usePotion(${index})">✕</span>
        `;
        container.appendChild(div);
    });
}

// Dobókocka funkció
function rollDice(numDice) {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice1').textContent = dice1;
    
    const dice2Element = document.getElementById('dice2');
    if(numDice === 2) {
        const dice2 = Math.floor(Math.random() * 6) + 1;
        dice2Element.textContent = dice2;
        dice2Element.style.display = 'flex';
    } else {
        dice2Element.style.display = 'none';
    }
}

// Karakterlap megjelenítése/elrejtése
function toggleCharacterSheet() {
    const sheet = document.getElementById('characterSheet');
    sheet.style.display = sheet.style.display === 'block' ? 'none' : 'block';
}
// Matematikai kerekítés függvény
function roundProperly(value) {
    return Math.round(value * 2) / 2; // Így lehet fél pontokat is kezelni (pl. 7.5)
}

// Adatok mentése
function saveCharacterData() {
    // Értékek kerekítése matematikai szabályok szerint
    const skill = Math.min(roundProperly(parseFloat(document.getElementById('skill').value) || 0), 12);
    const stamina = Math.min(roundProperly(parseFloat(document.getElementById('stamina').value) || 0), 24);
    const luck = Math.min(roundProperly(parseFloat(document.getElementById('luck').value) || 0), 12);
    const food = Math.min(roundProperly(parseFloat(document.getElementById('food').value) || 0), 10);

    characterData = {
        skill: skill,
        stamina: stamina,
        luck: luck,
        equipment: characterData.equipment,
        gold: parseInt(document.getElementById('gold').value) || 0, // Arany továbbra is egész szám
        gems: parseInt(document.getElementById('gems').value) || 0, // Drágakövek is egészek
        potions: characterData.potions,
        food: food
    };
    
    // Frissítjük az input mezőket a kerekített értékekkel
    document.getElementById('skill').value = skill;
    document.getElementById('stamina').value = stamina;
    document.getElementById('luck').value = luck;
    document.getElementById('food').value = food;
    
    localStorage.setItem('characterData', JSON.stringify(characterData));
}

// Adatok betöltése
function loadCharacterData() {
    const savedData = localStorage.getItem('characterData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        characterData = {
            skill: Math.min(roundProperly(parseFloat(parsedData.skill) || 0), 12),
            stamina: Math.min(roundProperly(parseFloat(parsedData.stamina) || 0), 24),
            luck: Math.min(roundProperly(parseFloat(parsedData.luck) || 0), 12),
            equipment: Array.isArray(parsedData.equipment) ? parsedData.equipment : [],
            gold: parseInt(parsedData.gold) || 0,
            gems: parseInt(parsedData.gems) || 0,
            potions: Array.isArray(parsedData.potions) ? parsedData.potions : [],
            food: Math.min(roundProperly(parseFloat(parsedData.food) || 0), 10)
        };
        
        // Input mezők frissítése a kerekített értékekkel
        document.getElementById('skill').value = characterData.skill;
        document.getElementById('stamina').value = characterData.stamina;
        document.getElementById('luck').value = characterData.luck;
        document.getElementById('gold').value = characterData.gold;
        document.getElementById('gems').value = characterData.gems;
        document.getElementById('food').value = characterData.food;
        
        renderEquipment();
        renderPotions();
    }
}

// Szerencse próba funkció
function testLuck() {
    const luckBtn = document.getElementById('luckTestBtn');
    const luckResultDiv = document.getElementById('luckResult');
    const diceRollResultSpan = document.getElementById('diceRollResult');
    const luckValueSpan = document.getElementById('luckValue');
    const luckOutcomeText = document.getElementById('luckOutcomeText');
    const successLink = document.getElementById('successLink');
    const failureLink = document.getElementById('failureLink');
    
    luckBtn.disabled = true;
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const totalRoll = dice1 + dice2;
    
    const luckValue = parseInt(document.getElementById('luck').value) || 0;
    
    diceRollResultSpan.textContent = `${dice1} + ${dice2} = ${totalRoll}`;
    luckValueSpan.textContent = luckValue;
    
    // 1-et vonunk le a Szerencse értékből
    const newLuckValue = Math.max(0, luckValue - 1);
    document.getElementById('luck').value = newLuckValue;
    
    if (totalRoll <= luckValue) {
        luckOutcomeText.textContent = "Siker! A dobott érték kisebb vagy egyenlő a Szerencse pontjaiddal.";
        successLink.style.display = 'block';
    } else {
        luckOutcomeText.textContent = "Kudarc! A dobott érték nagyobb a Szerencse pontjaidnál.";
        failureLink.style.display = 'block';
    }
    
    luckResultDiv.style.display = 'block';
    saveCharacterData();
}

// Harci szerencse próba
function testCombatLuck() {
    // Gomb letiltása, hogy ne lehessen újra megnyomni
    document.getElementById('luckTestBtn').style.display = 'none';
    
    const luckValue = parseInt(document.getElementById('luck').value) || 0;
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const totalRoll = dice1 + dice2;
    
    // 1-et vonunk le a Szerencse értékből
    const newLuckValue = Math.max(0, luckValue - 0.1);
    document.getElementById('luck').value = newLuckValue;
    
    // Eredmény kiértékelése
    const isLucky = totalRoll <= luckValue;
    let luckResult = "";
    
    // Elmentjük az eredeti értékeket a megjelenítéshez
    const originalPlayerStamina = combatState.player.stamina;
    const originalMonsterStamina = combatState.monster.stamina;
    
    if (combatState.lastAttacker === 'player') {
        if (isLucky) {
            combatState.monster.stamina -= 0.5;
            luckResult = `Szerencséd volt! ${combatState.monster.name} elveszít 1 extra Életerő pontot.`;
        } else {
            combatState.monster.stamina +=0.5;
            luckResult = `Balszerencséd volt! ${combatState.monster.name} visszanyer 1 Életerő pontot.`;
        }
    } else {
        if (isLucky) {
            combatState.player.stamina += 0.5;
            luckResult = "Szerencséd volt! Visszanyersz 1 Életerő pontot.";
        } else {
            combatState.player.stamina -= 0.5;
            luckResult = "Balszerencséd volt! Vesztesz 1 extra Életerő pontot.";
        }
    }
    
    // UI frissítése
    const combatRoundInfo = document.getElementById('combatRoundInfo');
    const existingLuckDiv = combatRoundInfo.querySelector('.combat-round.luck-test');
    if (existingLuckDiv) {
        combatRoundInfo.removeChild(existingLuckDiv);
    }
    
    const luckDiv = document.createElement('div');
    luckDiv.className = 'combat-round luck-test';
    luckDiv.innerHTML = `
        <h3>Szerencsepróba</h3>
        <p><strong>Dobás:</strong> ${dice1} + ${dice2} = ${totalRoll}</p>
        <p><strong>Szerencse pontjaid:</strong> ${luckValue}</p>
        <p><strong>Eredmény:</strong> ${luckResult}</p>
        <p><strong>Új Életerő állapot:</strong> 
           Játékos: ${originalPlayerStamina} → ${combatState.player.stamina}, 
           ${combatState.monster.name}: ${originalMonsterStamina} → ${combatState.monster.stamina}</p>
    `;
    
    combatRoundInfo.appendChild(luckDiv);
    
    // Karakterlap frissítése
    document.getElementById('stamina').value = combatState.player.stamina;
    
    
    // Következő kör gombjának megjelenítése
    document.getElementById('nextRoundBtn').style.display = 'block';
    
    // Győzelem/vereség ellenőrzése
    checkCombatResult();
}

// Harc kezdése
function startCombat() {
    // Adatok gyűjtése a karakterlapról
    combatState.player.skill = parseInt(document.getElementById('skill').value) || 0;
    combatState.player.stamina = parseInt(document.getElementById('stamina').value) || 0;
    combatState.player.luck = parseInt(document.getElementById('luck').value) || 0;
    combatState.player.originalStamina = combatState.player.stamina;
    
    // Szörny adatainak gyűjtése
    const monsterCaption = document.querySelector('.image-caption');
    combatState.monster.name = monsterCaption.querySelector('p:first-child').textContent;
    combatState.monster.skill = parseInt(monsterCaption.querySelector('p:nth-child(2)').textContent.replace('ÜGYESSÉG: ', '')) || 0;
    combatState.monster.stamina = parseInt(monsterCaption.querySelector('p:nth-child(3)').textContent.replace('ÉLETERŐ: ', '')) || 0;
    combatState.monster.originalStamina = combatState.monster.stamina;
    
    // UI beállítása
    document.getElementById('startCombatBtn').style.display = 'none';
    document.getElementById('combatLog').style.display = 'block';
    document.getElementById('nextRoundBtn').style.display = 'block';
    document.getElementById('luckTestBtn').style.display = 'none';
    
    // Link letiltása
    const nextChapterLink = document.querySelector('a[href$=".Fejezet.html"]');
    if (nextChapterLink) {
        nextChapterLink.classList.add('disabled-link');
    }
    
    combatState.inCombat = true;
    combatState.currentRound = 0;
    combatState.luckTestAvailable = false;
    
    // Első kör kezdése
    nextCombatRound();
}

// Harc körének lebonyolítása
function nextCombatRound() {
    if (!combatState.inCombat) return;
    
    combatState.currentRound++;
    const combatRoundInfo = document.getElementById('combatRoundInfo');
    
    // Dobások
    const playerRoll1 = Math.floor(Math.random() * 6) + 1;
    const playerRoll2 = Math.floor(Math.random() * 6) + 1;
    const playerAttack = combatState.player.skill + playerRoll1 + playerRoll2;
    
    const monsterRoll1 = Math.floor(Math.random() * 6) + 1;
    const monsterRoll2 = Math.floor(Math.random() * 6) + 1;
    const monsterAttack = combatState.monster.skill + monsterRoll1 + monsterRoll2;
    
    // Eredmény kiértékelése
    let roundResult = "";
    
    if (playerAttack > monsterAttack) {
        // Játékos talál
        combatState.monster.stamina -= 2;
        combatState.lastAttacker = 'player';
        roundResult = `A játékos talált! ${combatState.monster.name} elveszít 2 Életerő pontot.`;
    } else if (monsterAttack > playerAttack) {
        // Szörny talál
        combatState.player.stamina -= 2;
        combatState.lastAttacker = 'monster';
        roundResult = `${combatState.monster.name} talált! A játékos elveszít 2 Életerő pontot.`;
    } else {
        // Egyenlő, újabb kör
        combatState.lastAttacker = null;
        roundResult = "Az erők egyenlőek, újabb kör következik!";
    }
    
    // UI frissítése
    const roundDiv = document.createElement('div');
    roundDiv.className = 'combat-round';
    roundDiv.innerHTML = `
        <h3>${combatState.currentRound}. kör</h3>
        <div class="player-stats">
            <p><strong>Játékos dobása:</strong> ${playerRoll1} + ${playerRoll2} = ${playerRoll1 + playerRoll2}</p>
            <p><strong>Támadóerő:</strong> ${combatState.player.skill} + ${playerRoll1 + playerRoll2} = ${playerAttack}</p>
            <p><strong>Életerő:</strong> ${combatState.player.originalStamina} → <span class="${combatState.player.stamina < combatState.player.originalStamina ? 'stat-change' : 'stat-heal'}">${combatState.player.stamina}</span></p>
        </div>
        <div class="monster-stats">
            <p><strong>${combatState.monster.name} dobása:</strong> ${monsterRoll1} + ${monsterRoll2} = ${monsterRoll1 + monsterRoll2}</p>
            <p><strong>Támadóerő:</strong> ${combatState.monster.skill} + ${monsterRoll1 + monsterRoll2} = ${monsterAttack}</p>
            <p><strong>Életerő:</strong> ${combatState.monster.originalStamina} → <span class="${combatState.monster.stamina < combatState.monster.originalStamina ? 'stat-change' : 'stat-heal'}">${combatState.monster.stamina}</span></p>
        </div>
        <p><strong>Eredmény:</strong> ${roundResult}</p>
    `;
    
    combatRoundInfo.appendChild(roundDiv);
    
    // Karakterlap frissítése
    document.getElementById('stamina').value = combatState.player.stamina;
    saveCharacterData();
    
    // Szerencse próba lehetőségének beállítása (ha volt támadó)
    if (combatState.lastAttacker) {
        combatState.luckTestAvailable = true;
        document.getElementById('luckTestBtn').style.display = 'block';
    }
    
    // Következő kör gombjának megjelenítése
    document.getElementById('nextRoundBtn').style.display = 'block';
    
    // Győzelem/vereség ellenőrzése
    checkCombatResult();
}

// Győzelem/vereség ellenőrzése
function checkCombatResult() {
    const combatResult = document.getElementById('combatResult');
    const resultText = document.getElementById('resultText');
    const nextChapterLink = document.querySelector('a[href$=".Fejezet.html"]');
    
    if (combatState.monster.stamina <= 0) {
        // Győzelem
        combatState.inCombat = false;
        resultText.innerHTML = `<span style="color: #55ff55;">Győzelem! Legyőzted ${combatState.monster.name}-t!</span><br>`;
        combatResult.style.display = 'block';
        document.getElementById('nextRoundBtn').style.display = 'none';
        document.getElementById('luckTestBtn').style.display = 'none';
        
        // Link engedélyezése
        if (nextChapterLink) {
            nextChapterLink.classList.remove('disabled-link');
        }
    } else if (combatState.player.stamina <= 0) {
        // Vereség
        combatState.inCombat = false;
        resultText.innerHTML = `<span style="color: #ff5555;">Meghaltál! ${combatState.monster.name} legyőzött!</span><br>
                               <a href="Bevezetes.html" class="combat-button">Újrakezdés</a>`;
        combatResult.style.display = 'block';
        document.getElementById('nextRoundBtn').style.display = 'none';
        document.getElementById('luckTestBtn').style.display = 'none';
        
        disableAllNextButtons();
    }
}

// Minden "tovább" gomb letiltása vereség esetén
function disableAllNextButtons() {
    // Az összes link, ami nem a Bevezetes.html-re mutat
    document.querySelectorAll('a:not([href="Bevezetes.html"])').forEach(link => {
        link.style.display = 'none';
    });
    
    // Alternatív megoldás: az összes .combat-button letiltása
    document.querySelectorAll('.combat-button').forEach(button => {
        if (!button.href || !button.href.includes('Bevezetes.html')) {
            button.style.display = 'none';
        }
    });
}


// Eseményfigyelők beállítása
function setupEventListeners() {
    // Input mezők változásának figyelése
    document.querySelectorAll('.stat-input, .equipment-input').forEach(input => {
        input.addEventListener('change', function() {
            // Speciális kezelés a korlátozott mezőknek
            if (this.id === 'skill' && this.value > 12) this.value = 12;
            if (this.id === 'stamina' && this.value > 24) this.value = 24;
            if (this.id === 'luck' && this.value > 12) this.value = 12;
            if (this.id === 'food' && this.value > 10) this.value = 10;
            
            saveCharacterData();
        });
        
        // Textarea esetében input esemény is (gépelés közbeni mentés)
        if (this.tagName === 'TEXTAREA') {
            input.addEventListener('input', function() {
                saveCharacterData();
            });
        }
    });
    window.addEventListener('load', function() {
        loadCharacterData();
        // Ellenőrizzük a betöltött értékeket is
        if (characterData.skill > 12) characterData.skill = 12;
        if (characterData.stamina > 24) characterData.stamina = 24;
        if (characterData.luck > 12) characterData.luck = 12;
        if (characterData.food > 10) characterData.food = 10;
        saveCharacterData(); // Mentjük a korrigált értékeket
    });
    // Oldal elhagyásakor mentés
    window.addEventListener('beforeunload', saveCharacterData);
    
    // Harci gombok
    document.getElementById('startCombatBtn')?.addEventListener('click', startCombat);
    document.getElementById('nextRoundBtn')?.addEventListener('click', nextCombatRound);
    document.getElementById('luckTestBtn')?.addEventListener('click', testCombatLuck);
}

// Oldal betöltésekor
window.addEventListener('load', function() {
    loadCharacterData();
    setupEventListeners();
    
    // Automatikus mentés 5 másodpercenként (biztonsági mentés)
    setInterval(saveCharacterData, 5000);
});