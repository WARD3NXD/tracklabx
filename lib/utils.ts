export function formatLapTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

export function parseLapTime(timeStr: string): number {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        const minutes = parseInt(parts[0]);
        const [seconds, millis] = parts[1].split('.');
        return minutes * 60000 + parseInt(seconds) * 1000 + parseInt(millis || '0');
    }
    return 0;
}

export const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern (ET)' },
    { value: 'America/Chicago', label: 'Central (CT)' },
    { value: 'America/Denver', label: 'Mountain (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Central Europe (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
];

export function formatSessionTime(
    isoString: string,
    timezone: string,
    use24h: boolean
): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: !use24h,
    };
    return date.toLocaleTimeString('en-US', options);
}

export function formatSessionDate(
    isoString: string,
    timezone: string
): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
}

export function getCountdown(targetDate: string): string {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return 'Now';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export function getTeamColor(teamName: string): string {
    const colors: Record<string, string> = {
        'Red Bull Racing': '#3671C6',
        'Ferrari': '#E80020',
        'McLaren': '#FF8000',
        'Mercedes': '#27F4D2',
        'Aston Martin': '#229971',
        'Alpine': '#FF87BC',
        'Williams': '#64C4FF',
        'Haas F1 Team': '#B6BABD',
        'Racing Bulls': '#6692FF',
        'Kick Sauber': '#52E252',
    };
    return colors[teamName] || '#888';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
