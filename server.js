const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

loadEnvFile();

const port = Number(process.env.PORT || 3000);
const root = __dirname;
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8'
};

function loadEnvFile() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) return;

    fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
        const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
        if (!match || process.env[match[1]]) return;
        process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    });
}

function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(data));
}

function serveFile(request, response) {
    const requestedPath = request.url === '/' ? '/index.html' : request.url;
    const filePath = path.resolve(root, `.${requestedPath}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404);
        response.end('Niet gevonden');
        return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
        'Content-Type': contentTypes[extension] || 'application/octet-stream'
    });
    fs.createReadStream(filePath).pipe(response);
}

async function handleChat(request, response) {
    if (!process.env.OPENAI_API_KEY) {
        sendJson(response, 503, { error: 'OPENAI_API_KEY ontbreekt in .env.' });
        return;
    }

    let body = '';
    request.on('data', (chunk) => {
        body += chunk;
        if (body.length > 100000) request.destroy();
    });

    request.on('end', async () => {
        try {
            const payload = JSON.parse(body);
            const messages = Array.isArray(payload.messages) ? payload.messages.slice(-12) : [];
            const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    temperature: 0.8,
                    max_tokens: 250,
                    messages: [
                        {
                            role: 'system',
                            content: 'Je bent Kletspiet in een kindvriendelijk Nederlands Sinterklaasspel. Reageer warm, kort en natuurlijk op wat het kind schrijft. Luister naar de volledige zin, stel soms een passende vervolgsvraag en doe niet alsof je iets weet dat niet verteld is. Help rustig met rekenen en taal. Gebruik geen zinnen als "Nu weet ik dat je...". Geef geen gevaarlijke of volwassen instructies.'
                        },
                        ...messages
                    ]
                })
            });

            const result = await openAiResponse.json();
            if (!openAiResponse.ok) {
                sendJson(response, openAiResponse.status, { error: result.error?.message || 'OpenAI gaf een foutmelding.' });
                return;
            }

            sendJson(response, 200, { reply: result.choices?.[0]?.message?.content || 'Ik luister! Vertel verder. 😊' });
        } catch (error) {
            sendJson(response, 500, { error: 'De AI-reactie kon niet worden opgehaald.' });
        }
    });
}

const server = http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/api/chat') {
        handleChat(request, response);
        return;
    }

    if (request.method === 'GET') {
        serveFile(request, response);
        return;
    }

    response.writeHead(405);
    response.end('Methode niet toegestaan');
});

server.listen(port, () => {
    console.log(`Kletspiet draait op http://localhost:${port}`);
});
