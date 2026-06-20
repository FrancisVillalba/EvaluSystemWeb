import { useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import type { Client } from '../../data/clients'
import './Clients.css'

type ClientsProps = {
  clients: Client[]
  onDashboard: () => void
  onEditClient: (clientId: number) => void
  onNewClient: () => void
  onOrders: () => void
  onLogout: () => void
  onDeleteClient: (clientId: number) => void
}

const CLIENTS_PER_PAGE = 5

function Clients({
  clients,
  onDashboard,
  onDeleteClient,
  onEditClient,
  onLogout,
  onNewClient,
  onOrders,
}: ClientsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('')
  const [carrierFilter, setCarrierFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return clients.filter((client) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          client.name,
          client.document,
          client.phone,
          client.email,
          client.city,
          client.isCarrier ? 'transportadora' : 'cliente',
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      const matchesStatus = !status || client.status === status
      const matchesCarrier =
        !carrierFilter ||
        (carrierFilter === 'transportadora' && client.isCarrier) ||
        (carrierFilter === 'cliente' && !client.isCarrier)

      return matchesSearch && matchesStatus && matchesCarrier
    })
  }, [carrierFilter, clients, searchTerm, status])

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / CLIENTS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStart = (safeCurrentPage - 1) * CLIENTS_PER_PAGE
  const paginatedClients = filteredClients.slice(
    pageStart,
    pageStart + CLIENTS_PER_PAGE,
  )
  const visibleStart = filteredClients.length === 0 ? 0 : pageStart + 1
  const visibleEnd = Math.min(pageStart + CLIENTS_PER_PAGE, filteredClients.length)

  function resetPage() {
    setCurrentPage(1)
  }

  return (
    <main className="clients-shell">
      <Sidebar
        activeItem="clients"
        onClients={() => undefined}
        onDashboard={onDashboard}
        onLogout={onLogout}
        onOrders={onOrders}
      />

      <section className="clients-main">
        <header className="clients-header">
          <div>
            <p className="eyebrow">ABM de clientes</p>
            <h1>Lista de clientes</h1>
            <p>Consulta clientes registrados y filtra por estado o tipo.</p>
          </div>
          <button className="clients-primary" type="button" onClick={onNewClient}>
            Agregar cliente
          </button>
        </header>

        <section className="clients-filters" aria-label="Filtros de clientes">
          <label htmlFor="client-search">
            Buscar cliente
            <input
              id="client-search"
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                resetPage()
              }}
              placeholder="Nombre, RUC, telefono o ciudad"
            />
          </label>
          <label htmlFor="client-status">
            Estado
            <select
              id="client-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                resetPage()
              }}
            >
              <option value="">Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </label>
          <label htmlFor="client-type">
            Tipo
            <select
              id="client-type"
              value={carrierFilter}
              onChange={(event) => {
                setCarrierFilter(event.target.value)
                resetPage()
              }}
            >
              <option value="">Todos</option>
              <option value="cliente">Cliente</option>
              <option value="transportadora">Transportadora</option>
            </select>
          </label>
        </section>

        <section className="clients-panel">
          <div className="clients-panel-heading">
            <div>
              <h2>Clientes registrados</h2>
              <p>{filteredClients.length} clientes encontrados</p>
            </div>
          </div>

          <div className="clients-table-wrap">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>RUC</th>
                  <th>Telefono</th>
                  <th>Email</th>
                  <th>Ciudad</th>
                  <th>Transportadora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.document}</td>
                    <td>{client.phone}</td>
                    <td>{client.email}</td>
                    <td>{client.city}</td>
                    <td>
                      <span
                        className={`carrier-status ${client.isCarrier ? 'yes' : 'no'}`}
                      >
                        {client.isCarrier ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`client-status ${client.status.toLowerCase()}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>
                      <div className="client-row-actions">
                        <button type="button" onClick={() => onEditClient(client.id)}>
                          Editar
                        </button>
                        <button
                          className="delete-client"
                          type="button"
                          onClick={() => onDeleteClient(client.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredClients.length === 0 ? (
              <p className="clients-empty">No se encontraron clientes.</p>
            ) : null}
          </div>

          <footer className="clients-pagination">
            <span>
              Mostrando {visibleStart}-{visibleEnd} de {filteredClients.length}
            </span>
            <div>
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Anterior
              </button>
              <strong>
                Pagina {safeCurrentPage} de {totalPages}
              </strong>
              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                Siguiente
              </button>
            </div>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Clients
