import { QuestionType } from "../components/Question";

export enum companyType {
  unipersonal = "unipersonal",
  SAS = "SAS",
}

/**
 * BPC value 2025.
 */
const BPC = 6576;

/**
 * BFC value 2025.
 */
const BFC = 1744.4;

/**
 * Franjas de IPRF.
 *  - 'desde' y 'hasta' son los valores en BPC en los que está comprendida la franja.
 *
 *    El valor de 'desde' está dentro de la franja, el de 'hasta' no.
 *
 *    La última franja tiene valor 0 en "hasta".
 *  - 'tasa' es el porcentaje del impuesto.
 */
const IRPF_FRANJAS = [
  { desde: 0, hasta: 7, tasa: 0 },
  { desde: 7, hasta: 10, tasa: 0.1 },
  { desde: 10, hasta: 15, tasa: 0.15 },
  { desde: 15, hasta: 30, tasa: 0.24 },
  { desde: 30, hasta: 50, tasa: 0.25 },
  { desde: 50, hasta: 75, tasa: 0.27 },
  { desde: 75, hasta: 115, tasa: 0.31 },
  { desde: 115, hasta: 0, tasa: 0.36 },
];

/**
 * Porcentaje de aportes jubilatorios.
 */
const APORTES_JUBILATORIOS = 15;

/**
 * Maximo del salario nominal sobre el cual aplican los aportes jubilatorios.
 */
const TOPE_APORTES_JUBILATORIOS = 236309;

/**
 * Porcentaje de aportes FONASA para personas con salario hasta a 2.5 BPC.
 */
const APORTES_FONASA_HASTA25BPC = { base: 3, conyuge: 2, hijos: 0 };
/**
 * Porcentaje de aportes FONASA para personas con salario mayor a 2.5 BPC.
 */
const APORTES_FONASA_DESDE25BPC = { base: 4.5, conyuge: 2, hijos: 1.5 };

/**
 * Porcentaje de aporte FRL.
 */
const APORTE_FRL = 0.1;

/**
 * Tope AFAP.
 */
const TOPE_AFAP = 236309;

/**
 * Porcentaje de incremento de ingresos gravados que aplica si la renta computable es mayor a 10 BPC.
 */
const INCREMENTO_INGRESOS_GRAVADOS = 0.06;

/**
 * Porcentaje de deducciones de IRPF para personas con salario hasta 15 BPC.
 */
const TASA_DEDUCCIONES_HASTA15BPC = 0.1;
/**
 * Porcentaje de deducciones de IRPF para personas con salario desde 15 BPC.
 */
const TASA_DEDUCCIONES_DESDE15BPC = 0.08;

/**
 * Cantidad deducida del IRPF por cada hijo sin discapacidad.
 */
const DEDUCCION_HIJO_SIN_DISCAPACIDAD = (20 * BPC) / 12;
/**
 * Cantidad deducida del IRPF por cada hijo con discapacidad.
 */
const DEDUCCION_HIJO_CON_DISCAPACIDAD = (40 * BPC) / 12;

/**
 * Adicional al fondo de solidaridad que debe pagarse en carreras de duracion igual o mayor
 * a cinco años.
 */
const ADICIONAL_FONDO_SOLIDARIDAD = ((5 / 4) * BPC) / 12;

// TODO:Fix type in order to specifically type each option value correctly
const INITIAL_INPUTS: QuestionType[] = [
  {
    question: {
      label: "¿Qué tipo de empresa querés abrir?",
      value: "originCompanyType",
    },
    options: [
      { label: "Unipersonal", value: companyType.unipersonal },
      {
        label: "SAS (Sociedad por acciones simplificada)",
        value: companyType.SAS,
      },
    ],
    type: "radio",
    followups: [
      {
        question: {
          label: "¿Facturás al exterior o a una empresa nacional?",
          value: "targetCompanyType",
        },
        options: [
          { label: "Empresa extranjera", value: "foreign" },
          { label: "Empresa nacional", value: "national" },
        ],
        type: "radio",
        followups: [
          {
            condition: "foreign",
            companyType: companyType.unipersonal,
            question: {
              label:
                "¿Combinás capital y trabajo? (Responde si, si NO te dan la computadora con la que trabajás)",
              value: "combinesCapitalAndWork",
            },
            type: "radio",
            options: [
              { label: "Sí", value: "true" },
              { label: "No", value: "false" },
            ],
          },
        ],
      },
      {
        question: {
          label: "¿Sos profesional?",
          value: "isProfessional",
        },
        options: [
          { label: "Sí", value: "true" },
          { label: "No", value: "false" },
        ],
        type: "radio",
        followups: [
          {
            condition: "true",
            question: {
              label:
                "¿En que categoría de la escala de la caja de profesionales estás?",
              value: "professionalCategory",
            },
            type: "select",
            options: [
              { label: "1ra. Especial", value: 3054 },
              { label: "1ra.", value: 6075 },
              { label: "2da.", value: 11491 },
              { label: "3ra.", value: 16285 },
              { label: "4ta.", value: 20427 },
              { label: "5ta.", value: 23918 },
              { label: "6ta.", value: 26792 },
              { label: "7ma.", value: 29041 },
              { label: "8va.", value: 30628 },
              { label: "9na.", value: 31591 },
              { label: "10ma.", value: 31900 },
            ],
          },
          {
            condition: "false",
            question: {
              label: "¿Tenés hijos a cargo?",
              value: "hasChildsInCharge",
            },
            type: "radio",
            options: [
              { label: "Si", value: "true" },
              { label: "No", value: "false" },
            ],
          },
          {
            condition: "false",
            question: {
              label: "¿Tenés cónyuge a cargo?",
              value: "hasPartnerInCharge",
            },
            type: "radio",
            options: [
              { label: "Si", value: "true" },
              { label: "No", value: "false" },
            ],
          },
          {
            condition: "false",
            companyType: companyType.unipersonal,
            question: {
              label: "Seleccioná categoría de ficto",
              value: "socialSecurityCategory",
            },
            type: "select",
            options: [
              { label: "11 BFC", value: 4337 },
              { label: "15 BFC", value: 5914 },
              { label: "20 BFC", value: 7885 },
              { label: "25 BFC", value: 9856 },
              { label: "30 BFC", value: 11827 },
              { label: "36 BFC", value: 14192 },
            ],
          },
        ],
      },
      {
        question: {
          label:
            "¿Cuál es tu sueldo líquido actual (sin incluir aguinaldo ni salario vacacional)?",
          value: "currentSalary",
        },
        type: "number",
      },
    ],
  },
];

export {
  INITIAL_INPUTS,
  BPC,
  BFC,
  IRPF_FRANJAS,
  APORTES_JUBILATORIOS,
  TOPE_APORTES_JUBILATORIOS,
  APORTES_FONASA_HASTA25BPC,
  APORTES_FONASA_DESDE25BPC,
  APORTE_FRL,
  TOPE_AFAP,
  INCREMENTO_INGRESOS_GRAVADOS,
  ADICIONAL_FONDO_SOLIDARIDAD,
  TASA_DEDUCCIONES_DESDE15BPC,
  TASA_DEDUCCIONES_HASTA15BPC,
  DEDUCCION_HIJO_SIN_DISCAPACIDAD,
  DEDUCCION_HIJO_CON_DISCAPACIDAD,
};
