import { QuestionType } from "../components/Question";
import { companyType } from "./types";
import { parseWithDots } from "./utils";

/**
 * BPC value.
 */
const BPC = 6576.0;

/**
 * BFC value.
 */
const BFC = 1744.4;

/**
 * CPE value.
 */
const CPE = 4737.0;

/**
 * Dolar-Uyu rate.
 */
const DOLAR_UYU_RATE = 41.0;

/**
 * Last time BPC and BFC values where automatically updated.
 */
const LAST_UPDATE = 2025;

/**
 * IRPF tax brackets.
 *  - 'from' and 'to' are the BPC values that define the bracket range.
 *
 *    The 'from' value is included in the bracket, the 'to' value is not.
 *
 *    The last bracket has a value of 0 in 'to'.
 *  - 'rate' is the tax percentage.
 */
const IRPF_BRACKETS = [
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
 * Base amount for SAS retirement contributions.
 */
const SAS_RETIREMENT_CONTRIBUTIONS_BASE = 15 * BFC;

/**
 * Base amount for FONASA contribution calculation for SAS.
 */
const SAS_FONASA_BASE = 6.5 * BPC;

/**
 * Maximum nominal salary on which retirement contributions apply.
 */
const RETIREMENT_CONTRIBUTIONS_CAP = 272564.0;

/**
 * FONASA contributions percentage for people with salary up to 2.5 BPC.
 */
const HEALTH_INSURANCE_UNDER_25BPC = { base: 0.08, spouse: 0.02, children: 0 };

/**
 * FONASA contributions percentage for people with salary above 2.5 BPC.
 */
const HEALTH_INSURANCE_OVER_25BPC = {
  base: 0.095,
  spouse: 0.02,
  children: 0.015,
};

/**
 * FRL contribution percentage.
 */
const LABOR_RETRAINING_CONTRIBUTION = 0.001;

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
const ADDITIONAL_SOLIDARITY_FUND = ((5 / 6) * BPC) / 12;

const MINIMUM_WAGE = 23604.0;

const PROFESSIONAL_CATEGORIES = [
  { label: "1ra. Especial", value: 3241 },
  { label: "1ra.", value: 6447 },
  { label: "2da.", value: 12196 },
  { label: "3ra.", value: 17282 },
  { label: "4ta.", value: 21679 },
  { label: "5ta.", value: 25383 },
  { label: "6ta.", value: 28434 },
  { label: "7ma.", value: 30822 },
  { label: "8va.", value: 32506 },
  { label: "9na.", value: 33527 },
  { label: "10ma.", value: 33855 },
];

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
            options: PROFESSIONAL_CATEGORIES,
          },
          {
            condition: "true",
            question: {
              label: "Aporte a el fondo de solidaridad",
              value: "solidarityFundContribution",
            },
            type: "select",
            defaultValue: 0,
            options: [
              {
                label: `1/2 BPC (U$ ${parseWithDots(0.5 * BPC)})`,
                value: 0.5 * BPC,
              },
              {
                label: `1 BPC (U$ ${parseWithDots(BPC)})`,
                value: BPC,
              },
              {
                label: `2 BPC (U$ ${parseWithDots(2 * BPC)})`,
                value: 2 * BPC,
              },
              {
                label: "Ninguno",
                value: 0,
              },
            ],
            followups: [
              {
                condition: [0.5 * BPC, BPC, 2 * BPC],
                question: {
                  label: "Aporte adicional (carreras de 5 años o más)",
                  value: "appliesSolidarityFundAditional",
                },
                type: "radio",
                options: [
                  { label: "Si", value: "true" },
                  { label: "No", value: "false" },
                ],
              },
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
            followups: [
              {
                condition: "true",
                question: {
                  label: "¿Cuántos hijos sin discapacidad tenés a cargo?",
                  value: "childsInChargeCount",
                },
                type: "number",
              },
              {
                condition: "true",
                question: {
                  label: "¿Cuántos hijos con discapacidad tenés a cargo?",
                  value: "disabledChildsInChargeCount",
                },
                type: "number",
              },
              {
                condition: "true",
                question: {
                  label: "Porcentaje de deducción de las personas a cargo",
                  value: "dependentsDeductionFactor",
                },
                type: "select",
                options: [
                  { label: "0%", value: 0 },
                  { label: "50%", value: 0.5 },
                  { label: "100%", value: 1 },
                ],
              },
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
              { label: "11 BFC", value: 11 * BFC },
              { label: "15 BFC", value: 15 * BFC },
              { label: "20 BFC", value: 20 * BFC },
              { label: "25 BFC", value: 25 * BFC },
              { label: "30 BFC", value: 30 * BFC },
              { label: "36 BFC", value: 36 * BFC },
              { label: "42 BFC", value: 42 * BFC },
              { label: "48 BFC", value: 48 * BFC },
              { label: "54 BFC", value: 54 * BFC },
              { label: "60 BFC", value: 60 * BFC },
            ],
          },
        ],
      },
      {
        question: {
          label:
            "¿Cuál es tu sueldo líquido actual (mensual, sin incluir aguinaldo ni salario vacacional)?",
          value: "currentSalary",
        },
        type: "salary",
      },
    ],
  },
];

export {
  INITIAL_INPUTS,
  BPC,
  BFC,
  CPE,
  LAST_UPDATE,
  IRPF_BRACKETS,
  SAS_RETIREMENT_CONTRIBUTIONS_BASE,
  SAS_FONASA_BASE,
  RETIREMENT_CONTRIBUTIONS,
  RETIREMENT_CONTRIBUTIONS_CAP,
  HEALTH_INSURANCE_UNDER_25BPC,
  HEALTH_INSURANCE_OVER_25BPC,
  LABOR_RETRAINING_CONTRIBUTION,
  TAXABLE_INCOME_INCREASE,
  DEDUCTIONS_RATE_UNDER_15BPC,
  DEDUCTIONS_RATE_OVER_15BPC,
  CHILD_DEDUCTION,
  DISABLED_CHILD_DEDUCTION,
  ADDITIONAL_SOLIDARITY_FUND,
  MINIMUM_WAGE,
  DOLAR_UYU_RATE,
};
