// Base de datos de razas de perros y gatos.
// Cada registro incluye: especie, talla (tamaño), peso aproximado en kg
// y esperanza de vida en años. Los valores son promedios de referencia
// y pueden variar por sexo, línea y estado de salud del animal.
//
// Formato de tupla: [nombre, especie, tamano, pesoMin, pesoMax, vidaMin, vidaMax]
//   especie: 'perro' | 'gato'
//   tamano : 'Pequeño' | 'Mediano' | 'Grande' | 'Gigante'

const dogSeeds = [
  ['Affenpinscher', 'Pequeño', 3, 6, 12, 15],
  ['Airedale Terrier', 'Grande', 19, 25, 10, 12],
  ['Akita Americano', 'Grande', 32, 59, 10, 13],
  ['Akita Inu', 'Grande', 32, 45, 10, 13],
  ['Alaskan Malamute', 'Grande', 34, 39, 10, 14],
  ['American Bully', 'Mediano', 30, 50, 10, 13],
  ['American Pit Bull Terrier', 'Mediano', 14, 27, 12, 16],
  ['American Staffordshire Terrier', 'Mediano', 18, 32, 12, 16],
  ['Basenji', 'Pequeño', 9, 11, 12, 16],
  ['Basset Hound', 'Mediano', 20, 29, 10, 12],
  ['Beagle', 'Pequeño', 9, 11, 12, 15],
  ['Bearded Collie', 'Mediano', 18, 27, 12, 14],
  ['Bichón Frisé', 'Pequeño', 5, 8, 14, 15],
  ['Bichón Maltés', 'Pequeño', 3, 4, 12, 15],
  ['Bloodhound', 'Grande', 36, 50, 10, 12],
  ['Bobtail (Old English Sheepdog)', 'Grande', 27, 45, 10, 12],
  ['Border Collie', 'Mediano', 14, 20, 12, 15],
  ['Border Terrier', 'Pequeño', 5, 7, 12, 15],
  ['Borzoi', 'Grande', 34, 48, 9, 14],
  ['Boston Terrier', 'Pequeño', 5, 11, 11, 13],
  ['Bóxer', 'Grande', 25, 32, 10, 12],
  ['Boyero de Berna', 'Gigante', 36, 52, 7, 10],
  ['Braco Alemán', 'Grande', 20, 32, 12, 14],
  ['Bull Terrier', 'Mediano', 22, 38, 11, 14],
  ['Bulldog Francés', 'Pequeño', 8, 14, 10, 12],
  ['Bulldog Inglés', 'Mediano', 18, 25, 8, 10],
  ['Bullmastiff', 'Gigante', 45, 59, 7, 9],
  ['Cairn Terrier', 'Pequeño', 6, 8, 12, 15],
  ['Cane Corso', 'Gigante', 40, 50, 9, 12],
  ['Caniche (Poodle) Toy', 'Pequeño', 2, 4, 12, 16],
  ['Caniche (Poodle) Miniatura', 'Pequeño', 5, 9, 12, 16],
  ['Caniche (Poodle) Estándar', 'Grande', 20, 32, 12, 15],
  ['Cavalier King Charles Spaniel', 'Pequeño', 5, 8, 9, 14],
  ['Chihuahua', 'Pequeño', 1, 3, 12, 20],
  ['Chow Chow', 'Mediano', 20, 32, 8, 12],
  ['Cocker Spaniel Americano', 'Pequeño', 7, 14, 10, 14],
  ['Cocker Spaniel Inglés', 'Mediano', 12, 16, 12, 14],
  ['Collie (Rough)', 'Grande', 20, 34, 12, 14],
  ['Corgi (Pembroke Welsh)', 'Pequeño', 10, 14, 12, 13],
  ['Dálmata', 'Grande', 20, 32, 11, 13],
  ['Doberman', 'Grande', 32, 45, 10, 13],
  ['Dogo Argentino', 'Grande', 36, 45, 9, 15],
  ['Dogo de Burdeos', 'Gigante', 45, 65, 5, 8],
  ['Fila Brasileño', 'Gigante', 50, 82, 9, 11],
  ['Fox Terrier', 'Pequeño', 6, 8, 12, 15],
  ['Galgo (Greyhound)', 'Grande', 27, 40, 10, 13],
  ['Galgo Español', 'Grande', 20, 30, 12, 15],
  ['Gran Danés', 'Gigante', 50, 90, 8, 10],
  ['Golden Retriever', 'Grande', 25, 34, 10, 12],
  ['Husky Siberiano', 'Mediano', 16, 27, 12, 15],
  ['Jack Russell Terrier', 'Pequeño', 5, 8, 13, 16],
  ['Keeshond', 'Mediano', 16, 20, 12, 15],
  ['Labrador Retriever', 'Grande', 25, 36, 10, 12],
  ['Lhasa Apso', 'Pequeño', 5, 8, 12, 15],
  ['Mastín Español', 'Gigante', 52, 90, 10, 12],
  ['Mastín Napolitano', 'Gigante', 50, 70, 7, 9],
  ['Mastín Tibetano', 'Gigante', 45, 73, 10, 14],
  ['Pastor Alemán', 'Grande', 22, 40, 9, 13],
  ['Pastor Australiano', 'Mediano', 16, 32, 12, 15],
  ['Pastor Belga Malinois', 'Grande', 20, 30, 12, 14],
  ['Pastor Blanco Suizo', 'Grande', 25, 40, 12, 14],
  ['Pastor de Shetland', 'Pequeño', 6, 12, 12, 14],
  ['Pekinés', 'Pequeño', 3, 6, 12, 15],
  ['Pinscher Miniatura', 'Pequeño', 4, 6, 12, 16],
  ['Pomerania', 'Pequeño', 2, 3, 12, 16],
  ['Presa Canario', 'Gigante', 38, 59, 9, 11],
  ['Pug (Carlino)', 'Pequeño', 6, 8, 12, 15],
  ['Rottweiler', 'Grande', 35, 60, 8, 10],
  ['Salchicha (Dachshund) Estándar', 'Pequeño', 7, 15, 12, 16],
  ['Salchicha (Dachshund) Miniatura', 'Pequeño', 4, 5, 12, 16],
  ['Samoyedo', 'Mediano', 16, 30, 12, 14],
  ['San Bernardo', 'Gigante', 54, 82, 8, 10],
  ['Schnauzer Miniatura', 'Pequeño', 5, 9, 12, 15],
  ['Schnauzer Estándar', 'Mediano', 14, 20, 13, 16],
  ['Schnauzer Gigante', 'Grande', 25, 48, 10, 12],
  ['Setter Irlandés', 'Grande', 24, 32, 12, 15],
  ['Shar Pei', 'Mediano', 18, 25, 8, 12],
  ['Shiba Inu', 'Pequeño', 7, 11, 12, 16],
  ['Shih Tzu', 'Pequeño', 4, 7, 10, 16],
  ['Staffordshire Bull Terrier', 'Mediano', 11, 17, 12, 14],
  ['Teckel', 'Pequeño', 7, 15, 12, 16],
  ['Terranova (Newfoundland)', 'Gigante', 45, 68, 8, 10],
  ['Vizsla', 'Grande', 20, 30, 12, 15],
  ['Weimaraner', 'Grande', 25, 40, 10, 13],
  ['West Highland White Terrier', 'Pequeño', 6, 10, 12, 16],
  ['Whippet', 'Mediano', 7, 19, 12, 15],
  ['Xoloitzcuintle (Estándar)', 'Mediano', 11, 25, 13, 18],
  ['Yorkshire Terrier', 'Pequeño', 2, 3, 13, 16],
  ['Mestizo (Perro criollo)', 'Mediano', 5, 40, 10, 15],
]

const catSeeds = [
  ['Abisinio', 'Pequeño', 3, 5, 12, 16],
  ['American Shorthair', 'Mediano', 4, 7, 15, 20],
  ['Angora Turco', 'Pequeño', 3, 5, 12, 18],
  ['Azul Ruso', 'Pequeño', 3, 5, 15, 20],
  ['Balinés', 'Pequeño', 3, 5, 12, 20],
  ['Bengalí', 'Mediano', 4, 7, 12, 16],
  ['Birmano (Sagrado de Birmania)', 'Mediano', 3, 6, 13, 15],
  ['Bombay', 'Pequeño', 3, 5, 12, 16],
  ['Bosque de Noruega', 'Grande', 4, 9, 14, 16],
  ['British Shorthair', 'Mediano', 4, 8, 12, 17],
  ['Burmés', 'Pequeño', 3, 6, 16, 18],
  ['Chartreux (Cartujo)', 'Mediano', 3, 7, 12, 15],
  ['Cornish Rex', 'Pequeño', 3, 4, 11, 15],
  ['Devon Rex', 'Pequeño', 2, 4, 9, 15],
  ['Exótico de Pelo Corto', 'Mediano', 3, 6, 12, 15],
  ['Himalayo', 'Mediano', 3, 6, 12, 15],
  ['Maine Coon', 'Grande', 5, 11, 12, 15],
  ['Manx', 'Mediano', 3, 6, 8, 14],
  ['Munchkin', 'Pequeño', 2, 4, 12, 15],
  ['Ocicat', 'Mediano', 3, 6, 12, 18],
  ['Oriental de Pelo Corto', 'Pequeño', 3, 5, 12, 15],
  ['Persa', 'Mediano', 3, 6, 10, 17],
  ['Ragdoll', 'Grande', 4, 9, 12, 17],
  ['Sagrado de Birmania', 'Mediano', 3, 6, 13, 15],
  ['Savannah', 'Grande', 5, 11, 12, 20],
  ['Scottish Fold', 'Mediano', 3, 6, 11, 15],
  ['Selkirk Rex', 'Mediano', 3, 7, 10, 15],
  ['Siamés', 'Pequeño', 3, 5, 15, 20],
  ['Siberiano', 'Grande', 4, 9, 11, 18],
  ['Sphynx', 'Pequeño', 3, 5, 8, 14],
  ['Tonquinés', 'Pequeño', 3, 5, 15, 18],
  ['Van Turco', 'Mediano', 3, 8, 12, 17],
  ['Común Europeo', 'Mediano', 3, 6, 12, 20],
  ['Mestizo (Gato criollo)', 'Mediano', 3, 6, 12, 18],
]

const toBreed = (especie) => ([nombre, tamano, pesoMin, pesoMax, vidaMin, vidaMax]) => ({
  nombre,
  especie,
  tamano,
  pesoMin,
  pesoMax,
  vidaMin,
  vidaMax,
})

export const dogBreeds = dogSeeds.map(toBreed('perro'))
export const catBreeds = catSeeds.map(toBreed('gato'))

export const breeds = [...dogBreeds, ...catBreeds].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, 'es'),
)

const normalize = (value) =>
  (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const formatPeso = (breed) =>
  breed.pesoMin === breed.pesoMax ? `${breed.pesoMin} kg` : `${breed.pesoMin}–${breed.pesoMax} kg`

export const formatVida = (breed) =>
  breed.vidaMin === breed.vidaMax
    ? `${breed.vidaMin} años`
    : `${breed.vidaMin}–${breed.vidaMax} años`

// Busca razas por nombre (sin distinguir acentos ni mayúsculas).
// especie: 'perro' | 'gato' | 'all' (por defecto)
export const searchBreeds = (query, especie = 'all', limit = 30) => {
  const q = normalize(query)
  const pool = especie === 'all' ? breeds : breeds.filter((b) => b.especie === especie)
  if (!q) return pool.slice(0, limit)
  return pool.filter((b) => normalize(b.nombre).includes(q)).slice(0, limit)
}
