export type Client = {
  id: number
  name: string
  document: string
  phone: string
  email: string
  city: string
  isCarrier: boolean
  status: 'Activo' | 'Inactivo'
}

export const initialClients: Client[] = [
  {
    id: 1,
    name: 'Urban Print Co.',
    document: '80012345-1',
    phone: '0981 220 440',
    email: 'ventas@urbanprint.com',
    city: 'Asuncion',
    isCarrier: false,
    status: 'Activo',
  },
  {
    id: 2,
    name: 'Brava Store',
    document: '80155220-7',
    phone: '0972 880 112',
    email: 'pedidos@bravastore.com',
    city: 'San Lorenzo',
    isCarrier: false,
    status: 'Activo',
  },
  {
    id: 3,
    name: 'Norte Uniformes',
    document: '80099882-3',
    phone: '0983 445 120',
    email: 'compras@norteuniformes.com',
    city: 'Luque',
    isCarrier: false,
    status: 'Activo',
  },
  {
    id: 4,
    name: 'Mateo Accesorios',
    document: '80211890-0',
    phone: '0961 772 300',
    email: 'mateo@accesorios.com',
    city: 'Fernando de la Mora',
    isCarrier: false,
    status: 'Inactivo',
  },
  {
    id: 5,
    name: 'Sur Textil',
    document: '80111222-5',
    phone: '0971 300 221',
    email: 'ventas@surtextil.com',
    city: 'Lambare',
    isCarrier: false,
    status: 'Activo',
  },
  {
    id: 6,
    name: 'Pixel Merch',
    document: '80222111-4',
    phone: '0982 118 900',
    email: 'hola@pixelmerch.com',
    city: 'Asuncion',
    isCarrier: false,
    status: 'Activo',
  },
  {
    id: 7,
    name: 'Mbarete Sports',
    document: '80077118-8',
    phone: '0962 442 010',
    email: 'pedidos@mbaretesports.com',
    city: 'Capiata',
    isCarrier: false,
    status: 'Activo',
  },
  {
    id: 8,
    name: 'Casa Grafica',
    document: '80045090-2',
    phone: '0984 610 722',
    email: 'admin@casagrafica.com',
    city: 'Luque',
    isCarrier: true,
    status: 'Inactivo',
  },
  {
    id: 9,
    name: 'Neo Uniformes',
    document: '80239004-1',
    phone: '0991 223 344',
    email: 'contacto@neouniformes.com',
    city: 'Mariano Roque Alonso',
    isCarrier: false,
    status: 'Activo',
  },
]
