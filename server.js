const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Config
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON received:', err.message);
        return res.status(400).send({ error: 'Invalid JSON body' });
    }
    next();
});
app.use(express.static(path.join(__dirname))); // Serve all project files statically

// Ensure directories exist
const MEDIA_DIR = path.join(__dirname, 'media', 'characters');
if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

// Simple JSON DB
const DB_PATH = path.join(__dirname, 'characters.json');
let charactersDB = {};
if (fs.existsSync(DB_PATH)) {
    try {
        const rawData = fs.readFileSync(DB_PATH);
        charactersDB = JSON.parse(rawData);
    } catch (err) {
        console.error('Failed to parse characters.json:', err);
    }
}

function saveDB() {
    fs.writeFileSync(DB_PATH, JSON.stringify(charactersDB, null, 2));
}

// Simple JSON DB for ubahn illustrations
const UBAHN_DB_PATH = path.join(__dirname, 'ubahn-illus.json');
let ubahnIllusDB = {};
if (fs.existsSync(UBAHN_DB_PATH)) {
    try {
        const rawData = fs.readFileSync(UBAHN_DB_PATH);
        ubahnIllusDB = JSON.parse(rawData);
    } catch (err) {
        console.error('Failed to parse ubahn-illus.json:', err);
    }
}

function saveUbahnDB() {
    fs.writeFileSync(UBAHN_DB_PATH, JSON.stringify(ubahnIllusDB, null, 2));
}

// Simple JSON DB for door illustrations
const DOOR_DB_PATH = path.join(__dirname, 'door-illus.json');
let doorIllusDB = { doorIllus: [] };
if (fs.existsSync(DOOR_DB_PATH)) {
    try {
        const rawData = fs.readFileSync(DOOR_DB_PATH);
        doorIllusDB = JSON.parse(rawData);
    } catch (err) {
        console.error('Failed to parse door-illus.json:', err);
    }
}

function saveDoorDB() {
    fs.writeFileSync(DOOR_DB_PATH, JSON.stringify(doorIllusDB, null, 2));
}


// POST endpoint: api.character.create
app.post('/api.character.create', (req, res) => {
    try {
        const { image, name, timestamp } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Character name is required' });
        }
        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Check if name already exists
        const existingIds = Object.keys(charactersDB);
        const exists = existingIds.some(id => charactersDB[id].name === name);
        if (exists) {
            return res.status(400).json({ error: 'Character with this name already exists' });
        }

        const characterId = 'char_' + Date.now();
        const imagePath = path.join(MEDIA_DIR, `${characterId}.png`);

        // Base64 to Buffer
        const imageBuffer = Buffer.from(image, 'base64');
        fs.writeFileSync(imagePath, imageBuffer);

        const characterImgUrl = `/media/characters/${characterId}.png`;

        // Save to DB
        charactersDB[characterId] = {
            characterId,
            name,
            characterImgUrl,
            timestamp: timestamp || new Date().toISOString()
        };
        saveDB();

        console.log(`[API] Created character ${name} with ID ${characterId}`);

        return res.status(200).json({
            status: 'success',
            characterId: characterId,
            message: 'Character created successfully',
            characterImgUrl
        });
    } catch (err) {
        console.error('[API] Error in create:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint: api.character.get
app.post('/api.character.get', (req, res) => {
    try {
        const { characterId } = req.body;
        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const character = charactersDB[characterId];
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }

        console.log(`[API] Fetched character ID ${characterId}`);
        return res.status(200).json(character);
    } catch (err) {
        console.error('[API] Error in get:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint: api.ubahn-illus.save
app.post('/api.ubahn-illus.save', (req, res) => {
    try {
        const { image, canvas_data, from, timestamp } = req.body;

        if (!canvas_data) {
            return res.status(400).json({ error: 'canvas_data is required' });
        }

        const illusId = 'illus_' + Date.now();

        // Save to DB (we just keep the latest one for simplicity or keep all of them)
        // Let's store it as the 'latest' and also keep history
        ubahnIllusDB['latest'] = {
            illusId,
            image,
            canvas_data,
            from,
            timestamp: timestamp || new Date().toISOString()
        };
        saveUbahnDB();

        console.log(`[API] Saved ubahn illustration from ${from || 'unknown'}`);

        return res.status(200).json({
            status: 'success',
            message: 'Illustration saved successfully'
        });
    } catch (err) {
        console.error('[API] Error in ubahn-illus save:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET endpoint: api.ubahn-illus.get
app.get('/api.ubahn-illus.get', (req, res) => {
    try {
        const latest = ubahnIllusDB['latest'];
        if (!latest) {
            return res.status(404).json({ error: 'No illustration found' });
        }

        console.log(`[API] Fetched latest ubahn illustration`);
        return res.status(200).json(latest);
    } catch (err) {
        console.error('[API] Error in ubahn-illus get:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint: api.door-illus.save
app.post('/api.door-illus.save', (req, res) => {
    try {
        const { image, id_door, from, x, y, timestamp } = req.body;

        if (!image || !id_door) {
            return res.status(400).json({ error: 'image and id_door are required' });
        }

        const illusId = 'door_illus_' + Date.now();
        const imagePath = path.join(MEDIA_DIR, `${illusId}.png`);

        // Base64 to Buffer
        const imageBuffer = Buffer.from(image, 'base64');
        fs.writeFileSync(imagePath, imageBuffer);

        const url = `/media/characters/${illusId}.png`;

        // Save to DB
        doorIllusDB.doorIllus.push({
            id: illusId,
            id_door,
            url,
            from,
            x,
            y,
            timestamp: timestamp || new Date().toISOString()
        });
        saveDoorDB();

        console.log(`[API] Saved door illustration on door ${id_door} from ${from || 'unknown'}`);

        return res.status(200).json({
            status: 'success',
            message: 'Door illustration saved successfully'
        });
    } catch (err) {
        console.error('[API] Error in door-illus save:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET or POST endpoint: api.door-illus.get
app.post('/api.door-illus.get', (req, res) => {
    try {
        console.log(`[API] Fetched door illustrations`);
        return res.status(200).json(doorIllusDB);
    } catch (err) {
        console.error('[API] Error in door-illus get:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api.door-illus.get', (req, res) => {
    try {
        console.log(`[API] Fetched door illustrations`);
        return res.status(200).json(doorIllusDB);
    } catch (err) {
        console.error('[API] Error in door-illus get:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Local backend server running at http://localhost:${PORT}`);
    console.log(`- Base directory served statically: ${__dirname}`);
    console.log(`- Database path: ${DB_PATH}`);
});
