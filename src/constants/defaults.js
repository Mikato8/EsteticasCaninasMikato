import { gid } from '../utils/id'

export const DEFAULT_COLOR = '#E06C4F'

const serviceSeeds = [
  ['Baño Básico', 40, 200, 'fa-shower', '#60a5fa'],
  ['Baño + Corte', 100, 400, 'fa-scissors', '#e8a838'],
  ['Corte de Uñas', 15, 80, 'fa-hand-sparkles', '#a78bfa'],
  ['Limpieza de Oídos', 25, 100, 'fa-ear-listen', '#34d399'],
]

const productSeeds = [
  ['Shampoo Canino 500ml', 50, 120, 'fa-bottle-droplet', '#60a5fa'],
  ['Acondicionador 500ml', 55, 140, 'fa-pump-soap', '#a78bfa'],
  ['Cepillo Desenredante', 30, 85, 'fa-brush', '#fbbf24'],
  ['Collar Antipulgas', 110, 220, 'fa-ring', '#f87171'],
]

const packageSeeds = [
  ['Paquete Puppy', 200, 550, 'fa-paw', '#fbbf24', 'Baño + Corte Uñas + Limpieza Oídos'],
  ['Paquete Premium', 400, 850, 'fa-crown', '#e8a838', 'Baño + Corte Estilizado + Hidratación + Uñas'],
]

export const defaultServices = () =>
  serviceSeeds.map(([name, cost, price, icon, color]) => ({
    id: gid(),
    name,
    cost,
    price,
    icon,
    color,
    type: 'servicio',
  }))

export const defaultProducts = () =>
  productSeeds.map(([name, cost, price, icon, color]) => ({
    id: gid(),
    name,
    cost,
    price,
    icon,
    color,
    type: 'producto',
  }))

export const defaultPackages = () =>
  packageSeeds.map(([name, cost, price, icon, color, desc]) => ({
    id: gid(),
    name,
    cost,
    price,
    icon,
    color,
    desc,
    type: 'paquete',
  }))

export const defaultClients = () => [
  {
    id: gid(),
    name: 'María García',
    tel: '5551002000',
    email: 'maria@correo.com',
    mascota: 'Luna',
    raza: 'Poodle',
    tamano: 'Pequeño',
    edad: '3 años',
    notas: 'Alergia a jabones con fragancia',
  },
  {
    id: gid(),
    name: 'Carlos López',
    tel: '5552003000',
    email: 'carlos@correo.com',
    mascota: 'Max',
    raza: 'Golden Retriever',
    tamano: 'Grande',
    edad: '5 años',
    notas: '',
  },
]
