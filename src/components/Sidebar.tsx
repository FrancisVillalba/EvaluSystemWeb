import BrandLogo from './BrandLogo'
import './Sidebar.css'

export type SidebarItemId = 'dashboard' | 'orders' | 'clients' | 'production' | 'reports'

type SidebarProps = {
  activeItem: SidebarItemId
  onClients: () => void
  onDashboard: () => void
  onLogout: () => void
  onOrders: () => void
}

const sidebarItems: Array<{
  id: SidebarItemId
  label: string
  onSelect?: keyof Pick<SidebarProps, 'onClients' | 'onDashboard' | 'onOrders'>
}> = [
  { id: 'dashboard', label: 'Tablero', onSelect: 'onDashboard' },
  { id: 'orders', label: 'Pedidos', onSelect: 'onOrders' },
  { id: 'clients', label: 'Clientes', onSelect: 'onClients' },
  { id: 'production', label: 'Produccion' },
  { id: 'reports', label: 'Reportes' },
]

function Sidebar({
  activeItem,
  onClients,
  onDashboard,
  onLogout,
  onOrders,
}: SidebarProps) {
  const handlers = {
    onClients,
    onDashboard,
    onOrders,
  }

  return (
    <aside className="app-sidebar" aria-label="Navegacion principal">
      <BrandLogo />
      <nav>
        {sidebarItems.map((item) => (
          <button
            className={item.id === activeItem ? 'active' : undefined}
            key={item.id}
            type="button"
            onClick={item.onSelect ? handlers[item.onSelect] : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button className="app-sidebar-logout" type="button" onClick={onLogout}>
        Cerrar sesion
      </button>
    </aside>
  )
}

export default Sidebar
