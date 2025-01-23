import Footer from "@/components/Footer";
import MainNavbar from "@/components/Navbar";

export default function Guide() {
  return (
    <>
      <MainNavbar />
      <div className="p-12 text-gray-800 border rounded-lg my-14 mx-28">
        <section className="mb-10">
          <h2 className="px-5 py-4 mb-4 text-2xl font-bold border rounded-full border-neutral-300 bg-neutral-50 w-fit">
            Contractor's Guide
          </h2>
          <p className="text-[0.97rem]">
            Trabajar como contractor en Uruguay, especialmente en el rubro de
            software, requiere entender cómo funciona el sistema de impuestos.
            Si tomás las decisiones correctas, podés optimizar costos y trabajar
            en un marco legal adecuado. Acá te cuento lo más importante desde mi
            humilde punto de vista como fellow developer en base a lo que yo he
            entendido. Si encontrás errores podés aportar tu granito de arena
            reportándolo, para ello mirá{" "}
            <a
              className=" text-sky-600"
              href="https://github.com/andy-viera/contractorsUy/readme.txt"
            >
              cómo contribuir al proyecto
            </a>
            .
          </p>
        </section>

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
                  es mucho menos costoso y más rápido.
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
              de los procesos ajenos a la apertura llevan más tiempo).
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
              El aporte jubilatorio mínimo es el 15% de 15 BFC (1 BFC =
              $1.744,40 en 2025) más el 0,1% para el FRL.
            </li>
            <li>
              El aporte a FONASA depende de tu situación familiar y se calcula
              sobre 6,5 BPC (1 BPC = $6.177 en 2024). Por ejemplo: si no tenés
              hijos ni cónyuge, pagás el 4,5%, que equivale a $1.806,7.
            </li>
            <li>
              En total, los aportes al BPS para una SAS suelen rondar los
              $8.000–$9.000 mensuales.
            </li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">Para Unipersonales</h3>
          <ul className="mb-4 ml-6 list-disc">
            <li>
              El aporte jubilatorio y el FRL dependen de la categoría que
              elijas, siendo el mínimo 11 BFC, que equivale a $4.073.
            </li>
            <li>
              El aporte a FONASA se calcula como tu remuneración * 0,7 * 0,45,
              considerando que no tengas hijos ni cónyuge.
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

          <table className="w-full mt-6 text-left table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300">
                  Actividad a facturar
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Lugar de producción del Software
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Exoneración IRAE / IRPF e IVA
                </th>
                <th className="px-4 py-2 border border-gray-300">IVA</th>
                <th className="px-4 py-2 border border-gray-300">Requisitos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  Uso, cesión de uso o venta de software propio
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Al menos una parte en Uruguay
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Parcialmente exonerada de IRAE (Coeficiente)
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Tasa 22% a las ventas locales. Sin IVA en caso de exportación.
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Registrar el activo (Ley de Propiedad Intelectual).
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  Desarrollo de software (no registrado por el desarrollador) y
                  servicios vinculados facturados a empresa local Forma
                  Jurídica: SAS, SA o SRL
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Más del 50% de los costos directos en el Uruguay
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  100% exonerada de IRAE.
                </td>
                <td className="px-4 py-2 border border-gray-300">Tasa 22%</td>
                <td className="px-4 py-2 border border-gray-300">
                  Factura electrónica con la adenda: Contribuyente 100%
                  exonerado de IRAE por el Art. 161 Bis inc ii del Decreto
                  150/007.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  Desarrollo de software (no registrado) y servicios vinculados
                  facturados al exterior y por Unipersonal.
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Realizado en Uruguay
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  100% exonerada de IRPF si el equipo informático lo aporta la
                  empresa del exterior.
                </td>
                <td className="px-4 py-2 border border-gray-300">Sin IVA</td>
                <td className="px-4 py-2 border border-gray-300">
                  Factura electrónica con la adenda: Contribuyente 100%
                  exonerado de IRPF por el literal K del Art. 34 del Decreto
                  148/007.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  Desarrollo de software (no registrado) y servicios vinculados
                  facturados al exterior y por Unipersonal.
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Realizado en Uruguay
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  100% exonerada de IRAE si el equipo informático NO lo aporta
                  la empresa del exterior.
                </td>
                <td className="px-4 py-2 border border-gray-300">Sin IVA</td>
                <td className="px-4 py-2 border border-gray-300">
                  Factura electrónica con la adenda: Contribuyente 100%
                  exonerado de IRAE por el Art. 163 bis del Decreto 150/007.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  Desarrollo de software (no registrado) y servicios vinculados
                  facturados al exterior y por Forma Jurídica: SAS, SA o SRL.
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Realizado en Uruguay
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  100% exonerada de IRAE
                </td>
                <td className="px-4 py-2 border border-gray-300">Sin IVA</td>
                <td className="px-4 py-2 border border-gray-300">
                  Factura electrónica con la adenda: Contribuyente 100%
                  exonerado de IRAE por el Art. 163 bis del Decreto 150/007.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  Desarrollo de software (no registrado) y servicios vinculados
                  facturados localmente y por Unipersonal.
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Realizado en Uruguay
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Sin exoneración IRPF
                </td>
                <td className="px-4 py-2 border border-gray-300">Tasa 22%</td>
                <td className="px-4 py-2 border border-gray-300">N/A</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-sm">
            <a
              className="text-sky-600"
              href="https://www.dbc.com.uy/post/novedades07032022"
            >
              Enlace a fuente (DB Consultora)
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Deducciones y exoneraciones importantes
          </h2>
          <p>
            Podés aplicar las siguientes deducciones en tu liquidación de
            impuestos:
          </p>
          <ul className="ml-6 list-disc">
            <li>20 BPC anuales por cada hijo menor de edad a cargo.</li>
            <li>40 BPC anuales por cada hijo con discapacidad a cargo.</li>
            <li>Aportes a BPS, FONASA, y fondos de solidaridad.</li>
            <li>
              Pagos de préstamos hipotecarios para una vivienda única y
              permanente (límite: 36 BPC al año).
            </li>
            <li>
              Aportes a la Caja de Profesionales Universitarios u otras cajas
              profesionales similares.
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
      </div>

      <Footer />
    </>
  );
}
