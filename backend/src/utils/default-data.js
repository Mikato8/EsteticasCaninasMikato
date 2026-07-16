const gid = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

export const defaultDataSnapshot = () => ({
  clients: [
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
  ],
  services: [
    { id: gid(), name: 'Baño Básico', cost: 40, price: 200, icon: 'fa-shower', color: '#60a5fa', type: 'servicio' },
    { id: gid(), name: 'Baño + Corte', cost: 100, price: 400, icon: 'fa-scissors', color: '#e8a838', type: 'servicio' },
  ],
  products: [
    { id: gid(), name: 'Shampoo Canino 500ml', cost: 50, price: 120, icon: 'fa-bottle-droplet', color: '#60a5fa', type: 'producto' },
  ],
  packages: [
    {
      id: gid(),
      name: 'Paquete Puppy',
      cost: 200,
      price: 550,
      icon: 'fa-paw',
      color: '#fbbf24',
      desc: 'Baño + Corte Uñas + Limpieza Oídos',
      type: 'paquete',
    },
  ],
  appointments: [],
  sales: [],
})
