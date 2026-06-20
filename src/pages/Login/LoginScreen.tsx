import BrandLogo from '../../components/BrandLogo'
import './LoginScreen.css'

type LoginScreenProps = {
  onLogin: () => void
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <main className="login-page">
      <section className="brand-panel" aria-label="Resumen de EvaluSystem">
        <BrandLogo />
        <div className="brand-copy">
          <p className="eyebrow">Panel de produccion</p>
          <h1>Pedidos, vendedores e impresion en un solo tablero.</h1>
        </div>
      </section>

      <section className="login-panel" aria-label="Inicio de sesion">
        <div className="form-heading">
          <p className="eyebrow">Bienvenido de vuelta</p>
          <h2>Iniciar sesion</h2>
          <p>Ingresa tus credenciales para continuar.</p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
          <label htmlFor="email">
            Correo institucional
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ventas@empresa.com"
              autoComplete="email"
            />
          </label>

          <label htmlFor="password">
            Contrasena
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contrasena"
              autoComplete="current-password"
            />
          </label>

          <div className="form-options">
            <label className="remember" htmlFor="remember">
              <input id="remember" name="remember" type="checkbox" />
              Recordarme
            </label>
            <a href="#recuperar">Olvide mi contrasena</a>
          </div>

          <button type="submit">Entrar al tablero</button>
        </form>
      </section>
    </main>
  )
}

export default LoginScreen
