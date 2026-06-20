import { useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import './Dashboard.css'

const orders = [
  {
    id: 'DTF-1048',
    client: 'Urban Print Co.',
    seller: 'Camila',
    type: 'DTF Textil',
    meters: '18 m',
    status: 'Pendiente de impresion',
    delivery: 'Hoy 16:30',
  },
  {
    id: 'UV-1047',
    client: 'Brava Store',
    seller: 'Martin',
    type: 'UV DTF',
    meters: '9 m',
    status: 'En impresion',
    delivery: 'Hoy 18:00',
  },
  {
    id: 'DTF-1046',
    client: 'Norte Uniformes',
    seller: 'Sofia',
    type: 'DTF Textil',
    meters: '24 m',
    status: 'Diseno aprobado',
    delivery: 'Manana 10:00',
  },
  {
    id: 'UV-1045',
    client: 'Mateo Accesorios',
    seller: 'Camila',
    type: 'UV DTF',
    meters: '6 m',
    status: 'Pendiente de pago',
    delivery: 'Manana 15:00',
  },
]

type DashboardProps = {
  onClients: () => void
  onNewOrder: () => void
  onOrders: () => void
  onLogout: () => void
}

function Dashboard({ onClients, onLogout, onNewOrder, onOrders }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return orders
    }

    return orders.filter((order) =>
      [order.client, order.seller, order.type].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    )
  }, [searchTerm])

  return (
    <main className="dashboard-shell">
      <Sidebar
        activeItem="dashboard"
        onClients={onClients}
        onDashboard={() => undefined}
        onLogout={onLogout}
        onOrders={onOrders}
      />

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Operacion diaria</p>
            <h1>Tablero de impresion</h1>
            <p>Resumen actualizado de ventas, pedidos y cola de produccion.</p>
          </div>
          <button className="primary-button" type="button" onClick={onNewOrder}>
            Nuevo pedido
          </button>
        </header>

        <section className="metric-grid" aria-label="Resumen de pedidos">
          <article className="metric-card metric-blue">
            <span>Pedidos cargados hoy</span>
            <strong>60</strong>
            <small>Total ingresado por ventas</small>
          </article>
          <article className="metric-card metric-green">
            <span>Impresos</span>
            <strong>46</strong>
            <small>Pedidos ya producidos</small>
          </article>
          <article className="metric-card metric-red">
            <span>Faltan imprimir</span>
            <strong>14</strong>
            <small>Pendientes de produccion</small>
          </article>
          <article className="metric-card metric-yellow">
            <span>Entregados</span>
            <strong>50 / 60</strong>
            <small>50 entregados de 60 pedidos</small>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel orders-panel" id="pedidos">
            <div className="panel-heading">
              <div>
                <h2>Pedidos recientes</h2>
                <p>Seguimiento desde ventas hasta impresion.</p>
              </div>
              <label className="order-search" htmlFor="order-search">
                <span>Buscar pedido</span>
                <input
                  id="order-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Vendedor, cliente o tipo"
                />
              </label>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Vendedor</th>
                    <th>Tipo</th>
                    <th>Metros</th>
                    <th>Estado</th>
                    <th>Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.client}</td>
                      <td>{order.seller}</td>
                      <td>{order.type}</td>
                      <td>{order.meters}</td>
                      <td>
                        <span
                          className={`status ${order.status
                            .toLowerCase()
                            .replaceAll(' ', '-')}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.delivery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 ? (
                <p className="empty-state">
                  No se encontraron pedidos con ese criterio.
                </p>
              ) : null}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
