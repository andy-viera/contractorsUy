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
 * IRPF tax brackets.
 *  - 'from' and 'to' are the BPC values that define the bracket range.
 *
 *    The 'from' value is included in the bracket, the 'to' value is not.
 *
 *    The last bracket has a value of 0 in 'to'.
 *  - 'rate' is the tax percentage.
 */
const IRPF_FRANJAS = [
  { from: 0, to: 7, rate: 0 },
  { from: 7, to: 10, rate: 0.1 },
  { from: 10, to: 15, rate: 0.15 },
  { from: 15, to: 30, rate: 0.24 },
  { from: 30, to: 50, rate: 0.25 },
  { from: 50, to: 75, rate: 0.27 },
  { from: 75, to: 115, rate: 0.31 },
  { from: 115, to: 0, rate: 0.36 },
];

/**
 * Retirement contributions percentage (personal and employer).
 */
const RETIREMENT_CONTRIBUTIONS = 0.225;

/**
 * Maximum nominal salary on which retirement contributions apply.
 */
const RETIREMENT_CONTRIBUTIONS_CAP = 236309;

/**
 * FONASA contributions percentage for people with salary up to 2.5 BPC.
 */
const HEALTH_INSURANCE_UNDER_25BPC = { base: 3, spouse: 2, children: 0 };

/**
 * FONASA contributions percentage for people with salary above 2.5 BPC.
 */
const HEALTH_INSURANCE_OVER_25BPC = { base: 4.5, spouse: 2, children: 1.5 };

/**
 * FRL contribution percentage.
 */
const LABOR_RETRAINING_CONTRIBUTION = 0.01;

/**
 * AFAP contribution cap.
 */
const PENSION_FUND_CAP = 236309;

/**
 * Percentage increase in taxable income that applies if computable income is greater than 10 BPC.
 */
const TAXABLE_INCOME_INCREASE = 0.06;

/**
 * IRPF deduction percentage for people with salary up to 15 BPC.
 */
const DEDUCTIONS_RATE_UNDER_15BPC = 0.14;

/**
 * IRPF deduction percentage for people with salary from 15 BPC.
 */
const DEDUCTIONS_RATE_OVER_15BPC = 0.08;

/**
 * Amount deducted from IRPF for each child without disability.
 */
const CHILD_DEDUCTION = (20 * BPC) / 12;

/**
 * Amount deducted from IRPF for each child with disability.
 */
const DISABLED_CHILD_DEDUCTION = (40 * BPC) / 12;

/**
 * Additional solidarity fund contribution that must be paid for careers with duration equal to or greater than five years.
 */
const ADDITIONAL_SOLIDARITY_FUND = ((5 / 4) * BPC) / 12;

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
  RETIREMENT_CONTRIBUTIONS,
  RETIREMENT_CONTRIBUTIONS_CAP,
  HEALTH_INSURANCE_UNDER_25BPC,
  HEALTH_INSURANCE_OVER_25BPC,
  LABOR_RETRAINING_CONTRIBUTION,
  PENSION_FUND_CAP,
  TAXABLE_INCOME_INCREASE,
  DEDUCTIONS_RATE_UNDER_15BPC,
  DEDUCTIONS_RATE_OVER_15BPC,
  CHILD_DEDUCTION,
  DISABLED_CHILD_DEDUCTION,
  ADDITIONAL_SOLIDARITY_FUND,
};
