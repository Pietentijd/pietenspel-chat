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
const chatHistory = [];

let conversationState = {
    topic: null,
    mood: null,
    favoriteGift: null,
    favoriteSnack: null,
    name: null,
    favoriteColor: null,
    hobby: null,
    favoriteAnimal: null,
    happyThing: null
};

function getProfile() {
    const valueOf = (id) => document.getElementById(id)?.value.trim() || '';

    return {
        name: valueOf('profile-name'),
        animal: valueOf('profile-animal'),
        hobby: valueOf('profile-hobby'),
        color: valueOf('profile-color'),
        gift: valueOf('profile-gift'),
        snack: valueOf('profile-snack'),
        fun: valueOf('profile-fun'),
        happy: valueOf('profile-happy')
    };
}

function saveProfile() {
    const profile = getProfile();
    conversationState.name = profile.name || conversationState.name;
    conversationState.favoriteAnimal = profile.animal || conversationState.favoriteAnimal;
    conversationState.hobby = profile.hobby || conversationState.hobby;
    conversationState.favoriteColor = profile.color || conversationState.favoriteColor;
    conversationState.favoriteGift = profile.gift || conversationState.favoriteGift;
    conversationState.favoriteSnack = profile.snack || conversationState.favoriteSnack;
    conversationState.happyThing = profile.happy || conversationState.happyThing;

    const filled = Object.values(profile).filter(Boolean).length;

    if (filled === 0) {
        addMessage('Kletspiet', 'Geen probleem! We kunnen gewoon chatten en ik stel de vragen aan jou. 😊', 'piet-msg');
        return;
    }

    const intro = profile.name ? `Leuk je te ontmoeten, ${profile.name}!` : 'Dankjewel voor je antwoorden!';
    let followUp = 'Wat wil je nu aan mij vertellen?';

    if (profile.animal) {
        followUp = `Wat vind je zo leuk aan ${profile.animal}?`;
    } else if (profile.hobby) {
        followUp = `Wat vind je zo leuk aan ${profile.hobby}?`;
    } else if (profile.gift) {
        followUp = `Wat zou je het liefst met ${profile.gift} doen?`;
    } else if (profile.happy) {
        followUp = 'Wanneer word je daar meestal blij van?';
    } else if (profile.snack) {
        followUp = `Wat vind je zo lekker aan ${profile.snack}?`;
    } else if (profile.color) {
        followUp = `Wat vind je zo mooi aan ${profile.color}?`;
    } else if (profile.fun) {
        followUp = 'Wat vind je daar het allerleukst aan?';
    }

    addMessage('Kletspiet', `${intro} ${followUp} 🎁`, 'piet-msg');
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

    if (/(naam|ik ben|ik heet|wie ben jij|wie ben je|wat is je naam)/.test(text)) {
        conversationState.topic = 'naam';
        const naam = profile.name ? ` Jij bent ${profile.name}, leuk je weer te spreken!` : '';
        return `Ik ben Kletspiet, de praatpiet van de Pakjesboot!${naam} Hoe heet jij? 😄`;
    }

    if (/^(ja|jep|zeker|natuurlijk|graag|yes)[!. ]*$/.test(text)) {
        conversationState.topic = 'positief';
        conversationState.mood = 'blij';
        return 'Leuk om te horen! Waar heb je nu zin in om over te praten? 😊';
    }

    if (/^(nee|no|neen|nope)[!. ]*$/.test(text)) {
        conversationState.topic = 'negatief';
        conversationState.mood = 'enigszins';
        return 'Dat is helemaal goed. Waar wil je liever over praten?';
    }

    if (/\b(hallo|hoi|hey|dag|goedemorgen|goedendag|hello)\b/.test(text)) {
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

async function sendMsg() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    addMessage('Jij', text, 'user-msg');
    input.value = '';
    chatHistory.push({ role: 'user', content: text });
    sendBtn.disabled = true;
    sendBtn.textContent = 'Even denken...';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: chatHistory.slice(-12) })
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'OpenAI gaf geen antwoord.');
        }

        chatHistory.push({ role: 'assistant', content: result.reply });
        addMessage('Kletspiet', result.reply, 'piet-msg');
    } catch (error) {
        addMessage('Kletspiet', generatePietReply(text), 'piet-msg');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Stuur';
        input.focus();
    }
}

if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveProfile);
if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfile);
if (openProfileBtn) openProfileBtn.addEventListener('click', openProfile);
if (skipAllBtn) skipAllBtn.addEventListener('click', skipAllQuestions);

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

function bindScreenNavigation() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const screens = document.querySelectorAll('.screen');
    const homeCards = document.querySelectorAll('.home-card');

    function showScreen(screenName) {
        screens.forEach((screen) => {
            screen.classList.toggle('active', screen.id === `screen-${screenName}`);
        });

        menuButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.screen === screenName);
        });
    }

    menuButtons.forEach((button) => {
        button.addEventListener('click', () => showScreen(button.dataset.screen));
    });

    homeCards.forEach((button) => {
        button.addEventListener('click', () => showScreen(button.dataset.screen));
    });

    showScreen('home');
}

bindScreenNavigation();

if (sendBtn && input) {
    sendBtn.addEventListener('click', sendMsg);
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMsg();
        }
    });
}

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

if (pnoot && gameArea && scoreEl) {
    pnoot.addEventListener('click', catchPepernoot);
    pnoot.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            catchPepernoot(event);
        }
    });
    gameArea.addEventListener('click', missedClick);

    setInterval(movePepernoot, 1500);
    movePepernoot();
}

const roomCodeEl = document.getElementById('room-code');
const createRoomBtn = document.getElementById('create-room-btn');
const copyCodeBtn = document.getElementById('copy-code-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const joinRoomInput = document.getElementById('join-room-input');
const houseStatus = document.getElementById('shared-status');
const sharedRoundLabel = document.getElementById('shared-round-label');
const playerNameInput = document.getElementById('player-name-input');
const avatarButtons = document.querySelectorAll('.avatar-option');
const leftTaskBtn = document.getElementById('team-left-btn');
const rightTaskBtn = document.getElementById('team-right-btn');
const teamMissionEl = document.getElementById('team-mission-text');
const teamProgressEl = document.getElementById('team-progress');
const restartTeamBtn = document.getElementById('restart-team-btn');
const roleStatusEl = document.getElementById('role-status');
const touchArrowButtons = document.querySelectorAll('.touch-arrow');
const teamChatBox = document.getElementById('team-chat-box');
const teamChatInput = document.getElementById('team-chat-input');
const teamChatSend = document.getElementById('team-chat-send');
const coopBoard = document.getElementById('co-op-board');
const coopLeftPlayer = document.getElementById('game-player-left');
const coopRightPlayer = document.getElementById('game-player-right');
const coopGifts = Array.from(document.querySelectorAll('.game-gift'));
const roomChannel = 'pietenspel-room';
const coopGameChannel = 'pietenspel-coop-game';
const teamChatChannel = 'pietenspel-team-chat';
const totalTeamRounds = 5;
const teamMissions = [
    'Werk samen en maak de pakjesboot klaar voor vertrek.',
    'De pakjes liggen door elkaar. Sorteer alles voordat de bel gaat.',
    'De geheime route is gevonden. Controleer samen de laatste code.',
    'De daken wachten. Zorg dat alle pakjes op tijd klaarstaan.',
    'De laatste missie: breng samen de pakjes naar de juiste huizen.'
];
let currentRoomCode = '';
let selectedAvatar = '🧝';
function getPlayerSessionId() {
    try {
        const storedId = sessionStorage.getItem('pietenspel-player-id');
        if (storedId) return storedId;

        const generatedId = globalThis.crypto?.randomUUID?.() || `player-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem('pietenspel-player-id', generatedId);
        return generatedId;
    } catch (error) {
        return `player-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
}

const playerSessionId = getPlayerSessionId();
const coopGame = {
    left: { x: 12, y: 50 },
    right: { x: 88, y: 50 },
    gifts: [
        { x: 25, y: 20, collected: false },
        { x: 50, y: 18, collected: false },
        { x: 76, y: 28, collected: false },
        { x: 32, y: 78, collected: false },
        { x: 68, y: 80, collected: false }
    ],
    won: false
};

function updateCoopGame() {
    if (!coopBoard) return;

    coopLeftPlayer.style.left = `${coopGame.left.x}%`;
    coopLeftPlayer.style.top = `${coopGame.left.y}%`;
    coopRightPlayer.style.left = `${coopGame.right.x}%`;
    coopRightPlayer.style.top = `${coopGame.right.y}%`;

    coopGifts.forEach((giftElement, index) => {
        const gift = coopGame.gifts[index];
        giftElement.style.left = `${gift.x}%`;
        giftElement.style.top = `${gift.y}%`;
        giftElement.classList.toggle('collected', gift.collected);
    });

    const collected = coopGame.gifts.filter((gift) => gift.collected).length;
    teamProgressEl.textContent = `${collected} van ${coopGame.gifts.length} pakjes verzameld`;
    if (collected === coopGame.gifts.length && !coopGame.won) {
        coopGame.won = true;
        houseStatus.textContent = 'Gewonnen! Jullie hebben alle pakjes verzameld! 🎉';
    }
}

function collectNearbyGifts(player) {
    coopGame.gifts.forEach((gift) => {
        const distance = Math.hypot(player.x - gift.x, player.y - gift.y);
        if (!gift.collected && distance < 8) gift.collected = true;
    });
}

function moveCoopPlayer(player, deltaX, deltaY) {
    if (coopGame.won) return;
    player.x = Math.max(5, Math.min(95, player.x + deltaX));
    player.y = Math.max(8, Math.min(92, player.y + deltaY));
    collectNearbyGifts(player);
    updateCoopGame();
    saveCoopState();
}

function resetCoopGame() {
    coopGame.left = { x: 12, y: 50 };
    coopGame.right = { x: 88, y: 50 };
    coopGame.gifts.forEach((gift, index) => {
        gift.collected = false;
        gift.x = [25, 50, 76, 32, 68][index];
        gift.y = [20, 18, 28, 78, 80][index];
    });
    coopGame.won = false;
    if (houseStatus) houseStatus.textContent = 'Klaar? Beweeg allebei naar de pakjes!';
    updateCoopGame();
    saveCoopState();
    coopBoard.focus();
}

function getCoopSnapshot() {
    return {
        left: { ...coopGame.left },
        right: { ...coopGame.right },
        gifts: coopGame.gifts.map((gift) => ({ ...gift })),
        won: coopGame.won
    };
}

function saveCoopState() {
    if (!currentRoomCode || !coopBoard) return;

    const snapshot = getCoopSnapshot();
    localStorage.setItem(`pietenspel-coop-${currentRoomCode}`, JSON.stringify(snapshot));
    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(coopGameChannel);
        channel.postMessage({ roomCode: currentRoomCode, snapshot });
        channel.close();
    }
}

function loadCoopState() {
    if (!currentRoomCode || !coopBoard) return;

    const raw = localStorage.getItem(`pietenspel-coop-${currentRoomCode}`);
    if (!raw) return;

    try {
        const snapshot = JSON.parse(raw);
        coopGame.left = snapshot.left || coopGame.left;
        coopGame.right = snapshot.right || coopGame.right;
        coopGame.gifts = Array.isArray(snapshot.gifts) ? snapshot.gifts : coopGame.gifts;
        coopGame.won = Boolean(snapshot.won);
        updateCoopGame();
    } catch (error) {
        localStorage.removeItem(`pietenspel-coop-${currentRoomCode}`);
    }
}

if ('BroadcastChannel' in window) {
    const coopChannel = new BroadcastChannel(coopGameChannel);
    coopChannel.addEventListener('message', (event) => {
        const { roomCode, snapshot } = event.data || {};
        if (!coopBoard || roomCode !== currentRoomCode || !snapshot) return;

        coopGame.left = snapshot.left || coopGame.left;
        coopGame.right = snapshot.right || coopGame.right;
        coopGame.gifts = Array.isArray(snapshot.gifts) ? snapshot.gifts : coopGame.gifts;
        coopGame.won = Boolean(snapshot.won);
        localStorage.setItem(`pietenspel-coop-${roomCode}`, JSON.stringify(snapshot));
        updateCoopGame();
    });
}

if (coopBoard) {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        const moves = {
            w: [0, -4], a: [-4, 0], s: [0, 4], d: [4, 0],
            arrowup: [0, -4], arrowleft: [-4, 0], arrowdown: [0, 4], arrowright: [4, 0]
        };
        const move = moves[key];
        if (!move) return;
        if (!canControlSelectedRole()) return;
        event.preventDefault();
        const player = getSelectedRole();
        moveCoopPlayer(coopGame[player], move[0], move[1]);
    });
    touchArrowButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.disabled || button.dataset.player !== getSelectedRole() || !canControlSelectedRole()) return;
            moveCoopPlayer(coopGame[button.dataset.player], Number(button.dataset.dx), Number(button.dataset.dy));
        });
    });
    resetCoopGame();
}

function loadRoomState(roomCode) {
    const raw = localStorage.getItem(`pietenspel-room-${roomCode}`);
    if (!raw) {
        return {
            round: 1,
            leftDone: false,
            rightDone: false,
            won: false,
            message: 'Jullie moeten samen de missie halen.',
            left: { name: 'Speler links', avatar: '🧝' },
            right: { name: 'Speler rechts', avatar: '🧑‍🚀' }
        };
    }

    try {
        return {
            round: 1,
            leftDone: false,
            rightDone: false,
            won: false,
            message: 'Jullie moeten samen de missie halen.',
            left: { name: 'Speler links', avatar: '🧝' },
            right: { name: 'Speler rechts', avatar: '🧑‍🚀' },
            ...JSON.parse(raw)
        };
    } catch (error) {
        return {
            round: 1,
            leftDone: false,
            rightDone: false,
            message: 'Jullie moeten samen de missie halen.',
            left: { name: 'Speler links', avatar: '🧝' },
            right: { name: 'Speler rechts', avatar: '🧑‍🚀' }
        };
    }
}

function saveRoomState(roomCode, state) {
    localStorage.setItem(`pietenspel-room-${roomCode}`, JSON.stringify(state));
    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(roomChannel);
        channel.postMessage({ roomCode, state });
        channel.close();
    }
}

function getSelectedRole() {
    const checked = document.querySelector('input[name="team-role"]:checked');
    return checked ? checked.value : null;
}

function updateControlAccess() {
    const selectedRole = getSelectedRole();
    touchArrowButtons.forEach((button) => {
        button.disabled = !selectedRole || button.dataset.player !== selectedRole;
    });
}

function canControlSelectedRole() {
    if (!currentRoomCode) return false;
    const state = loadRoomState(currentRoomCode);
    const owner = (state.claimedRoles || {})[getSelectedRole()];
    return !owner || owner === playerSessionId;
}

function updateTeamChatAccess() {
    const enabled = Boolean(currentRoomCode && getSelectedRole() && canControlSelectedRole());
    if (teamChatInput) teamChatInput.disabled = !enabled;
    if (teamChatSend) teamChatSend.disabled = !enabled;
}

function renderTeamChat(messages) {
    if (!teamChatBox) return;

    teamChatBox.replaceChildren();
    if (!messages.length) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'team-chat-empty';
        emptyMessage.textContent = 'Nog geen berichten. Kies een rol om te chatten.';
        teamChatBox.appendChild(emptyMessage);
        return;
    }

    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'team-chat-message';
        messageElement.textContent = `${message.sender}: ${message.text}`;
        teamChatBox.appendChild(messageElement);
    });
    teamChatBox.scrollTop = teamChatBox.scrollHeight;
}

function loadTeamChat() {
    if (!teamChatBox || !currentRoomCode) return;

    try {
        const messages = JSON.parse(localStorage.getItem(`pietenspel-chat-${currentRoomCode}`) || '[]');
        renderTeamChat(Array.isArray(messages) ? messages : []);
    } catch (error) {
        renderTeamChat([]);
    }
}

function sendTeamChatMessage() {
    const text = teamChatInput?.value.trim();
    if (!text || !currentRoomCode || !getSelectedRole() || !canControlSelectedRole()) return;

    const messages = JSON.parse(localStorage.getItem(`pietenspel-chat-${currentRoomCode}`) || '[]');
    const message = {
        sender: (playerNameInput?.value || '').trim() || `Speler ${getSelectedRole()}`,
        text
    };
    const nextMessages = [...messages, message].slice(-40);
    localStorage.setItem(`pietenspel-chat-${currentRoomCode}`, JSON.stringify(nextMessages));
    renderTeamChat(nextMessages);
    teamChatInput.value = '';

    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(teamChatChannel);
        channel.postMessage({ roomCode: currentRoomCode, message });
        channel.close();
    }
}

if (teamChatSend) teamChatSend.addEventListener('click', sendTeamChatMessage);
if (teamChatInput) {
    teamChatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') sendTeamChatMessage();
    });
}

if ('BroadcastChannel' in window) {
    const chatChannel = new BroadcastChannel(teamChatChannel);
    chatChannel.addEventListener('message', (event) => {
        const { roomCode, message } = event.data || {};
        if (!teamChatBox || roomCode !== currentRoomCode || !message?.text) return;
        const messages = JSON.parse(localStorage.getItem(`pietenspel-chat-${roomCode}`) || '[]');
        const nextMessages = [...messages, message].slice(-40);
        localStorage.setItem(`pietenspel-chat-${roomCode}`, JSON.stringify(nextMessages));
        renderTeamChat(nextMessages);
    });
}

function updateRoleStatus() {
    if (!roleStatusEl || !currentRoomCode) return;

    const state = loadRoomState(currentRoomCode);
    const claimedRoles = state.claimedRoles || {};
    const role = getSelectedRole();
    if (!role) {
        roleStatusEl.textContent = 'Kies eerst speler links of speler rechts.';
        updateControlAccess();
        updateTeamChatAccess();
        return;
    }
    const owner = claimedRoles[role];
    roleStatusEl.textContent = owner && owner !== playerSessionId
        ? `Speler ${role} is al bezet. Kies de andere rol.`
        : `Jij speelt als speler ${role}. Deze rol is voor jou gereserveerd.`;
    updateControlAccess();
    updateTeamChatAccess();
}

function applyCurrentPlayerInfo() {
    if (!currentRoomCode) return;

    const state = loadRoomState(currentRoomCode);
    const claimedRoles = state.claimedRoles || {};
    let role = getSelectedRole();
    if (!role) {
        if (roleStatusEl) roleStatusEl.textContent = 'Kies eerst speler links of speler rechts.';
        updateControlAccess();
        return;
    }
    const otherRole = role === 'left' ? 'right' : 'left';

    if (claimedRoles[role] && claimedRoles[role] !== playerSessionId) {
        if (claimedRoles[otherRole] && claimedRoles[otherRole] !== playerSessionId) {
            if (roleStatusEl) roleStatusEl.textContent = 'Beide rollen zijn al bezet in deze kamer.';
            updateControlAccess();
            updateTeamChatAccess();
            return;
        }

        role = otherRole;
        const fallbackRadio = document.querySelector(`input[name="team-role"][value="${role}"]`);
        if (fallbackRadio) fallbackRadio.checked = true;
    }

    state.claimedRoles = { ...claimedRoles, [role]: playerSessionId };
    const playerName = (playerNameInput.value || '').trim() || (role === 'left' ? 'Speler links' : 'Speler rechts');

    state[role] = {
        name: playerName,
        avatar: selectedAvatar
    };

    saveRoomState(currentRoomCode, state);
    updateRoleStatus();
    updateTeamStatus();
}

function updateTeamStatus() {
    if (!currentRoomCode) return;

    const state = loadRoomState(currentRoomCode);
    if (sharedRoundLabel) {
        sharedRoundLabel.textContent = state.won ? 'Missie gehaald!' : `Ronde ${state.round} van ${totalTeamRounds}`;
    }

    if (teamMissionEl) {
        teamMissionEl.textContent = state.won ? 'Jullie hebben alle pakjes bezorgd. Wat een goed team!' : teamMissions[state.round - 1];
    }

    if (teamProgressEl && !coopBoard) {
        const completed = Number(Boolean(state.leftDone)) + Number(Boolean(state.rightDone));
        teamProgressEl.textContent = state.won ? '5 van 5 rondes gehaald' : `${completed} van 2 opdrachten klaar`;
    }

    if (houseStatus && !coopBoard) {
        houseStatus.textContent = state.message || 'Jullie moeten samen de missie halen.';
    }

    if (leftTaskBtn) {
        leftTaskBtn.disabled = Boolean(state.leftDone) || state.won;
        leftTaskBtn.textContent = state.leftDone ? '✅ Klaar!' : '✅ Pakjes klaarzetten';
    }

    if (rightTaskBtn) {
        rightTaskBtn.disabled = Boolean(state.rightDone) || state.won;
        rightTaskBtn.textContent = state.rightDone ? '✅ Klaar!' : '✅ Code controleren';
    }

    updateRoleStatus();
}

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'SPEEL-';
    for (let i = 0; i < 4; i += 1) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function setCurrentRoomCode(code) {
    currentRoomCode = code;
    roomCodeEl.textContent = code;
    loadCoopState();
    loadTeamChat();
    updateTeamStatus();
}

function createRoom() {
    const nextCode = generateRoomCode();
    const state = {
        round: 1,
        leftDone: false,
        rightDone: false,
        won: false,
        message: 'Jullie zijn klaar om samen de missie te halen.',
        left: { name: 'Speler links', avatar: '🧝' },
        right: { name: 'Speler rechts', avatar: '🧑‍🚀' }
    };
    saveRoomState(nextCode, state);
    setCurrentRoomCode(nextCode);
}

async function copyRoomCode() {
    if (!currentRoomCode) {
        createRoom();
    }

    try {
        await navigator.clipboard.writeText(currentRoomCode);
        const state = loadRoomState(currentRoomCode);
        state.message = `Code ${currentRoomCode} is gekopieerd. Deel hem met je team.`;
        saveRoomState(currentRoomCode, state);
        updateTeamStatus();
    } catch (error) {
        const state = loadRoomState(currentRoomCode);
        state.message = `Jouw code is ${currentRoomCode}. Deel hem met je team.`;
        saveRoomState(currentRoomCode, state);
        updateTeamStatus();
    }
}

function joinRoom() {
    const code = (joinRoomInput.value || '').trim().toUpperCase();
    if (!code) {
        const state = loadRoomState(currentRoomCode || 'SPEEL-0000');
        state.message = 'Typ eerst een code in om een kamer te openen.';
        saveRoomState(currentRoomCode || 'SPEEL-0000', state);
        updateTeamStatus();
        return;
    }

    const state = loadRoomState(code);
    state.message = `Je bent verbonden met kamer ${code}. Samenwerken!`;
    saveRoomState(code, state);
    currentRoomCode = code;
    roomCodeEl.textContent = code;
    joinRoomInput.value = '';
    updateTeamStatus();
}

function completeTeamTask(side) {
    if (!currentRoomCode) return;

    const state = loadRoomState(currentRoomCode);
    const role = side === 'left' ? 'left' : 'right';
    state[`${side}Done`] = true;

    if (role === 'left') {
        state.message = `${state.left?.name || 'Speler links'} heeft de pakjes klaar gezet.`;
    } else {
        state.message = `${state.right?.name || 'Speler rechts'} heeft de code gecontroleerd.`;
    }

    if (state.leftDone && state.rightDone && state.round >= totalTeamRounds) {
        state.won = true;
        state.message = 'Gefeliciteerd! Jullie hebben de hele pakjesmissie gehaald.';
    } else if (state.leftDone && state.rightDone) {
        state.round += 1;
        state.leftDone = false;
        state.rightDone = false;
        state.message = `Goed teamwork! Ronde ${state.round} begint.`;
    }

    saveRoomState(currentRoomCode, state);
    updateTeamStatus();
}

function restartTeamGame() {
    if (coopBoard) {
        resetCoopGame();
    }

    if (!currentRoomCode) return;

    const state = loadRoomState(currentRoomCode);
    state.round = 1;
    state.leftDone = false;
    state.rightDone = false;
    state.won = false;
    state.message = 'Een nieuwe missie begint. Werk goed samen!';
    saveRoomState(currentRoomCode, state);
    updateTeamStatus();
}

if (createRoomBtn) {
    createRoomBtn.addEventListener('click', createRoom);
}

if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', copyRoomCode);
}

if (joinRoomBtn) {
    joinRoomBtn.addEventListener('click', joinRoom);
}

if (joinRoomInput) {
    joinRoomInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            joinRoom();
        }
    });
}

if (leftTaskBtn) {
    leftTaskBtn.addEventListener('click', () => completeTeamTask('left'));
}

if (rightTaskBtn) {
    rightTaskBtn.addEventListener('click', () => completeTeamTask('right'));
}

if (restartTeamBtn) {
    restartTeamBtn.addEventListener('click', restartTeamGame);
}

avatarButtons.forEach((button) => {
    button.addEventListener('click', () => {
        avatarButtons.forEach((item) => item.classList.toggle('active', item === button));
        selectedAvatar = button.dataset.avatar;
        applyCurrentPlayerInfo();
    });
});

document.querySelectorAll('input[name="team-role"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        applyCurrentPlayerInfo();
    });
});

if (playerNameInput) {
    playerNameInput.addEventListener('input', applyCurrentPlayerInfo);
}

if ('BroadcastChannel' in window) {
    const syncChannel = new BroadcastChannel(roomChannel);
    syncChannel.addEventListener('message', (event) => {
        const { roomCode, state } = event.data || {};
        if (roomCode && roomCode === currentRoomCode) {
            const mergedState = { ...loadRoomState(roomCode), ...state };
            localStorage.setItem(`pietenspel-room-${roomCode}`, JSON.stringify(mergedState));
            updateTeamStatus();
        }
    });
}

if (window.addEventListener) {
    window.addEventListener('storage', (event) => {
        if (!currentRoomCode) return;
        const key = `pietenspel-room-${currentRoomCode}`;
        if (event.key === key && event.newValue) {
            updateTeamStatus();
        }
    });
}

if (roomCodeEl) {
    const initialCode = generateRoomCode();
    saveRoomState(initialCode, {
        round: 1,
        leftDone: false,
        rightDone: false,
        won: false,
        message: 'Jullie moeten samen de missie halen.',
        left: { name: 'Speler links', avatar: '🧝' },
        right: { name: 'Speler rechts', avatar: '🧑‍🚀' }
    });
    setCurrentRoomCode(initialCode);
}

