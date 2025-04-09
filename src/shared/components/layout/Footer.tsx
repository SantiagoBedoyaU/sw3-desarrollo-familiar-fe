function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#c2daf1] text-[#1d3557] text-sm">
      <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Información institucional */}
        <section className="space-y-1 text-center md:text-left">
          <p className="font-semibold">
            Facultad de Ciencias Jurídicas y Sociales
          </p>
          <p>Programa de Desarrollo Familiar</p>
          <p>Manizales, Caldas, Colombia</p>
          <p className="text-xs text-[#457b9d] mt-2">
            © {year} Universidad de Caldas. Todos los derechos reservados.
          </p>
        </section>

        {/* Enlaces redes sociales */}
        <section className="flex flex-col items-center gap-2 md:items-end">
          <p className="font-medium mb-1">Síguenos</p>
          <section className="flex gap-4">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/escuelas.familiares_ucaldas/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-[#457b9d] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.976.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.976-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.976-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608C4.516 2.495 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.093 12 2.093m0-2.163C8.741 0 8.332.014 7.052.072 5.71.133 4.422.432 3.3 1.555 2.178 2.678 1.879 3.966 1.818 5.308.76 6.584.747 6.993.747 12s.013 5.416.072 6.692c.061 1.342.36 2.63 1.482 3.753 1.122 1.123 2.41 1.421 3.752 1.482 1.276.059 1.685.072 6.692.072s5.416-.013 6.692-.072c1.342-.061 2.63-.36 3.752-1.482 1.123-1.122 1.421-2.41 1.482-3.752.059-1.276.072-1.685.072-6.692s-.013-5.416-.072-6.692c-.061-1.342-.36-2.63-1.482-3.753C20.63.432 19.342.133 18 .072 16.724.014 16.315 0 12 0z" />
                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998z" />
                <circle cx="18.406" cy="5.594" r="1.44" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:prodefamiliar@ucaldas.edu.co"
              target="_blank"
              rel="noreferrer"
              aria-label="Email"
              className="hover:text-[#457b9d] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.217l-8 4.8-8-4.8V4zm0 1.383v6.634l5.803-3.545L0 5.383zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zM10.197 8.472L16 12.017V5.383l-5.803 3.09z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UCkI2eh9zYd2hKBYyFY0X1wQ"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-[#457b9d] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.122C.002 7.343.01 6.6.064 5.78l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
              </svg>
            </a>
          </section>
        </section>
      </section>
    </footer>
  )
}

export default Footer
