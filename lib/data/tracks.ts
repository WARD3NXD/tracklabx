export interface Track {
    id: string;
    name: string;
    fullName: string;
    country: string;
    countryCode: string;
    continent: string;
    lapRecord: string;
    lapRecordHolder: string;
}

export const tracks: Track[] = [
    { id: 'bahrain', name: 'Bahrain', fullName: 'Bahrain International Circuit', country: 'Bahrain', countryCode: 'BH', continent: 'Asia', lapRecord: '1:31.447', lapRecordHolder: 'Pedro de la Rosa' },
    { id: 'jeddah', name: 'Jeddah', fullName: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', countryCode: 'SA', continent: 'Asia', lapRecord: '1:30.734', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'melbourne', name: 'Melbourne', fullName: 'Albert Park Circuit', country: 'Australia', countryCode: 'AU', continent: 'Oceania', lapRecord: '1:19.813', lapRecordHolder: 'Charles Leclerc' },
    { id: 'suzuka', name: 'Suzuka', fullName: 'Suzuka International Racing Course', country: 'Japan', countryCode: 'JP', continent: 'Asia', lapRecord: '1:30.983', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'shanghai', name: 'Shanghai', fullName: 'Shanghai International Circuit', country: 'China', countryCode: 'CN', continent: 'Asia', lapRecord: '1:32.238', lapRecordHolder: 'Michael Schumacher' },
    { id: 'miami', name: 'Miami', fullName: 'Miami International Autodrome', country: 'USA', countryCode: 'US', continent: 'North America', lapRecord: '1:29.708', lapRecordHolder: 'Max Verstappen' },
    { id: 'imola', name: 'Imola', fullName: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', countryCode: 'IT', continent: 'Europe', lapRecord: '1:15.484', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'monaco', name: 'Monaco', fullName: 'Circuit de Monaco', country: 'Monaco', countryCode: 'MC', continent: 'Europe', lapRecord: '1:12.909', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'barcelona', name: 'Barcelona', fullName: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', continent: 'Europe', lapRecord: '1:16.330', lapRecordHolder: 'Max Verstappen' },
    { id: 'montreal', name: 'Montreal', fullName: 'Circuit Gilles Villeneuve', country: 'Canada', countryCode: 'CA', continent: 'North America', lapRecord: '1:13.078', lapRecordHolder: 'Valtteri Bottas' },
    { id: 'spielberg', name: 'Spielberg', fullName: 'Red Bull Ring', country: 'Austria', countryCode: 'AT', continent: 'Europe', lapRecord: '1:05.619', lapRecordHolder: 'Carlos Sainz' },
    { id: 'silverstone', name: 'Silverstone', fullName: 'Silverstone Circuit', country: 'Great Britain', countryCode: 'GB', continent: 'Europe', lapRecord: '1:27.097', lapRecordHolder: 'Max Verstappen' },
    { id: 'spa', name: 'Spa', fullName: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE', continent: 'Europe', lapRecord: '1:46.286', lapRecordHolder: 'Valtteri Bottas' },
    { id: 'budapest', name: 'Budapest', fullName: 'Hungaroring', country: 'Hungary', countryCode: 'HU', continent: 'Europe', lapRecord: '1:16.627', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'zandvoort', name: 'Zandvoort', fullName: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL', continent: 'Europe', lapRecord: '1:11.097', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'monza', name: 'Monza', fullName: 'Autodromo Nazionale Monza', country: 'Italy', countryCode: 'IT', continent: 'Europe', lapRecord: '1:21.046', lapRecordHolder: 'Rubens Barrichello' },
    { id: 'baku', name: 'Baku', fullName: 'Baku City Circuit', country: 'Azerbaijan', countryCode: 'AZ', continent: 'Asia', lapRecord: '1:43.009', lapRecordHolder: 'Charles Leclerc' },
    { id: 'singapore', name: 'Singapore', fullName: 'Marina Bay Street Circuit', country: 'Singapore', countryCode: 'SG', continent: 'Asia', lapRecord: '1:35.867', lapRecordHolder: 'Lewis Hamilton' },
    { id: 'austin', name: 'Austin', fullName: 'Circuit of the Americas', country: 'USA', countryCode: 'US', continent: 'North America', lapRecord: '1:36.169', lapRecordHolder: 'Charles Leclerc' },
    { id: 'mexico-city', name: 'Mexico City', fullName: 'Autódromo Hermanos Rodríguez', country: 'Mexico', countryCode: 'MX', continent: 'North America', lapRecord: '1:17.774', lapRecordHolder: 'Valtteri Bottas' },
    { id: 'interlagos', name: 'Interlagos', fullName: 'Autódromo José Carlos Pace', country: 'Brazil', countryCode: 'BR', continent: 'South America', lapRecord: '1:10.540', lapRecordHolder: 'Valtteri Bottas' },
    { id: 'las-vegas', name: 'Las Vegas', fullName: 'Las Vegas Strip Circuit', country: 'USA', countryCode: 'US', continent: 'North America', lapRecord: '1:35.490', lapRecordHolder: 'Oscar Piastri' },
    { id: 'lusail', name: 'Lusail', fullName: 'Lusail International Circuit', country: 'Qatar', countryCode: 'QA', continent: 'Asia', lapRecord: '1:24.319', lapRecordHolder: 'Max Verstappen' },
    { id: 'yas-marina', name: 'Yas Marina', fullName: 'Yas Marina Circuit', country: 'Abu Dhabi', countryCode: 'AE', continent: 'Asia', lapRecord: '1:26.103', lapRecordHolder: 'Max Verstappen' },
];

export const continents = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Oceania'];

export function getTrackById(id: string): Track | undefined {
    return tracks.find(t => t.id === id);
}
