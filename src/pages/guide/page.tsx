import { useDarkMode } from "@/contexts/DarkModeContext";
import Layout from "@/components/Layout";
import ProductHeading from "@/components/ProductHeading";
import { BFC, BPC } from "@/lib/constants";
import { parseWithDots } from "@/lib/utils";

export default function Guide() {
  const { darkMode } = useDarkMode();

  return (
    <Layout>
      <main className="max-w-6xl px-8 py-8 mx-auto text-gray-800 border dark:border-white/[0.2] rounded-lg shadow-lg dark:text-neutral-300 sm:px-20 sm:py-14">
        <ProductHeading
          productName="Contractor's Guide"
          productDescription={
            <>
              Trabajar como contractor en Uruguay, especialmente en el rubro de
              software, requiere entender cómo funciona el sistema de impuestos.
              Si tomás las decisiones correctas, podés optimizar costos y
              trabajar en un marco legal adecuado. Acá te cuento lo más
              importante desde mi humilde punto de vista en base a lo que he
              aprendido por experiencia propia, asesoramiento con contadores, e
              investigación sobre el tema. Si encontrás errores podés aportar tu
              granito de arena reportándolo, para ello mirá{" "}
              <a
                target="_blank"
                className=" text-sky-600 dark:text-sky-700"
                href="https://github.com/andy-viera/contractorsUy/blob/main/README.md#contributing"
              >
                cómo contribuir al proyecto
              </a>
              .
            </>
          }
          productStatus="beta"
        />

        <Section>
          <Title>Pasos para pasar de empleado a contractor</Title>
          <ol className="ml-6 list-decimal">
            <li>Analizá tu situación laboral actual y evaluá tus ingresos.</li>
            <li>Decidí si te conviene abrir una unipersonal o una SAS.</li>
            <li>
              Hacé los trámites para registrar tu empresa:
              <ul className="ml-6 list-disc">
                <li>
                  Para una SAS: Registrá el beneficiario final en el BCU, llevá
                  los libros obligatorios, y gestioná la facturación
                  electrónica. El proceso de apertura requiere de escribano y
                  contador, el costo estimado puede ir desde 1000 a 1500 USD.
                </li>
                <li>
                  Para una unipersonal: Registrate en la DGI y el BPS, y elegí
                  la categoría de aportes que te convenga. Abrir una unipersonal
                  es mucho menos costoso y más rápido, pero no siempre lo más
                  conveniente para todos los casos.
                </li>
              </ul>
            </li>
            <li>
              Configurá la facturación. Si exportás servicios, asegurate de que
              las facturas incluyan las leyendas correctas para que te apliquen
              las exoneraciones fiscales.
            </li>
          </ol>
        </Section>

        <Section>
          <Title>Elegí la figura legal adecuada</Title>

          <Subtitle>Unipersonal</Subtitle>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              Si exportás software y el cliente te provee la computadora,
              calificás como "sin combinación de capital y trabajo". Esto
              significa que quedás exonerado del IRPF y solo tenés que pagar BPS
              y FONASA o caja de profesionales si sos profesional universitario.
            </li>
          </ul>

          <Subtitle>SAS</Subtitle>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              Si bien es más costosa, te permite evitar el IRAE, exportar
              servicios sin IVA, y operar con más flexibilidad. Si hacés el
              trámite digital, podés abrirla en 48 a 72 horas hábiles (el resto
              de los procesos ajenos a la apertura llevan más tiempo). Tené en
              cuenta que probablemente termines contratando un contador para las
              declaraciones anuales y las facturas mensuales (U$2500 - U$4500
              mensuales) y el costo de la facturación electrónica (U$300 - U$500
              dependiendo del proveedor).
            </li>
          </ul>
        </Section>

        <Section>
          <Title>Aportes al BPS</Title>

          <Subtitle>Para SAS (Sociedad por Acciones Simplificada)</Subtitle>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              El aporte jubilatorio mínimo es el 15% (aporte personal /
              montepío) + 7.5% (aporte patronal) más el 0.1% para el FRL, todo
              sobre el monto mínimo imponible de 15 BFC (1 BFC = U$
              {parseWithDots(BFC)})<SubIndex indexes={[1, 3]} />.
            </li>
            <li>
              El aporte a FONASA depende de tu situación familiar y se calcula
              sobre 6.5 BPC (1 BPC = $U{parseWithDots(BPC)}
              <SubIndex indexes={9} />
              ). Por ejemplo: si no tenés hijos ni cónyuge a cargo y la
              remuneración es mayor a 2.5 BPC, pagás el 4.5% + 5% de aporte
              patronal
              <SubIndex indexes={2} />.
            </li>
          </ul>

          <Subtitle>Para Unipersonales</Subtitle>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              El aporte jubilatorio y el FRL dependen de la categoría de ficto
              que elijas, siendo la primera 11 BFC y la décima 60 BFC
              <SubIndex indexes={5} />, los porcentajes son los mismos
              mencionados para SAS.
            </li>
            <li>
              El aporte a FONASA
              <SubIndex indexes={8} /> depende de si combinás capital y trabajo,
              en caso afirmativo se te categoriza en el régimen de industria y
              comercio, y se calcula como: &lt;porcentaje de fonasa
              aplicable&gt; * 6.5 BPC. En caso de que no combines capitál y
              trabajo se te categoriza en servicios personales no profesionales
              y se calcula: &lt;remuneración&gt; * 0,7 * &lt;porcentaje de
              fonasa aplicable&gt;.
            </li>
          </ul>
        </Section>

        <Section>
          <Title>IRPF, IRAE e IVA</Title>
          <p className="mb-2">
            Si seguís un camino legal óptimo no deberías de pagar IRPF/IRAE
            debido a las exoneraciones actuales al rubro de software.
          </p>
          <div className="overflow-x-scroll xl:overflow-x-hidden">
            <table className="!border-separate border-spacing-0 w-full mt-6 text-left table-auto">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950">
                  <th className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1] rounded-tl-xl">
                    Actividad a facturar
                  </th>
                  <th className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Lugar de producción del Software
                  </th>
                  <th className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Exoneración IRAE / IRPF e IVA
                  </th>
                  <th className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    IVA
                  </th>
                  <th className="px-4 py-2 border-t border-l border-r border-gray-300 dark:border-white/[0.1] rounded-tr-xl">
                    Requisitos
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Uso, cesión de uso o venta de software propio
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Al menos una parte en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Parcialmente exonerada de IRAE (Coeficiente)
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Tasa 22% a las ventas locales. Sin IVA en caso de
                    exportación.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300 dark:border-white/[0.1]">
                    Registrar el activo (Ley de Propiedad Intelectual).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Desarrollo de software (no registrado por el desarrollador)
                    y servicios vinculados facturados a empresa local Forma
                    Jurídica: SAS, SA o SRL
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Más del 50% de los costos directos en el Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    100% exonerada de IRAE.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Tasa 22%
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300 dark:border-white/[0.1]">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRAE por el Art. 161 Bis inc ii del Decreto
                    150/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados al exterior y por Unipersonal.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    100% exonerada de IRPF si el equipo informático lo aporta la
                    empresa del exterior.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Sin IVA
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300 dark:border-white/[0.1]">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRPF por el literal K del Art. 34 del Decreto
                    148/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados al exterior y por Unipersonal.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    100% exonerada de IRAE si el equipo informático NO lo aporta
                    la empresa del exterior.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Sin IVA
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300 dark:border-white/[0.1]">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRAE por el Art. 163 bis del Decreto 150/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados al exterior y por Forma Jurídica: SAS,
                    SA o SRL.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    100% exonerada de IRAE
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300 dark:border-white/[0.1]">
                    Sin IVA
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300 dark:border-white/[0.1]">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRAE por el Art. 163 bis del Decreto 150/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300 dark:border-white/[0.1] rounded-bl-xl">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados localmente y por Unipersonal.
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300 dark:border-white/[0.1]">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300 dark:border-white/[0.1]">
                    Sin exoneración IRPF
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300 dark:border-white/[0.1]">
                    Tasa 22%
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-r border-gray-300 dark:border-white/[0.1] rounded-br-xl">
                    N/A
                  </td>
                </tr>
              </tbody>
            </table>
            <small className="ml-1 text-neutral-500">
              Fuente: DB consultora
              <SubIndex indexes={4} />
            </small>
          </div>
        </Section>

        <Section>
          <Title>Deducciones de IRPF</Title>
          <p className="mb-1.5">
            En caso de seguir un camino no óptimo y pagar IRPF, podés aplicar
            las siguientes deducciones en tu liquidación de impuestos:
            <SubIndex indexes={[6, 7]} />
          </p>
          <ul className="ml-6 list-disc">
            <li>20 BPC anuales por cada hijo menor de edad a cargo.</li>
            <li>40 BPC anuales por cada hijo con discapacidad a cargo.</li>
            <li>Aportes a BPS, FONASA y fondos de solidaridad.</li>
            <li>
              Aportes a la Caja de Profesionales Universitarios u otras cajas
              profesionales similares.
            </li>
            <li>
              Pagos de préstamos hipotecarios para una vivienda única y
              permanente (siempre que el costo de la vivienda no supere las UI
              1.000.000, tope de deducción anual de 36 BPC).
            </li>
          </ul>
        </Section>

        <Section>
          <Title>Recursos visuales</Title>
          <Subtitle>Diagrama de decisión del simulador</Subtitle>

          <a
            href={darkMode ? "/diagram-dark.png" : "/diagram-light.png"}
            target="_blank"
          >
            <img
              className="w-full rounded-xl"
              src={darkMode ? "/diagram-dark.png" : "/diagram-light.png"}
              alt="Diagrama simulador"
            />
          </a>
        </Section>

        <Section>
          <Title>Fuentes</Title>
          <ul className="ml-6 list-decimal">
            <li>
              <a
                id="1"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.bps.gub.uy/17795/aportacion-de-administradores-y-representantes-legales-sas.html"
              >
                Aportación de administradores y representantes legales SAS
              </a>
            </li>
            <li>
              <a
                id="2"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.bps.gub.uy/10314/"
              >
                Tasas Fonasa
              </a>
            </li>
            <li>
              <a
                id="3"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.bps.gub.uy/835/tasas.html"
              >
                Tasas aporte jubilatorio
              </a>
            </li>
            <li>
              <a
                id="4"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.dbc.com.uy/post/novedades07032022"
              >
                Software: Exoneración IRAE e IRPF (DB consultora)
              </a>
            </li>
            <li>
              <a
                id="5"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.bps.gub.uy/6665/industria-y-comercio.html"
              >
                Aportes mínimos - Industria y comercio
              </a>
            </li>
            <li>
              <a
                id="6"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/deducciones-admitidas-liquidacion-del-irpf"
              >
                Deducciones admitidas en la liquidación del IRPF
              </a>
            </li>
            <li>
              <a
                id="7"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/irpf-para-trabajadores-independientes"
              >
                IRPF para trabajadores independientes
              </a>
            </li>
            <li>
              <a
                id="8"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.bps.gub.uy/16500/trabajadores-no-dependientes.html"
              >
                Trabajadores no dependientes - BPS
              </a>
            </li>
            <li>
              <a
                id="9"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.bps.gub.uy/bps/valores.jsp?contentid=5478"
              >
                Valores actuales de BPC y BFC
              </a>
            </li>
            <li>
              <a
                id="10"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.impo.com.uy/bases/leyes/16713-1995/7"
              >
                Ley de la seguridad social (16713), Artículo 7
              </a>
            </li>
            <li>
              <a
                id="11"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.impo.com.uy/bases/decretos/148-2007"
              >
                Decreto N° 148/007, Articulo 60
              </a>
            </li>
            <li>
              <a
                id="12"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://egresados.fondodesolidaridad.edu.uy/aportes-y-montos"
              >
                Fondo de solidaridad - Aportes y montos
              </a>
            </li>
            <li>
              <a
                id="13"
                target="_blank"
                className="text-sky-600 dark:text-sky-700"
                href="https://www.reddit.com/r/CharruaDevs/"
              >
                Se utilizó también información proporcionada por la comunidad
                del subreddit CharruaDevs.
              </a>
            </li>
          </ul>
        </Section>
      </main>
    </Layout>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-6">{children}</section>;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-semibold dark:text-neutral-300">
      {children}
    </h2>
  );
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-xl font-semibold">{children}</h3>;
}

function SubIndex({ indexes }: { indexes: number[] | number }) {
  const multipleIndexes = Array.isArray(indexes);
  return (
    <sub className="ml-0.5">
      <a
        href={`#${multipleIndexes ? indexes[0] : indexes}`}
        className="text-sky-600 dark:text-sky-700"
      >
        {multipleIndexes ? indexes.map((index) => index).join(",") : indexes}
      </a>
    </sub>
  );
}
