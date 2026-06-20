import { useMemo, useState, type FormEvent } from 'react'
import Sidebar from '../../components/Sidebar'
import type { Client } from '../../data/clients'
import './ClientEntry.css'

type ClientEntryProps = {
  client?: Client
  onBack: () => void
  onDashboard: () => void
  onOrders: () => void
  onLogout: () => void
  onSave: (client: Client) => void
}

function createEmptyClient(): Client {
  return {
    id: Date.now(),
    name: '',
    document: '',
    phone: '',
    email: '',
    city: '',
    isCarrier: false,
    status: 'Activo',
  }
}

function ClientEntry({
  client,
  onBack,
  onDashboard,
  onLogout,
  onOrders,
  onSave,
}: ClientEntryProps) {
  const initialClient = useMemo(() => client ?? createEmptyClient(), [client])
  const [formClient, setFormClient] = useState<Client>(initialClient)
  const isEditing = Boolean(client)

  function updateClient(nextClientData: Partial<Client>) {
    setFormClient((currentClient) => ({
      ...currentClient,
      ...nextClientData,
    }))
  }

  function submitClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formClient.name.trim()) {
      return
    }

    onSave({
      ...formClient,
      name: formClient.name.trim(),
      document: formClient.document.trim(),
      phone: formClient.phone.trim(),
      email: formClient.email.trim(),
      city: formClient.city.trim(),
    })
  }

  return (
    <main className="client-entry-shell">
      <Sidebar
        activeItem="clients"
        onClients={onBack}
        onDashboard={onDashboard}
        onLogout={onLogout}
        onOrders={onOrders}
      />

      <section className="client-entry-main">
        <header className="client-entry-header">
          <div>
            <p className="eyebrow">ABM de clientes</p>
            <h1>{isEditing ? 'Editar cliente' : 'Nuevo cliente'}</h1>
            <p>
              {isEditing
                ? 'Actualiza los datos comerciales del cliente.'
                : 'Carga los datos comerciales para registrar un cliente.'}
            </p>
          </div>
          <button className="client-entry-secondary" type="button" onClick={onBack}>
            Volver a la lista
          </button>
        </header>

        <form className="client-entry-card" onSubmit={submitClient}>
          <div className="client-entry-card-header">
            <h2>Datos del cliente</h2>
          </div>

          <div className="client-entry-grid">
            <label htmlFor="client-name">
              Cliente
              <input
                id="client-name"
                value={formClient.name}
                onChange={(event) => updateClient({ name: event.target.value })}
                placeholder="Nombre del cliente"
              />
            </label>
            <label htmlFor="client-document">
              RUC / Documento
              <input
                id="client-document"
                value={formClient.document}
                onChange={(event) => updateClient({ document: event.target.value })}
                placeholder="80000000-0"
              />
            </label>
            <label htmlFor="client-phone">
              Telefono
              <input
                id="client-phone"
                value={formClient.phone}
                onChange={(event) => updateClient({ phone: event.target.value })}
                placeholder="09xx xxx xxx"
              />
            </label>
            <label htmlFor="client-email">
              Email
              <input
                id="client-email"
                type="email"
                value={formClient.email}
                onChange={(event) => updateClient({ email: event.target.value })}
                placeholder="cliente@empresa.com"
              />
            </label>
            <label htmlFor="client-city">
              Ciudad
              <input
                id="client-city"
                value={formClient.city}
                onChange={(event) => updateClient({ city: event.target.value })}
                placeholder="Ciudad"
              />
            </label>
            <label htmlFor="client-status-entry">
              Estado
              <select
                id="client-status-entry"
                value={formClient.status}
                onChange={(event) =>
                  updateClient({ status: event.target.value as Client['status'] })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </label>
            <label className="client-entry-check" htmlFor="client-carrier">
              <input
                id="client-carrier"
                type="checkbox"
                checked={formClient.isCarrier}
                onChange={(event) => updateClient({ isCarrier: event.target.checked })}
              />
              Es transportadora
            </label>
          </div>

          <footer className="client-entry-actions">
            <button className="client-entry-secondary" type="button" onClick={onBack}>
              Cancelar
            </button>
            <button className="client-entry-primary" type="submit">
              {isEditing ? 'Guardar cambios' : 'Guardar cliente'}
            </button>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default ClientEntry
