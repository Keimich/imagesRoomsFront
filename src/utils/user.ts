import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'imgsRoomsUserId';

const animals: string[] = [
  'Gato', 'Cachorro', 'Cavalo', 'Vaca', 'Leão', 'Tigre', 'Elefante', 'Rato', 'Macaco', 'Baleia',
  'Pato', 'Galinha', 'Pombo', 'Corvo', 'Pinguim', 'Coruja', 'Águia', 'Ganso', 'Cisne', 'Pardal',
  'Cobra', 'Sapo', 'Jacaré', 'Lagarto', 'Tartaruga', 'Sardinha', 'Atum', 'Salmão', 'Truta', 'Dourado',
  'Formiga', 'Abelha', 'Mosca', 'Aranha', 'Grilo'
];

const adjectives: string[] = [
  'Imenso', 'Gigantesco', 'Enorme', 'Colossal', 'Grandioso', 'Monumental', 'Descomunal', 'Vastíssimo', 'Majestoso', 'Altaneiro',
  'Elevado', 'Longínquo', 'Profundo', 'Grosso', 'Espesso', 'Maciço', 'Reforçado', 'Denso', 'Potente', 'Vigoroso',
  'Forte', 'Sólido', 'Robusto', 'Rijo', 'Viril', 'Corpulento', 'Cheio', 'Abundante', 'Farto', 'Voluptuoso',
  'Exuberante', 'Opulento', 'Sensual', 'Curvilíneo', 'Majestático'
];

export function getPersistentUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function generateRandomName(): string {
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  return `${randomAnimal} ${randomAdjective}`;
}