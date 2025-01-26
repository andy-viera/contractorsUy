import Layout from "@/components/Layout";
import ProductHeading from "@/components/ProductHeading";
import { BFC, BPC } from "@/lib/constants";

export default function Guide() {
  return (
    <Layout>
      <main className="px-8 py-8 text-gray-800 border rounded-lg shadow-lg sm:px-20 sm:py-14">
        <ProductHeading
          productName="Contractor's Guide"
          productDescription={
            <>
              Trabajar como contractor en Uruguay, especialmente en el rubro de
              software, requiere entender cómo funciona el sistema de impuestos.
              Si tomás las decisiones correctas, podés optimizar costos y
              trabajar en un marco legal adecuado. Acá te cuento lo más
              importante desde mi humilde punto de vista como fellow developer
              en base a lo que yo he entendido. Si encontrás errores podés
              aportar tu granito de arena reportándolo, para ello mirá{" "}
              <a
                target="_blank"
                className=" text-sky-600"
                href="https://github.com/andy-viera/contractorsUy/readme.txt"
              >
                cómo contribuir al proyecto
              </a>
              .
            </>
          }
          productStatus="beta"
        />
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Pasos para pasar de empleado a contractor
          </h2>
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
                  la categoría de aportes que te convenga. Abir una unipersonal
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
        </section>
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Elegí la figura legal adecuada
          </h2>
          <h3 className="mb-2 text-xl font-semibold">Unipersonal</h3>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              Si exportás software y el cliente te provee la computadora,
              calificás como "sin combinación de capital y trabajo". Esto
              significa que quedás exonerado del IRPF y solo tenés que pagar BPS
              y FONASA.
            </li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">SAS</h3>
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
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">Aportes al BPS</h2>
          <h3 className="mb-2 text-xl font-semibold">
            Para SAS (Sociedad por Acciones Simplificada)
          </h3>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              El aporte jubilatorio mínimo es el 15% (aporte personal /
              montepío) + 7.5% (aporte patronal) más el 0,1% para el FRL, todo
              sobre el monto imponible de 15 BFC (1 BFC = U${BFC}).
            </li>
            <li>
              El aporte a FONASA depende de tu situación familiar y se calcula
              sobre 6,5 BPC (1 BPC = $U{BPC}). Por ejemplo: si no tenés hijos ni
              cónyuge a cargo y la remuneración es mayor a 2,5 BPC, pagás el
              4,5% (
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/10314/"
              >
                ver tasas FONASA
              </a>
              ).
            </li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">Para Unipersonales</h3>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              El aporte jubilatorio y el FRL dependen de la categoría que
              elijas, siendo la primera 11 BFC y la décima 60 BFC (
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/6665/industria-y-comercio.html"
              >
                ver todas las categorías
              </a>
              ), los porcentajes son los mismos mencionados para SAS.
            </li>
            <li>
              El aporte a FONASA se calcula como &lt;remuneración&gt; * 0,7 *
              &lt;porcentaje de fonasa aplicable&gt;.{" "}
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">IRPF, IRAE e IVA</h2>
          <p className="mb-2">
            Si seguís un camino legal óptimo no deberías de pagar IRPF / IRAE
            debido a las exoneraciones actuales al rubro de "Profesionales de la
            informática" (como hace referencia la DGI).
          </p>
          <div className="overflow-x-scroll xl:overflow-x-hidden">
            <table className="!border-separate border-spacing-0 w-full mt-6 text-left table-auto">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-4 py-2 border-t border-l border-gray-300 rounded-tl-xl">
                    Actividad a facturar
                  </th>
                  <th className="px-4 py-2 border-t border-l border-gray-300">
                    Lugar de producción del Software
                  </th>
                  <th className="px-4 py-2 border-t border-l border-gray-300">
                    Exoneración IRAE / IRPF e IVA
                  </th>
                  <th className="px-4 py-2 border-t border-l border-gray-300">
                    IVA
                  </th>
                  <th className="px-4 py-2 border-t border-l border-r border-gray-300 rounded-tr-xl">
                    Requisitos
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Uso, cesión de uso o venta de software propio
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Al menos una parte en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Parcialmente exonerada de IRAE (Coeficiente)
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Tasa 22% a las ventas locales. Sin IVA en caso de
                    exportación.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300">
                    Registrar el activo (Ley de Propiedad Intelectual).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Desarrollo de software (no registrado por el desarrollador)
                    y servicios vinculados facturados a empresa local Forma
                    Jurídica: SAS, SA o SRL
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Más del 50% de los costos directos en el Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    100% exonerada de IRAE.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Tasa 22%
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRAE por el Art. 161 Bis inc ii del Decreto
                    150/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados al exterior y por Unipersonal.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    100% exonerada de IRPF si el equipo informático lo aporta la
                    empresa del exterior.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Sin IVA
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRPF por el literal K del Art. 34 del Decreto
                    148/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados al exterior y por Unipersonal.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    100% exonerada de IRAE si el equipo informático NO lo aporta
                    la empresa del exterior.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Sin IVA
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRAE por el Art. 163 bis del Decreto 150/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados al exterior y por Forma Jurídica: SAS,
                    SA o SRL.
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    100% exonerada de IRAE
                  </td>
                  <td className="px-4 py-2 border-t border-l border-gray-300">
                    Sin IVA
                  </td>
                  <td className="px-4 py-2 border-t border-l border-r border-gray-300">
                    Factura electrónica con la adenda: Contribuyente 100%
                    exonerado de IRAE por el Art. 163 bis del Decreto 150/007.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300 rounded-bl-xl">
                    Desarrollo de software (no registrado) y servicios
                    vinculados facturados localmente y por Unipersonal.
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300">
                    Realizado en Uruguay
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300">
                    Sin exoneración IRPF
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-gray-300">
                    Tasa 22%
                  </td>
                  <td className="px-4 py-2 border-t border-b border-l border-r border-gray-300 rounded-br-xl">
                    N/A
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">Deducciones de IRPF</h2>
          <p className="mb-1.5">
            Podés aplicar las siguientes deducciones en tu liquidación de
            impuestos:
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
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">Recursos visuales</h2>
          <h3 className="mb-2 text-xl font-semibold">
            Diagrama de decisión del simulador{" "}
          </h3>
          <img
            className="w-full roudned-lg"
            src="/diagram.png"
            alt="Diagrama simulador"
          />
        </section>
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">Fuentes</h2>
          <ul className="ml-6 list-disc">
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/17795/aportacion-de-administradores-y-representantes-legales-sas.html"
              >
                Aportación de administradores y representantes legales SAS
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/10314/"
              >
                Tasas Fonasa
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/835/tasas.html"
              >
                Tasas aporte jubilatorio
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/bps/valores.jsp?contentid=5478"
              >
                Valores actuales de BPC y BFC
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.dbc.com.uy/post/novedades07032022"
              >
                Software: Exoneración IRAE e IRPF (DB consultora)
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.bps.gub.uy/6665/industria-y-comercio.html"
              >
                Aportes mínimos - industria y comercio
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/deducciones-admitidas-liquidacion-del-irpf"
              >
                Deducciones admitidas en la liquidación del IRPF
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-sky-600"
                href="https://www.reddit.com/r/CharruaDevs/"
              >
                Se utilizó también información proporcionada por la comunidad
                del subreddit CharruaDevs, particularmente los aportes del
                usuario "The Contador"
              </a>
            </li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}
