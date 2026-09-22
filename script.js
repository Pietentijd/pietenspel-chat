const pietAntwoorden = [
    "Wat een leuke vraag! Sinterklaas en ik zijn nu net de daken aan het inspecteren. 🐴",
    "Haha, wist je dat Rommelpiet gisteren alle pepernoten in de schoenen van de juffrouw had verstopt? 🤭",
    "Ik moet snel weer door, want de inpakmachine staat te roken! Heb jij je verlanglijstje al klaar? 📝",
    "Jazeker! Sinterklaas zegt altijd: wie zoet is krijgt lekkers, en jij bent volgens mij heel zoet geweest! 🍬",
    "Oooo, kom er eens kijken... Ik hoor net dat er dit jaar extra veel marsepein aan boord is!",
    "Rijmen is mijn grote vak, ik stop de cadeautjes in de zak! Wat vind je van dit mooie gedicht? 🎤"
];

const input = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const profileBox = document.getElementById('profile-box');
const closeProfileBtn = document.getElementById('close-profile-btn');
const openProfileBtn = document.getElementById('open-profile-btn');
const skipAllBtn = document.getElementById('skip-all-btn');

let conversationState = {
    topic: null,
    mood: null,
    favoriteGift: null,
    favoriteSnack: null,
    name: null
};

function getProfile() {
    return {
        name: document.getElementById('profile-name').value.trim(),
        gift: document.getElementById('profile-gift').value.trim(),
        snack: document.getElementById('profile-snack').value.trim(),
        fun: document.getElementById('profile-fun').value.trim()
    };
}

function saveProfile() {
    const profile = getProfile();
    conversationState.name = profile.name || conversationState.name;
    conversationState.favoriteGift = profile.gift || conversationState.favoriteGift;
    conversationState.favoriteSnack = profile.snack || conversationState.favoriteSnack;

    const filled = Object.values(profile).filter(Boolean).length;

    if (filled === 0) {
        addMessage('Kletspiet', 'Geen probleem! We kunnen gewoon chatten en ik stel de vragen aan jou. 😊', 'piet-msg');
        return;
    }

    const naamText = profile.name ? `Ik weet al dat je ${profile.name} heet.` : 'Ik weet al een beetje wie je bent.';
    const cadeautjeText = profile.gift ? ` Je vindt ${profile.gift} leuk.` : '';
    const snoepText = profile.snack ? ` Je houdt van ${profile.snack}.` : '';
    const funText = profile.fun ? ` Je leukste deel is ${profile.fun}.` : '';

    addMessage('Kletspiet', `${naamText}${cadeautjeText}${snoepText}${funText} Dan kan ik veel beter met je praten! 🎁`, 'piet-msg');
    closeProfile();
}

function closeProfile() {
    profileBox.classList.add('is-hidden');
}

function openProfile() {
    profileBox.classList.remove('is-hidden');
}

function skipAllQuestions() {
    document.querySelectorAll('.profile-form input').forEach((field) => {
        field.value = '';
    });
    closeProfile();
    addMessage('Kletspiet', 'Je hoeft niets in te vullen. Zeg gewoon wat je wilt vertellen, dan luister ik! 😊', 'piet-msg');
}

function addMessage(sender, text, type) {
    const message = document.createElement('div');
    message.className = `msg ${type}`;
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generatePietReply(userText) {
    const text = userText.toLowerCase();
    const profile = getProfile();

    if (/(hallo|hoi|hey|dag|goedemorgen|goedendag|hello)/.test(text)) {
        conversationState.topic = 'intro';
        const naam = profile.name ? ` ${profile.name}!` : '!';
        return `Hoi${naam} Wat leuk dat je er bent! Wat vind je van pakjesavond? 🎁`;
    }

    if (/(cadeau|pakje|geschenk|verlanglijst|wensen|lijstje|gift|present)/.test(text)) {
        conversationState.topic = 'cadeau';
        const gift = profile.gift ? ` Ik zie dat jij ${profile.gift} leuk vindt.` : ' Wat staat er echt bovenaan?';
        return `Ooo, ik kan al zien dat jij een heel mooi verlanglijstje hebt!${gift} 🎁`;
    }

    if (/(pepernoot|koekje|snoep|lekker|marsepein|chocolade|suiker|taart)/.test(text)) {
        conversationState.topic = 'snoep';
        const snack = profile.snack ? ` Jij houdt vast van ${profile.snack}.` : ' Ik vind pepernoten ook heel lekker.';
        return `Mmm, pepernoten en chocolade zijn de beste!${snack} 🍪`;
    }

    if (/(ja|jep|zeker|natuurlijk|heel erg|graag|yes)/.test(text)) {
        conversationState.topic = 'positief';
        conversationState.mood = 'blij';
        return "Jazeker! Ik vind dat echt heel leuk! Sinterklaas houdt van lieve kinderen die goed zijn. 😊";
    }

    if (/(nee|no|niet|neen|nope)/.test(text)) {
        conversationState.topic = 'negatief';
        conversationState.mood = 'enigszins';
        return "Ah, oké! Dan gaan we samen nog even kijken of het toch nog een beetje feestelijk wordt. 😄";
    }

    if (/(naam|ik ben|ik heet|wie ben jij|wie ben je|wat is je naam)/.test(text)) {
        conversationState.topic = 'naam';
        const naam = profile.name ? ` Ik weet al dat je ${profile.name} bent.` : '';
        return `Ik ben Kletspiet, de leukste praatpiet van de hele boot!${naam} 😄`;
    }

    if (/(lief|zoet|braaf|goed|vriendelijk|aardig)/.test(text)) {
        conversationState.topic = 'goed';
        conversationState.mood = 'braaf';
        return "Dat hoor ik graag! Jij klinkt echt heel braaf en lief. Sinterklaas zal vast tevreden zijn. ⭐";
    }

    if (/(help|hulp|wat kan jij|wat doe jij|waarom)/.test(text)) {
        conversationState.topic = 'hulp';
        return "Ik help je met Sinterklaas, pakjes, pepernoten en al het leuke van pakjesavond! 🎉";
    }

    if (/(sorry|schaam|fout|echt niet|spijt)/.test(text)) {
        conversationState.topic = 'sorry';
        return "Geen probleem! Iedereen maakt weleens een foutje. We gaan gewoon door! 😊";
    }

    if (/(blij|trots|blijft|vrolijk|feest|leuk|super|fantastisch)/.test(text)) {
        conversationState.topic = 'blij';
        conversationState.mood = 'blij';
        return "Dat klinkt geweldig! Pakjesavond is altijd het leukste feest van het jaar. 🎊";
    }

    if (/(sinterklaas|piet|pakjesavond|boot|schoorsteen|zwarte piet|zwartepiet)/.test(text)) {
        conversationState.topic = 'sinterklaas';
        const fun = profile.fun ? ` Ik weet dat jij ${profile.fun} het leukst vindt.` : ' Wat vind jij het leukste aan pakjesavond?';
        return `Haha, Sinterklaas en ik hebben altijd de leukste ritten!${fun} 🚂`;
    }

    if (/(vraag|wil|mag|kan|moet|denk|vind)/.test(text)) {
        conversationState.topic = 'vraag';
        return "Ik vind dat je heel goed nadenkt! Wat wil je nog meer weten over Sinterklaas? 🤔";
    }

    if (/(mijn|ik heb|ik ga|ik wil|ik zou|ik moet)/.test(text)) {
        conversationState.topic = 'persoonlijk';
        const name = profile.name ? ` ${profile.name}` : '';
        return `Oh, dat klinkt interessant${name}! Vertel eens meer, want ik wil echt weten wat jij leuk vindt. 😊`;
    }

    if (conversationState.topic === 'cadeau' && profile.gift) {
        return `Dat klinkt leuk! ${profile.gift} is echt een goed idee. Wat vind jij het leukste aan pakjesavond? 🎁`;
    }

    if (conversationState.topic === 'snoep' && profile.snack) {
        return `Oeh, ${profile.snack} klinkt heerlijk! Dan is pakjesavond voor jou echt een feest. 🍬`;
    }

    if (conversationState.mood === 'blij') {
        return "Je klinkt echt vrolijk vandaag! Ik denk dat pakjesavond jou ook heel veel plezier geeft. Heb jij al een wens voor Sinterklaas? 🎁";
    }

    if (conversationState.mood === 'braaf') {
        return "Jij klinkt heel lief en braaf. Ik denk dat Sinterklaas je zeker niet zal vergeten. 🍭";
    }

    return pietAntwoorden[Math.floor(Math.random() * pietAntwoorden.length)];
}

function sendMsg() {
    const text = input.value.trim();
    if (!text) return;

    addMessage('Jij', text, 'user-msg');
    input.value = '';

    setTimeout(() => {
        const antwoord = generatePietReply(text);
        addMessage('Kletspiet', antwoord, 'piet-msg');
    }, 1000);
}

saveProfileBtn.addEventListener('click', saveProfile);
closeProfileBtn.addEventListener('click', closeProfile);
openProfileBtn.addEventListener('click', openProfile);
skipAllBtn.addEventListener('click', skipAllQuestions);

document.querySelectorAll('.skip-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.skip);
        if (target) {
            target.value = '';
        }
    });
});

document.querySelectorAll('.suggestion-btn').forEach((button) => {
    button.addEventListener('click', () => {
        input.value = button.dataset.message;
        sendMsg();
    });
});

sendBtn.addEventListener('click', sendMsg);
input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMsg();
    }
});

let score = 0;
const pnoot = document.getElementById('pepernoot');
const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');

function movePepernoot() {
    const maxX = gameArea.clientWidth - 40;
    const maxY = gameArea.clientHeight - 40;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    pnoot.style.left = randomX + 'px';
    pnoot.style.top = randomY + 'px';
}

function catchPepernoot(event) {
    if (event) event.stopPropagation();
    score += 10;
    scoreEl.textContent = score;
    movePepernoot();
}

function missedClick() {
    if (score > 0) {
        score -= 2;
        scoreEl.textContent = score;
    }
}

pnoot.addEventListener('click', catchPepernoot);
pnoot.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        catchPepernoot(event);
    }
});
gameArea.addEventListener('click', missedClick);

setInterval(movePepernoot, 1500);
movePepernoot();
