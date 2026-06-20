import { useEffect, useMemo, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import './OrderEntry.css'

type DetailRow = {
  id: number
  product: string
  machine: string
  quantity: string
  unitPrice: string
  extraPrice: string
  designFileName: string
  designFileUrl: string
}

type DetailField = Exclude<
  keyof DetailRow,
  'id' | 'designFileName' | 'designFileUrl'
>

type OrderEntryProps = {
  orderId: string | null
  onBack: () => void
  onClients: () => void
  onDashboard: () => void
  onOrders: () => void
  onLogout: () => void
}

type EditableOrder = {
  client: string
  deliveryDate: string
  meters: string
  paymentStatus: string
  product: string
  seller: string
  type: string
  unitPrice: string
}

type AttachedFile = {
  name: string
  url: string
}

const editableOrders: Record<string, EditableOrder> = {
  'DTF-1048': {
    client: 'Urban Print Co.',
    deliveryDate: '2026-06-14',
    meters: '18',
    paymentStatus: 'pendiente',
    product: 'DTF Textil por metro',
    seller: 'camila',
    type: 'DTF Textil',
    unitPrice: '80000',
  },
  'UV-1047': {
    client: 'Brava Store',
    deliveryDate: '2026-06-14',
    meters: '9',
    paymentStatus: 'parcial',
    product: 'Sticker UV DTF',
    seller: 'martin',
    type: 'UV DTF',
    unitPrice: '95000',
  },
  'DTF-1046': {
    client: 'Norte Uniformes',
    deliveryDate: '2026-06-15',
    meters: '24',
    paymentStatus: 'pagado',
    product: 'DTF Textil por metro',
    seller: 'sofia',
    type: 'DTF Textil',
    unitPrice: '82000',
  },
  'UV-1045': {
    client: 'Mateo Accesorios',
    deliveryDate: '2026-06-13',
    meters: '6',
    paymentStatus: 'pagado',
    product: 'Sticker UV DTF',
    seller: 'camila',
    type: 'UV DTF',
    unitPrice: '90000',
  },
  'DTF-1044': {
    client: 'Sur Textil',
    deliveryDate: '2026-06-12',
    meters: '15',
    paymentStatus: 'pagado',
    product: 'DTF Textil por metro',
    seller: 'francisco',
    type: 'DTF Textil',
    unitPrice: '78000',
  },
}

function createEmptyRow(): DetailRow {
  return {
    id: Date.now() + Math.random(),
    product: '',
    machine: '',
    quantity: '',
    unitPrice: '',
    extraPrice: '',
    designFileName: '',
    designFileUrl: '',
  }
}

const initialRows: DetailRow[] = [
  {
    ...createEmptyRow(),
    product: '',
    machine: '',
    quantity: '',
    unitPrice: '',
    extraPrice: '',
    designFileName: '',
    designFileUrl: '',
  },
]

function toNumber(value: string) {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}

function formatThousands(value: string) {
  const numericValue = value.replace(/\D/g, '')

  return numericValue ? Number(numericValue).toLocaleString('es-PY') : ''
}

function OrderEntry({
  orderId,
  onBack,
  onClients,
  onDashboard,
  onLogout,
  onOrders,
}: OrderEntryProps) {
  const orderToEdit = orderId ? editableOrders[orderId] : undefined
  const isEditing = Boolean(orderToEdit)
  const [paidAmount, setPaidAmount] = useState('')
  const [paymentProof, setPaymentProof] = useState<AttachedFile | null>(null)
  const [rows, setRows] = useState<DetailRow[]>(() =>
    orderToEdit
      ? [
          {
            ...createEmptyRow(),
            machine:
              orderToEdit.type === 'UV DTF' ? 'UV DTF A3+' : 'Epson DTF 60cm',
            product: orderToEdit.product,
            quantity: orderToEdit.meters,
            unitPrice: formatThousands(orderToEdit.unitPrice),
          },
        ]
      : initialRows,
  )
  const rowsRef = useRef(rows)
  const paymentProofRef = useRef(paymentProof)

  useEffect(() => {
    rowsRef.current = rows
  }, [rows])

  useEffect(() => {
    paymentProofRef.current = paymentProof
  }, [paymentProof])

  useEffect(
    () => () => {
      rowsRef.current.forEach((row) => {
        if (row.designFileUrl) {
          URL.revokeObjectURL(row.designFileUrl)
        }
      })

      if (paymentProofRef.current?.url) {
        URL.revokeObjectURL(paymentProofRef.current.url)
      }
    },
    [],
  )

  const total = useMemo(
    () =>
      rows.reduce((sum, row) => {
        const quantity = toNumber(row.quantity)
        const unitPrice = toNumber(row.unitPrice)
        const extraPrice = toNumber(row.extraPrice)

        return sum + quantity * unitPrice + extraPrice
      }, 0),
    [rows],
  )

  function updateRow(id: number, field: DetailField, value: string) {
    const formattedValue =
      field === 'unitPrice' || field === 'extraPrice' ? formatThousands(value) : value

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: formattedValue,
            }
          : row,
      ),
    )
  }

  function addRow() {
    setRows((currentRows) => [...currentRows, createEmptyRow()])
  }

  function removeRow(id: number) {
    setRows((currentRows) => {
      const rowToRemove = currentRows.find((row) => row.id === id)

      if (rowToRemove?.designFileUrl) {
        URL.revokeObjectURL(rowToRemove.designFileUrl)
      }

      return currentRows.filter((row) => row.id !== id)
    })
  }

  function updateDesignFile(id: number, file: File | undefined) {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== id) {
          return row
        }

        if (row.designFileUrl) {
          URL.revokeObjectURL(row.designFileUrl)
        }

        if (!file) {
          return {
            ...row,
            designFileName: '',
            designFileUrl: '',
          }
        }

        return {
          ...row,
          designFileName: file.name,
          designFileUrl: URL.createObjectURL(file),
        }
      }),
    )
  }

  function updatePaymentProof(file: File | undefined) {
    setPaymentProof((currentProof) => {
      if (currentProof?.url) {
        URL.revokeObjectURL(currentProof.url)
      }

      if (!file) {
        return null
      }

      return {
        name: file.name,
        url: URL.createObjectURL(file),
      }
    })
  }

  return (
    <main className="entry-shell">
      <Sidebar
        activeItem="orders"
        onClients={onClients}
        onDashboard={onDashboard}
        onLogout={onLogout}
        onOrders={onOrders}
      />

      <section className="entry-main">
        <header className="entry-header">
          <div>
            <p className="eyebrow">Carga de ventas impresiones</p>
            <h1>{isEditing ? `Editar pedido ${orderId}` : 'Nuevo pedido'}</h1>
            <p>
              {isEditing
                ? 'Actualiza los datos de la venta y sus disenos asociados.'
                : 'Registra la venta y sus detalles para enviarla a produccion.'}
            </p>
          </div>
          <button className="entry-back" type="button" onClick={onBack}>
            Volver a la lista
          </button>
        </header>

        <form
          className="entry-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <section className="entry-section">
            <div className="section-title">Carga de ventas impresiones</div>
            <div className="entry-fields">
              <label className="field client-field" htmlFor="client">
                Cliente
                <select id="client" defaultValue={orderToEdit?.client ?? ''}>
                  <option value="" disabled>
                    Seleccionar cliente
                  </option>
                  <option>Urban Print Co.</option>
                  <option>Brava Store</option>
                  <option>Norte Uniformes</option>
                  <option>Mateo Accesorios</option>
                </select>
              </label>

              <label className="field" htmlFor="payment-method">
                Forma Pago
                <select id="payment-method" defaultValue="transferencia">
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="credito">Credito</option>
                </select>
              </label>

              <label className="field" htmlFor="seller">
                Vendedor
                <select id="seller" defaultValue={orderToEdit?.seller ?? 'francisco'}>
                  <option value="francisco">Francisco Villalba</option>
                  <option value="camila">Camila</option>
                  <option value="martin">Martin</option>
                  <option value="sofia">Sofia</option>
                </select>
              </label>

              <label className="field" htmlFor="delivery-date">
                Fecha Entrega
                <input
                  id="delivery-date"
                  type="date"
                  defaultValue={orderToEdit?.deliveryDate ?? '2026-06-14'}
                />
              </label>

              <label className="field" htmlFor="paid-amount">
                Monto pagado
                <input
                  id="paid-amount"
                  inputMode="numeric"
                  value={paidAmount}
                  onChange={(event) =>
                    setPaidAmount(formatThousands(event.target.value))
                  }
                  placeholder="0"
                />
              </label>

              <label className="field" htmlFor="payment-status">
                Estado de pago
                <select
                  id="payment-status"
                  defaultValue={orderToEdit?.paymentStatus ?? 'pendiente'}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="parcial">Parcial</option>
                  <option value="pagado">Pagado</option>
                </select>
              </label>

              <div className="field payment-proof-field">
                <label htmlFor="payment-proof">Comprobante de pago</label>
                <div className="file-control payment-proof-control">
                  <input
                    id="payment-proof"
                    className="file-control-input"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) =>
                      updatePaymentProof(event.target.files?.[0])
                    }
                  />
                  <label className="file-control-picker" htmlFor="payment-proof">
                    Seleccionar archivo
                  </label>
                  <span className="file-control-name">
                    {paymentProof?.name ?? 'Sin comprobante adjunto'}
                  </span>
                  {paymentProof ? (
                    <a
                      className="file-control-download"
                      href={paymentProof.url}
                      download={paymentProof.name}
                      aria-label="Descargar comprobante de pago"
                      title="Descargar comprobante"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        focusable="false"
                      >
                        <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>

              <label className="field notes-field" htmlFor="notes">
                Observacion
                <textarea id="notes" rows={2} placeholder="Notas del pedido" />
              </label>
            </div>
          </section>

          <section className="entry-section">
            <div className="section-title detail-title">
              <span>Detalle de productos y disenos</span>
              <button type="button" onClick={addRow}>
                + Agregar detalle
              </button>
            </div>
            <div className="detail-table-wrap">
              {rows.length > 0 ? (
                <div className="detail-list">
                  {rows.map((row, index) => {
                    const rowTotal =
                      toNumber(row.quantity) * toNumber(row.unitPrice) +
                      toNumber(row.extraPrice)

                    return (
                      <article className="detail-row" key={row.id}>
                        <div className="detail-row-header">
                          <span>Detalle #{index + 1}</span>
                          <button
                            className="row-remove"
                            type="button"
                            onClick={() => removeRow(row.id)}
                            aria-label="Quitar detalle"
                          >
                            Quitar
                          </button>
                        </div>

                        <div className="detail-grid">
                          <label className="detail-field product-field">
                            Producto
                            <select
                              value={row.product}
                              onChange={(event) =>
                                updateRow(row.id, 'product', event.target.value)
                              }
                            >
                              <option value="">Seleccionar</option>
                              <option>Sticker UV DTF</option>
                              <option>DTF Textil por metro</option>
                              <option>Logo manga</option>
                              <option>Etiqueta textil</option>
                            </select>
                          </label>

                          <label className="detail-field machine-field">
                            Maquina
                            <select
                              value={row.machine}
                              onChange={(event) =>
                                updateRow(row.id, 'machine', event.target.value)
                              }
                            >
                              <option value="">Seleccionar</option>
                              <option>UV DTF A3+</option>
                              <option>Epson DTF 60cm</option>
                              <option>Horno curado textil</option>
                            </select>
                          </label>

                          <label className="detail-field quantity-field">
                            Cantidad
                            <input
                              inputMode="decimal"
                              value={row.quantity}
                              onChange={(event) =>
                                updateRow(row.id, 'quantity', event.target.value)
                              }
                            />
                          </label>

                          <label className="detail-field price-field">
                            Precio unitario
                            <input
                              inputMode="numeric"
                              value={row.unitPrice}
                              onChange={(event) =>
                                updateRow(
                                  row.id,
                                  'unitPrice',
                                  event.target.value,
                                )
                              }
                            />
                          </label>

                          <label className="detail-field extra-field">
                            Precio extra
                            <input
                              inputMode="numeric"
                              value={row.extraPrice}
                              onChange={(event) =>
                                updateRow(
                                  row.id,
                                  'extraPrice',
                                  event.target.value,
                                )
                              }
                            />
                          </label>

                          <div className="detail-field design-field">
                            <label htmlFor={`design-file-${row.id}`}>
                              Diseno PNG
                            </label>
                            <div className="file-control">
                              <input
                                id={`design-file-${row.id}`}
                                className="file-control-input"
                                type="file"
                                accept="image/png"
                                onChange={(event) =>
                                  updateDesignFile(
                                    row.id,
                                    event.target.files?.[0],
                                  )
                                }
                              />
                              <label
                                className="file-control-picker"
                                htmlFor={`design-file-${row.id}`}
                              >
                                Seleccionar archivo
                              </label>
                              <span className="file-control-name">
                                {row.designFileName || 'Sin diseno adjunto'}
                              </span>
                              {row.designFileUrl ? (
                                <a
                                  className="file-control-download"
                                  href={row.designFileUrl}
                                  download={row.designFileName}
                                  aria-label="Descargar diseno"
                                  title="Descargar diseno"
                                >
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    focusable="false"
                                  >
                                    <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14" />
                                  </svg>
                                </a>
                              ) : null}
                            </div>
                          </div>

                          <div className="detail-total">
                            <span>Precio total</span>
                            <output>
                              {rowTotal > 0
                                ? `Gs. ${rowTotal.toLocaleString('es-PY')}`
                                : 'Gs. 0'}
                            </output>
                          </div>

                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="detail-empty">
                  <p>No hay detalles cargados para este pedido.</p>
                  <button type="button" onClick={addRow}>
                    + Agregar primer detalle
                  </button>
                </div>
              )}
            </div>
          </section>

          <footer className="entry-footer">
            <div>
              <span>Total estimado</span>
              <strong>Gs. {total.toLocaleString('es-PY')}</strong>
            </div>
            <button className="save-button" type="submit">
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default OrderEntry
