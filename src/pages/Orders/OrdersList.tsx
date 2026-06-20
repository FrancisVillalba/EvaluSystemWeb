import { useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import './OrdersList.css'

const orders = [
  {
    id: 'DTF-1048',
    date: '2026-06-14',
    client: 'Urban Print Co.',
    seller: 'Camila',
    type: 'DTF Textil',
    meters: '18 m',
    status: 'Pendiente de impresion',
    delivery: '2026-06-14',
    total: 'Gs. 1.450.000',
  },
  {
    id: 'UV-1047',
    date: '2026-06-14',
    client: 'Brava Store',
    seller: 'Martin',
    type: 'UV DTF',
    meters: '9 m',
    status: 'En impresion',
    delivery: '2026-06-14',
    total: 'Gs. 980.000',
  },
  {
    id: 'DTF-1046',
    date: '2026-06-13',
    client: 'Norte Uniformes',
    seller: 'Sofia',
    type: 'DTF Textil',
    meters: '24 m',
    status: 'Diseno aprobado',
    delivery: '2026-06-15',
    total: 'Gs. 2.120.000',
  },
  {
    id: 'UV-1045',
    date: '2026-06-12',
    client: 'Mateo Accesorios',
    seller: 'Camila',
    type: 'UV DTF',
    meters: '6 m',
    status: 'Entregado',
    delivery: '2026-06-13',
    total: 'Gs. 640.000',
  },
  {
    id: 'DTF-1044',
    date: '2026-06-11',
    client: 'Sur Textil',
    seller: 'Francisco Villalba',
    type: 'DTF Textil',
    meters: '15 m',
    status: 'Entregado',
    delivery: '2026-06-12',
    total: 'Gs. 1.220.000',
  },
]

const clients = Array.from(new Set(orders.map((order) => order.client)))
const statuses = Array.from(new Set(orders.map((order) => order.status)))

type OrdersListProps = {
  onClients: () => void
  onDashboard: () => void
  onEditOrder: (orderId: string) => void
  onNewOrder: () => void
  onLogout: () => void
}

function OrdersList({
  onClients,
  onDashboard,
  onEditOrder,
  onLogout,
  onNewOrder,
}: OrdersListProps) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [status, setStatus] = useState('')
  const [client, setClient] = useState('')

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesDateFrom = !dateFrom || order.date >= dateFrom
        const matchesDateTo = !dateTo || order.date <= dateTo
        const matchesStatus = !status || order.status === status
        const matchesClient = !client || order.client === client

        return matchesDateFrom && matchesDateTo && matchesStatus && matchesClient
      }),
    [client, dateFrom, dateTo, status],
  )

  return (
    <main className="orders-shell">
      <Sidebar
        activeItem="orders"
        onClients={onClients}
        onDashboard={onDashboard}
        onLogout={onLogout}
        onOrders={() => undefined}
      />

      <section className="orders-main">
        <header className="orders-header">
          <div>
            <p className="eyebrow">Gestion de pedidos</p>
            <h1>Lista de pedidos</h1>
            <p>Consulta pedidos cargados y filtra por fecha, estado o cliente.</p>
          </div>
          <button className="orders-primary" type="button" onClick={onNewOrder}>
            Nuevo pedido
          </button>
        </header>

        <section className="orders-filters" aria-label="Filtros de pedidos">
          <label htmlFor="date-from">
            Fecha desde
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label htmlFor="date-to">
            Fecha hasta
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>
          <label htmlFor="status">
            Estado
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos</option>
              {statuses.map((statusOption) => (
                <option key={statusOption}>{statusOption}</option>
              ))}
            </select>
          </label>
          <label htmlFor="client">
            Cliente
            <select
              id="client"
              value={client}
              onChange={(event) => setClient(event.target.value)}
            >
              <option value="">Todos</option>
              {clients.map((clientOption) => (
                <option key={clientOption}>{clientOption}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="orders-panel">
          <div className="orders-panel-heading">
            <div>
              <h2>Pedidos cargados</h2>
              <p>{filteredOrders.length} pedidos encontrados</p>
            </div>
          </div>

          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Vendedor</th>
                  <th>Tipo</th>
                  <th>Metros</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.client}</td>
                    <td>{order.seller}</td>
                    <td>{order.type}</td>
                    <td>{order.meters}</td>
                    <td>
                      <span
                        className={`orders-status ${order.status
                          .toLowerCase()
                          .replaceAll(' ', '-')}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.delivery}</td>
                    <td>{order.total}</td>
                    <td>
                      <button
                        className="orders-edit"
                        type="button"
                        onClick={() => onEditOrder(order.id)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 ? (
              <p className="orders-empty">
                No se encontraron pedidos con esos filtros.
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  )
}

export default OrdersList
