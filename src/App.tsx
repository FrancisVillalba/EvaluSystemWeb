import { useState } from 'react'
import ClientEntry from './pages/ClientEntry/ClientEntry'
import Clients from './pages/Clients/Clients'
import Dashboard from './pages/Dashboard/Dashboard'
import LoginScreen from './pages/Login/LoginScreen'
import OrderEntry from './pages/OrderEntry/OrderEntry'
import OrdersList from './pages/Orders/OrdersList'
import { initialClients, type Client } from './data/clients'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeScreen, setActiveScreen] = useState<
    'client-entry' | 'clients' | 'dashboard' | 'orders' | 'order-entry'
  >('dashboard')
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editingClientId, setEditingClientId] = useState<number | null>(null)
  const [clients, setClients] = useState(initialClients)
  const editingClient = clients.find((client) => client.id === editingClientId)

  function logout() {
    setIsLoggedIn(false)
    setActiveScreen('dashboard')
    setEditingOrderId(null)
    setEditingClientId(null)
  }

  function openNewOrder() {
    setEditingOrderId(null)
    setActiveScreen('order-entry')
  }

  function openEditOrder(orderId: string) {
    setEditingOrderId(orderId)
    setActiveScreen('order-entry')
  }

  function openNewClient() {
    setEditingClientId(null)
    setActiveScreen('client-entry')
  }

  function openEditClient(clientId: number) {
    setEditingClientId(clientId)
    setActiveScreen('client-entry')
  }

  function saveClient(clientToSave: Client) {
    setClients((currentClients) => {
      const clientExists = currentClients.some((client) => client.id === clientToSave.id)

      if (clientExists) {
        return currentClients.map((client) =>
          client.id === clientToSave.id ? clientToSave : client,
        )
      }

      return [clientToSave, ...currentClients]
    })
    setEditingClientId(null)
    setActiveScreen('clients')
  }

  function deleteClient(clientId: number) {
    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId),
    )
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />
  }

  return activeScreen === 'order-entry' ? (
    <OrderEntry
      orderId={editingOrderId}
      onBack={() => setActiveScreen('orders')}
      onClients={() => setActiveScreen('clients')}
      onDashboard={() => setActiveScreen('dashboard')}
      onOrders={() => setActiveScreen('orders')}
      onLogout={logout}
    />
  ) : activeScreen === 'client-entry' ? (
    <ClientEntry
      client={editingClient}
      onBack={() => {
        setEditingClientId(null)
        setActiveScreen('clients')
      }}
      onDashboard={() => setActiveScreen('dashboard')}
      onOrders={() => setActiveScreen('orders')}
      onLogout={logout}
      onSave={saveClient}
    />
  ) : activeScreen === 'orders' ? (
    <OrdersList
      onClients={() => setActiveScreen('clients')}
      onDashboard={() => setActiveScreen('dashboard')}
      onLogout={logout}
      onEditOrder={openEditOrder}
      onNewOrder={openNewOrder}
    />
  ) : activeScreen === 'clients' ? (
    <Clients
      clients={clients}
      onDashboard={() => setActiveScreen('dashboard')}
      onDeleteClient={deleteClient}
      onEditClient={openEditClient}
      onLogout={logout}
      onNewClient={openNewClient}
      onOrders={() => setActiveScreen('orders')}
    />
  ) : (
    <Dashboard
      onClients={() => setActiveScreen('clients')}
      onLogout={logout}
      onNewOrder={openNewOrder}
      onOrders={() => setActiveScreen('orders')}
    />
  )
}

export default App
