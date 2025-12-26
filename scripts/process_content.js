import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'scraped_data.json');
const MEDIA_DIR = path.join(ROOT_DIR, 'src', 'assets', 'media');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'apps.ts');

if (fs.existsSync(MEDIA_DIR)) {
    fs.rmSync(MEDIA_DIR, { recursive: true, force: true });
}
fs.mkdirSync(MEDIA_DIR, { recursive: true });

const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

// Filter out empty items
const apps = rawData.filter(app => app.title && app.title !== '비어 있음 (Empty)' && (app.videoUrl || app.imageUrl));

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        if (!url) return resolve(null);
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                fs.unlink(dest, () => { }); // Delete failed file
                return resolve(null); // Just skip if 404
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(dest));
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            resolve(null);
        });
    });
};

const sanitizeFilename = (name, index) => {
    // Try to extract English text from parentheses, e.g. "Korean (English)"
    const match = name.match(/\(([^)]+)\)/);
    let id = match ? match[1] : name;

    // Replace illegal chars for filenames and code variable names
    id = id.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Remove duplicate underscores
    id = id.replace(/_+/g, '_');

    // Remove leading/trailing underscores
    id = id.replace(/^_|_$/g, '');

    // If empty or too short, use fallback
    if (id.length < 3) id = `app_${index}`;

    // Append index to ensure absolute uniqueness (simple collision avoidance)
    return `${id}_${index}`;
};

const processedApps = [];

async function processApps() {
    console.log(`Processing ${apps.length} apps...`);

    for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        const id = sanitizeFilename(app.title, i);

        // Determine assets to download
        const videoExt = app.videoUrl ? path.extname(app.videoUrl).split('?')[0] : '.mp4';
        const imageExt = app.imageUrl ? path.extname(app.imageUrl).split('?')[0] : '.png';
        // Handle empty extension
        const vExt = videoExt || '.mp4';
        const iExt = imageExt || '.png';

        const videoFilename = `${id}${vExt}`;
        const imageFilename = `${id}${iExt}`;

        const videoDest = path.join(MEDIA_DIR, videoFilename);
        const imageDest = path.join(MEDIA_DIR, imageFilename); // fallback image

        let hasVideo = false;
        let hasImage = false;

        if (app.videoUrl) {
            console.log(`Downloading video for ${app.title}...`);
            const res = await downloadFile(app.videoUrl, videoDest);
            if (res) hasVideo = true;
        }

        if (app.imageUrl) {
            // console.log(`Downloading image for ${app.title}...`);
            const res = await downloadFile(app.imageUrl, imageDest);
            if (res) hasImage = true;
        }

        // Assign categories loosely based on tags
        let category = 'Utility';
        const tags = (app.tags || []).join(' ').toLowerCase();
        if (tags.includes('game') || tags.includes('gaming')) category = 'Game';
        else if (tags.includes('creative') || tags.includes('image') || tags.includes('music') || tags.includes('video')) category = 'Creativity';
        else if (tags.includes('education') || tags.includes('learning')) category = 'Education';
        else if (tags.includes('productivity') || tags.includes('code') || tags.includes('coding')) category = 'Productivity';

        processedApps.push({
            ...app,
            id,
            category,
            hasVideo,
            hasImage,
            videoFilename: hasVideo ? videoFilename : null,
            imageFilename: hasImage ? imageFilename : null
        });
    }

    generateAppsFile();
}

function generateAppsFile() {
    let imports = `import type { Category } from './category';\n\n`;
    let appItems = `export const apps: AppItem[] = [\n`;

    processedApps.forEach(app => {
        const importNameImg = app.hasImage ? `img_${app.id}` : null;
        const importNameVid = app.hasVideo ? `vid_${app.id}` : null;

        if (importNameImg) imports += `import ${importNameImg} from '../assets/media/${app.imageFilename}';\n`;
        if (importNameVid) imports += `import ${importNameVid} from '../assets/media/${app.videoFilename}';\n`;

        appItems += `  {
    id: '${app.id}',
    title: ${JSON.stringify(app.title)},
    description: ${JSON.stringify(app.description)},
    imageUrl: ${importNameImg ? importNameImg : "''"},
    videoUrl: ${importNameVid ? importNameVid : "undefined"},
    category: '${app.category}',
    tags: ${JSON.stringify(app.tags)}
  },\n`;
    });

    appItems += `];\n`;

    const typeDef = `
export type { Category };

export interface AppItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  category: Category;
  tags: string[];
}
`;

    const content = imports + typeDef + appItems;
    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`Generated ${OUTPUT_FILE}`);
}

processApps();
