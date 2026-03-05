export interface Team {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
}

export const teams: Team[] = [
  { id: 'red-bull', name: 'Red Bull Racing', color: '#3671C6', secondaryColor: '#1B3C73' },
  { id: 'ferrari', name: 'Ferrari', color: '#E80020', secondaryColor: '#A60018' },
  { id: 'mclaren', name: 'McLaren', color: '#FF8000', secondaryColor: '#CC6600' },
  { id: 'mercedes', name: 'Mercedes', color: '#27F4D2', secondaryColor: '#00D2B4' },
  { id: 'aston-martin', name: 'Aston Martin', color: '#229971', secondaryColor: '#006F4E' },
  { id: 'alpine', name: 'Alpine', color: '#FF87BC', secondaryColor: '#CC6C96' },
  { id: 'williams', name: 'Williams', color: '#64C4FF', secondaryColor: '#005ACD' },
  { id: 'haas', name: 'Haas F1 Team', color: '#B6BABD', secondaryColor: '#8A8D90' },
  { id: 'racing-bulls', name: 'Racing Bulls', color: '#6692FF', secondaryColor: '#2B4EA0' },
  { id: 'sauber', name: 'Kick Sauber', color: '#52E252', secondaryColor: '#00E701' },
  { id: 'audi', name: 'Audi Revolut F1 Team', color: '#E50000', secondaryColor: '#BB0000' },
  { id: 'cadillac', name: 'Cadillac Formula 1 Team', color: '#D4AF37', secondaryColor: '#8A7323' },
];

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}
