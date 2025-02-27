import { FormData } from "@/App";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ADDITIONAL_SOLIDARITY_FUND,
  BFC,
  BPC,
  CHILD_DEDUCTION,
  companyType,
  DEDUCTIONS_RATE_OVER_15BPC,
  DEDUCTIONS_RATE_UNDER_15BPC,
  DISABLED_CHILD_DEDUCTION,
  HEALTH_INSURANCE_OVER_25BPC,
  HEALTH_INSURANCE_UNDER_25BPC,
  IRPF_BRACKETS,
  LABOR_RETRAINING_CONTRIBUTION,
  RETIREMENT_CONTRIBUTIONS,
  TAXABLE_INCOME_INCREASE,
} from "./constants";
import { QuestionType } from "@/components/Question";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseWithDots = (value: number) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

type ParseBooleans<T> = {
  [K in keyof T]: T[K] extends "true" | "false" | undefined
    ? boolean | undefined
    : T[K];
};

export const parseBooleans = (data: FormData): ParseBooleans<FormData> => {
  const convertedEntries = Object.entries(data).map(([key, value]) => {
    if (value === "true") {
      return [key, true];
    } else if (value === "false") {
      return [key, false];
    } else return [key, value];
  });

  return Object.fromEntries(convertedEntries) as ParseBooleans<FormData>;
};

export const areAllQuestionsAnswered = (
  questions: QuestionType[],
  formValues: FormData
): boolean => {
  for (const question of questions) {
    const answer = formValues[question.question.value];

    if (answer === undefined || answer === null) {
      return false;
    }

    if (question.followups) {
      for (const followup of question.followups) {
        const shouldDisplay =
          (followup.condition === undefined ||
            String(followup.condition) === answer) &&
          (!followup.companyType ||
            followup.companyType === formValues.originCompanyType);

        if (shouldDisplay) {
          const followupAnswered = areAllQuestionsAnswered(
            [followup],
            formValues
          );
          if (!followupAnswered) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

/**
 * Calculates the gross salary for a contractor based on their net salary and applicable tax rates.
 *
 * This function computes the equivalent gross salary by factoring in various Uruguayan taxes
 * and contributions, including optional IRPF calculation based on family circumstances.
 *
 * @param  params.realCurrentSalary - The contractor's current net salary
 * @param  params.retirementTax - Retirement contribution tax amount
 * @param  params.fonasaTax - FONASA (healthcare) contribution tax amount
 * @param  params.frlTax - FRL (labor reconversion fund) contribution tax amount
 * @param  params.professionalCategory - Professional category contribution amount
 * @param  params.childsInChargeCount - Number of non-disabled children in charge
 * @param  params.disabledChildsInChargeCount - Number of disabled children in charge
 * @param  params.dependentsDeductionFactor - Deduction factor based on dependents
 * @param  params.addIrpf - Whether to include IRPF (income tax) calculations
 *
 * @returns The calculated gross salary required to achieve the specified net salary
 * after all applicable taxes and contributions
 * });
 */
const calculateContractorSalary = ({
  realCurrentSalary,
  retirementTax = 0,
  fonasaTax = 0,
  frlTax = 0,
  professionalCategory = 0,
  childsInChargeCount,
  disabledChildsInChargeCount,
  dependentsDeductionFactor,
  addIrpf = false,
}: {
  realCurrentSalary: number;
  retirementTax?: number;
  fonasaTax?: number;
  frlTax?: number;
  professionalCategory?: number;
  childsInChargeCount?: number;
  disabledChildsInChargeCount?: number;
  dependentsDeductionFactor?: number;
  addIrpf?: boolean;
}) => {
  const irpfTax = addIrpf
    ? calculateIrpfFromNetSalaryBS({
        netSalary: realCurrentSalary,
        retirementContributions: retirementTax,
        fonasaContributions: fonasaTax,
        frlContribution: frlTax,
        professionalFundContributions: professionalCategory,
        nonDisabledChildrenCount: childsInChargeCount,
        disabledChildrenCount: disabledChildsInChargeCount,
        dependentsDeductionFactor,
      })
    : 0;

  const taxPercentage =
    (retirementTax + fonasaTax + frlTax + irpfTax + professionalCategory) /
    realCurrentSalary;

  return realCurrentSalary / (1 - taxPercentage);
};

/**
 * Calculates the real monthly salary considering additional benefits like
 * 13th salary (aguinaldo) and holiday pay.
 *
 * @param salary - The base monthly salary amount
 * @returns The real monthly salary including all benefits, averaged over 12 months
 *
 * @remarks
 * This calculation assumes:
 * - A month has 30 days for daily rate calculation
 * - 20 days of paid holidays per year
 * - One extra month of salary (13th salary/aguinaldo)
 *
 * The formula used is: (salary * 13 + (salary/30 * 20)) / 12
 */
const calculateRealCurrentSalary = (salary: number) => {
  const dailyRate = salary / 30;
  const holidaySalary = dailyRate * 20; // 20 days of holidays
  const annualRealSalary = salary * 13 + holidaySalary; // 13th salary (aguinaldo)
  return annualRealSalary / 12;
};

/**
 * Calculates FONASA (Uruguayan health insurance contribution) based on the taxable amount and family situation.
 *
 * @param baseTaxableAmount - The base taxable amount to calculate FONASA contributions
 * @param hasChildsInCharge - Whether the person has dependent children
 * @param hasPartnerInCharge - Whether the person has a dependent spouse/partner
 *
 * @returns An object containing:
 *   - percentage: The calculated FONASA percentage based on family situation
 *   - value: The monetary value of the FONASA contribution (baseTaxableAmount × percentage)
 *
 * @remarks
 * The calculation applies different rates based on whether the base taxable amount
 * is greater than 2.5 BPC (Base de Prestaciones y Contribuciones), and adds
 * additional percentages for dependents (children and/or spouse).
 */
const calculateFonasa = (
  baseTaxableAmount: number,
  hasChildsInCharge?: boolean,
  hasPartnerInCharge?: boolean
) => {
  const greaterThan25BPC = baseTaxableAmount > 2.5 * BPC;
  let fonasaTaxPercent = greaterThan25BPC
    ? HEALTH_INSURANCE_OVER_25BPC.base
    : HEALTH_INSURANCE_UNDER_25BPC.base;

  if (hasChildsInCharge && hasPartnerInCharge)
    fonasaTaxPercent += greaterThan25BPC
      ? HEALTH_INSURANCE_OVER_25BPC.children +
        HEALTH_INSURANCE_OVER_25BPC.spouse
      : HEALTH_INSURANCE_UNDER_25BPC.children +
        HEALTH_INSURANCE_UNDER_25BPC.spouse;
  else if (hasChildsInCharge)
    fonasaTaxPercent += greaterThan25BPC
      ? HEALTH_INSURANCE_OVER_25BPC.children
      : HEALTH_INSURANCE_UNDER_25BPC.children;
  else if (hasPartnerInCharge)
    fonasaTaxPercent += greaterThan25BPC
      ? HEALTH_INSURANCE_OVER_25BPC.spouse
      : HEALTH_INSURANCE_UNDER_25BPC.spouse;

  return {
    percentage: fonasaTaxPercent,
    value: baseTaxableAmount * fonasaTaxPercent,
  };
};

/**
 * Calculates various tax contributions based on income and personal circumstances.
 *
 * @param options.socialSecurityValue - The base value for social security calculations
 * @param options.hasChildsInCharge - Whether the person has children in charge (affects FONASA tax)
 * @param options.hasPartnerInCharge - Whether the person has a partner in charge (affects FONASA tax)
 * @param options.fonasaBaseTaxableAmount - Optional custom base amount for FONASA tax calculation.
 *
 * @returns An object containing calculated tax values:
 *          - retirementTax: Retirement contribution amount
 *          - frlTax: Labor Retraining Fund (FRL) contribution amount
 *          - fonasaTax: National Health Fund (FONASA) contribution amount
 */
const calculateTaxes = ({
  socialSecurityValue,
  hasChildsInCharge,
  hasPartnerInCharge,
  fonasaBaseTaxableAmount,
}: {
  socialSecurityValue: number;
  hasChildsInCharge?: boolean;
  hasPartnerInCharge?: boolean;
  fonasaBaseTaxableAmount?: number;
}) => {
  const retirementTax = socialSecurityValue * RETIREMENT_CONTRIBUTIONS;
  const frlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
  const fonasaTax = calculateFonasa(
    fonasaBaseTaxableAmount ?? socialSecurityValue,
    hasChildsInCharge,
    hasPartnerInCharge
  );
  return { retirementTax, frlTax, fonasaTax };
};

/**
 * Calculates the contractor's salary based on various parameters from form data,
 * taking into account different calculation paths depending on company type,
 * professional status, and other factors.
 *
 * @param data.originCompanyType - The type of company of the contractor
 * @param data.currentSalary - The contractor's current salary
 * @param data.combinesCapitalAndWork - Whether the contractor combines capital and work
 * @param data.isProfessional - Whether the contractor is a professional
 * @param data.professionalCategory - The professional category of the contractor
 * @param data.socialSecurityCategory - The social security category of the contractor
 * @param data.hasChildsInCharge - Whether the contractor has children in charge
 * @param data.hasPartnerInCharge - Whether the contractor has a partner in charge
 * @param data.targetCompanyType - The type of company the contractor bills
 * @param data.childsInChargeCount - Number of children in charge
 * @param data.disabledChildsInChargeCount - Number of disabled children in charge
 * @param data.dependentsDeductionFactor - Factor for deducting dependents from calculation
 *
 * @returns The calculated salary based on the provided parameters and applicable rules.
 */
export const calculateSalaryForPath = (data: FormData) => {
  const {
    originCompanyType,
    currentSalary,
    combinesCapitalAndWork,
    isProfessional,
    professionalCategory,
    socialSecurityCategory,
    hasChildsInCharge,
    hasPartnerInCharge,
    targetCompanyType,
    childsInChargeCount,
    disabledChildsInChargeCount,
    dependentsDeductionFactor,
  } = parseBooleans(data);

  const realCurrentSalary = calculateRealCurrentSalary(currentSalary);

  if (isProfessional && professionalCategory) {
    return calculateContractorSalary({
      realCurrentSalary,
      professionalCategory,
      childsInChargeCount,
      disabledChildsInChargeCount,
      dependentsDeductionFactor,
      addIrpf:
        originCompanyType === companyType.unipersonal &&
        (combinesCapitalAndWork || targetCompanyType === "national"),
    });
  }

  if (originCompanyType === companyType.SAS) {
    const {
      retirementTax,
      frlTax,
      fonasaTax: { value: fonasaValue },
    } = calculateTaxes({
      socialSecurityValue: 15 * BFC,
      fonasaBaseTaxableAmount: 6.5 * BPC,
      hasChildsInCharge,
      hasPartnerInCharge,
    });
    return calculateContractorSalary({
      realCurrentSalary,
      retirementTax,
      fonasaTax: fonasaValue,
      frlTax,
    });
  }

  if (originCompanyType === companyType.unipersonal && socialSecurityCategory) {
    if (!combinesCapitalAndWork && targetCompanyType === "national") {
      return findGrossUnipersonalNoCapitalWorkNationalBS({
        desiredNet: realCurrentSalary,
        socialSecurityCategory,
        hasChildsInCharge,
        hasPartnerInCharge,
        childsInChargeCount,
        disabledChildsInChargeCount,
        dependentsDeductionFactor,
      });
    } else {
      const {
        retirementTax,
        frlTax,
        fonasaTax: { value: fonasaValue },
      } = calculateTaxes({
        socialSecurityValue: socialSecurityCategory,
        fonasaBaseTaxableAmount: 6.5 * BPC,
        hasChildsInCharge,
        hasPartnerInCharge,
      });
      return calculateContractorSalary({
        realCurrentSalary,
        retirementTax,
        fonasaTax: fonasaValue,
        frlTax,
        childsInChargeCount,
        disabledChildsInChargeCount,
        dependentsDeductionFactor,
        addIrpf: combinesCapitalAndWork || targetCompanyType === "national",
      });
    }
  }
};

/**
 * @param nominalSalary - Nominal salary.
 * @param dependentsDeductionFactor - Factor by which the deduction for dependents is multiplied.
 * @param nonDisabledChildrenCount - Number of children without disabilities.
 * @param disabledChildrenCount - Number of children with disabilities.
 * @param retirementContributions - Retirement contributions.
 * @param fonasaContributions - FONASA (healthcare) contributions.
 * @param frlContribution - FRL (labor retraining) contribution.
 * @param solidarityFundContributions - Amount of BPC contributed to the Solidarity Fund.
 * @param additionalSolidarityFund - True if additional Solidarity Fund contribution applies.
 * @param professionalFundContributions - Contributions to the Professional Fund.
 * @param otherDeductions - Other deductions.
 *
 * @returns - The total IRPF tax and the tax details for each bracket.
 */
export const calculateIRPF = ({
  nominalSalary,
  retirementContributions = 0,
  fonasaContributions = 0,
  frlContribution = 0,
  dependentsDeductionFactor = 0,
  nonDisabledChildrenCount = 0,
  disabledChildrenCount = 0,
  solidarityFundContributions = 0,
  additionalSolidarityFund = false,
  professionalFundContributions = 0,
  otherDeductions = 0,
}: {
  nominalSalary: number;
  retirementContributions?: number;
  fonasaContributions?: number;
  frlContribution?: number;
  dependentsDeductionFactor?: number;
  nonDisabledChildrenCount?: number;
  disabledChildrenCount?: number;
  solidarityFundContributions?: number;
  additionalSolidarityFund?: boolean;
  professionalFundContributions?: number;
  otherDeductions?: number;
}) => {
  const salaryInBPC = nominalSalary / BPC;
  let deductionsRate = null;
  if (salaryInBPC > 15) deductionsRate = DEDUCTIONS_RATE_OVER_15BPC;
  else deductionsRate = DEDUCTIONS_RATE_UNDER_15BPC;

  if (salaryInBPC > 10) nominalSalary *= 1 + TAXABLE_INCOME_INCREASE;

  const childDeductions =
    dependentsDeductionFactor *
    (nonDisabledChildrenCount * CHILD_DEDUCTION +
      disabledChildrenCount * DISABLED_CHILD_DEDUCTION);

  const additionalSolidarityFundAmount = additionalSolidarityFund
    ? ADDITIONAL_SOLIDARITY_FUND
    : 0;

  const deductions =
    childDeductions +
    retirementContributions +
    fonasaContributions +
    frlContribution +
    (solidarityFundContributions * BPC) / 12 +
    additionalSolidarityFundAmount +
    professionalFundContributions +
    otherDeductions;

  const taxDetails: {
    bracketTax: number[];
    deductions: number;
    deductionsRate: number;
  } = { bracketTax: [], deductions, deductionsRate };

  IRPF_BRACKETS.forEach(
    (bracket: { from: number; to: number; rate: number }) => {
      const to = bracket.to !== 0 ? bracket.to : 999;
      if (nominalSalary > bracket.from * BPC) {
        const tax =
          (Math.min(to * BPC, nominalSalary) - bracket.from * BPC) *
          bracket.rate;

        taxDetails.bracketTax.push(tax);
      } else {
        taxDetails.bracketTax.push(0);
      }
    }
  );

  const totalIRPF = Math.max(
    0,
    taxDetails.bracketTax.reduce((a, b) => a + b, 0) -
      deductions * deductionsRate
  );

  return { taxDetails, totalIRPF };
};

/**
 * @param netSalary - Desired net salary after taxes.
 * @param dependentsDeductionFactor - Factor for deductions based on dependents.
 * @param nonDisabledChildrenCount - Number of children without disabilities.
 * @param disabledChildrenCount - Number of children with disabilities.
 * @param retirementContributions - Retirement contributions.
 * @param fonasaContributions - FONASA contributions.
 * @param frlContribution - FRL contributions.
 * @param solidarityFundContributions - Contributions to the Solidarity Fund (BPC).
 * @param additionalSolidarityFund - Whether additional contributions to the Solidarity Fund apply.
 * @param professionalFundContributions - Contributions to the Professional Fund.
 * @param otherDeductions - Other deductions.
 *
 * @returns - The gross salary (before taxes) that corresponds to the given net salary.
 */
export const calculateIrpfFromNetSalaryBS = ({
  netSalary,
  retirementContributions,
  fonasaContributions,
  frlContribution,
  professionalFundContributions,
  solidarityFundContributions,
  additionalSolidarityFund,
  dependentsDeductionFactor,
  nonDisabledChildrenCount,
  disabledChildrenCount,
  otherDeductions,
}: {
  netSalary: number;
  retirementContributions?: number;
  fonasaContributions?: number;
  frlContribution?: number;
  professionalFundContributions?: number;
  solidarityFundContributions?: number;
  additionalSolidarityFund?: boolean;
  dependentsDeductionFactor?: number;
  nonDisabledChildrenCount?: number;
  disabledChildrenCount?: number;
  otherDeductions?: number;
}) => {
  const TOLERANCE = 0.1;
  let lowerBound = netSalary;
  let upperBound = netSalary * 2;
  let estimatedGrossSalary = (lowerBound + upperBound) / 2;
  let calculatedIrpf = 0;

  while (upperBound - lowerBound > TOLERANCE) {
    const { totalIRPF } = calculateIRPF({
      nominalSalary: estimatedGrossSalary,
      dependentsDeductionFactor,
      nonDisabledChildrenCount,
      disabledChildrenCount,
      retirementContributions,
      fonasaContributions,
      frlContribution,
      solidarityFundContributions,
      additionalSolidarityFund,
      professionalFundContributions,
      otherDeductions,
    });

    const calculatedNetSalary =
      estimatedGrossSalary -
      totalIRPF -
      (retirementContributions || 0) -
      (fonasaContributions || 0) -
      (frlContribution || 0);

    if (calculatedNetSalary < netSalary) lowerBound = estimatedGrossSalary;
    else upperBound = estimatedGrossSalary;
    calculatedIrpf = totalIRPF;
    estimatedGrossSalary = (lowerBound + upperBound) / 2;
  }

  return calculatedIrpf;
};

/**
 * Calculates the gross amount required to achieve a desired net amount for a unipersonal entity which
 * does not combine capital and work and bills a national company using binary search algorithm.
 *
 * This function iteratively narrows down the possible gross value that would result in the specified net amount
 * using the computeNetUnipersonalNoCapitalWorkNational function.
 *
 * @param params.desiredNet - The target net amount to achieve
 * @param params.socialSecurityCategory - The social security category of the individual
 * @param params.hasChildsInCharge - Whether the individual has children in charge
 * @param params.hasPartnerInCharge - Whether the individual has a partner in charge
 *
 * @returns The gross amount that will result in the desired net amount (with tolerance of 0.1)
 * });
 */
function findGrossUnipersonalNoCapitalWorkNationalBS({
  desiredNet,
  socialSecurityCategory,
  hasChildsInCharge,
  hasPartnerInCharge,
  childsInChargeCount,
  disabledChildsInChargeCount,
  dependentsDeductionFactor,
}: {
  desiredNet: number;
  socialSecurityCategory: number;
  hasChildsInCharge?: boolean;
  hasPartnerInCharge?: boolean;
  childsInChargeCount?: number;
  disabledChildsInChargeCount?: number;
  dependentsDeductionFactor?: number;
}) {
  let lower = 0;
  let upper = 100000000;
  const TOLERANCE = 0.1;

  while (upper - lower > TOLERANCE) {
    const mid = (lower + upper) / 2;
    const net = computeNetUnipersonalNoCapitalWorkNational({
      gross: mid,
      socialSecurityCategory,
      hasChildsInCharge,
      hasPartnerInCharge,
      childsInChargeCount,
      disabledChildsInChargeCount,
      dependentsDeductionFactor,
    });

    if (net < desiredNet) lower = mid;
    else upper = mid;
  }

  return (lower + upper) / 2;
}

/**
 * Calculates the net income for a unipersonal entity which does not combine capital and work and
 * bills a national company by deducting all applicable taxes and contributions from the gross amount.
 *
 * @param params.gross - The gross amount (before taxes)
 * @param params.socialSecurityCategory - The social security category value used to calculate contributions
 * @param params.hasChildsInCharge - Whether the person has children in charge, affects FONASA rate
 * @param params.hasPartnerInCharge - Whether the person has a partner in charge, affects FONASA rate
 *
 * @returns  The net income after deducting retirement tax, labor retraining contribution,
 *                   FONASA (healthcare) tax, and IRPF (income tax)
 */
function computeNetUnipersonalNoCapitalWorkNational({
  gross,
  socialSecurityCategory,
  hasChildsInCharge,
  hasPartnerInCharge,
  childsInChargeCount,
  disabledChildsInChargeCount,
  dependentsDeductionFactor,
}: {
  gross: number;
  socialSecurityCategory: number;
  hasChildsInCharge?: boolean;
  hasPartnerInCharge?: boolean;
  childsInChargeCount?: number;
  disabledChildsInChargeCount?: number;
  dependentsDeductionFactor?: number;
}) {
  const retirementTax = socialSecurityCategory * RETIREMENT_CONTRIBUTIONS;

  const frlTax = socialSecurityCategory * LABOR_RETRAINING_CONTRIBUTION;

  const fonasaBase = 0.7 * gross;
  const fonasaRate = calculateFonasa(
    fonasaBase,
    hasChildsInCharge,
    hasPartnerInCharge
  );
  const fonasaTax = fonasaBase * fonasaRate.percentage;

  const { totalIRPF } = calculateIRPF({
    nominalSalary: gross,
    retirementContributions: retirementTax,
    fonasaContributions: fonasaTax,
    frlContribution: frlTax,
    dependentsDeductionFactor,
    nonDisabledChildrenCount: childsInChargeCount,
    disabledChildrenCount: disabledChildsInChargeCount,
  });

  return gross - (retirementTax + frlTax + fonasaTax + totalIRPF);
}
