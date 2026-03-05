/**
 * Fetches GeoJSON circuit data from bacinger/f1-circuits repo
 * and converts them to SVG track outline files.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, '..', 'public', 'tracks');

const BASE_URL = 'https://raw.githubusercontent.com/bacinger/f1-circuits/master/circuits';

// Map: SVG filename -> GeoJSON filename in the repo
const circuits = {
    'albert-park': 'au-1953',
    'shanghai': 'cn-2004',
    'suzuka': 'jp-1962',
    'bahrain': 'bh-2002',
    'jeddah': 'sa-2021',
    'miami': 'us-2022',
    'imola': 'it-1953',
    'monaco': 'mc-1929',
    'barcelona': 'es-1991',
    'montreal': 'ca-1978',
    'spielberg': 'at-1969',
    'silverstone': 'gb-1948',
    'spa': 'be-1925',
    'budapest': 'hu-1986',
    'zandvoort': 'nl-1948',
    'monza': 'it-1922',
    'baku': 'az-2016',
    'singapore': 'sg-2008',
    'austin': 'us-2012',
    'mexico-city': 'mx-1962',
    'interlagos': 'br-1940',
    'las-vegas': 'us-2023',
    'lusail': 'qa-2004',
    'yas-marina': 'ae-2009',
};

function geoJsonToSvgPath(coordinates) {
    // Extract lon/lat bounds
    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    for (const [lon, lat] of coordinates) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
    }

    const lonRange = maxLon - minLon || 1;
    const latRange = maxLat - minLat || 1;

    // Add padding
    const padding = 10;
    const svgSize = 200;
    const drawSize = svgSize - padding * 2;

    // Maintain aspect ratio
    const aspect = lonRange / latRange;
    let scaleX, scaleY, offsetX, offsetY;

    if (aspect > 1) {
        scaleX = drawSize;
        scaleY = drawSize / aspect;
        offsetX = padding;
        offsetY = padding + (drawSize - scaleY) / 2;
    } else {
        scaleX = drawSize * aspect;
        scaleY = drawSize;
        offsetX = padding + (drawSize - scaleX) / 2;
        offsetY = padding;
    }

    // Convert to SVG coordinates — flip Y axis (lat increases up, SVG Y increases down)
    const points = coordinates.map(([lon, lat]) => {
        const x = ((lon - minLon) / lonRange) * scaleX + offsetX;
        const y = ((maxLat - lat) / latRange) * scaleY + offsetY;
        return [x.toFixed(2), y.toFixed(2)];
    });

    // Build the SVG path
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i][0]} ${points[i][1]}`;
    }
    d += ' Z'; // close the loop

    return { d, svgSize };
}

async function main() {
    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const entries = Object.entries(circuits);
    console.log(`Generating ${entries.length} track SVGs...\n`);

    for (const [name, geoJsonId] of entries) {
        const url = `${BASE_URL}/${geoJsonId}.geojson`;
        try {
            console.log(`  Fetching ${name} (${geoJsonId})...`);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const feature = data.features[0];
            const coords = feature.geometry.coordinates;

            const { d, svgSize } = geoJsonToSvgPath(coords);

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" fill="none">
  <path d="${d}" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

            const outPath = join(OUTPUT_DIR, `${name}.svg`);
            writeFileSync(outPath, svg, 'utf-8');
            console.log(`  ✓ ${name}.svg`);
        } catch (err) {
            console.error(`  ✗ Failed: ${name} — ${err.message}`);
        }
    }

    console.log('\nDone!');
}

main();
