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

export const parseWithDots = (value: number) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const calculateContractorSalary = ({
  realCurrentSalary,
  retirementTax = 0,
  fonasaTax = 0,
  frlTax = 0,
  professionalCategory = 0,
  addIrpf = false,
}: {
  realCurrentSalary: number;
  retirementTax?: number;
  fonasaTax?: number;
  frlTax?: number;
  professionalCategory?: number;
  addIrpf?: boolean;
}) => {
  const irpfTax = addIrpf
    ? calculateIrpfFromNetSalaryBS(
        realCurrentSalary,
        retirementTax,
        fonasaTax,
        frlTax,
        professionalCategory
      )
    : 0;

  const taxPercentage =
    (retirementTax + fonasaTax + frlTax + irpfTax + professionalCategory) /
    realCurrentSalary;

  console.log(
    fonasaTax,
    retirementTax,
    frlTax,
    irpfTax,
    professionalCategory,
    realCurrentSalary,
    taxPercentage
  );

  return realCurrentSalary / (1 - taxPercentage);
};

const calculateRealCurrentSalary = (salary: number) => {
  const dailyRate = salary / 30;
  const holidaySalary = dailyRate * 20; // 20 days of holidays
  const annualRealSalary = salary * 13 + holidaySalary; // 13th salary (aguinaldo)
  return annualRealSalary / 12;
};

const calculateFonasa = (
  baseTaxableAmount: number,
  hasChildsInCharge?: boolean,
  hasPartnerInCharge?: boolean
) => {
  const greaterThan25BPC = baseTaxableAmount > 2.5 * BPC;
  let fonasaTaxPercent = greaterThan25BPC
    ? HEALTH_INSURANCE_OVER_25BPC.base
    : HEALTH_INSURANCE_UNDER_25BPC.base;
  console.log(baseTaxableAmount, "test");

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

  console.log(fonasaTaxPercent);

  return {
    percentage: fonasaTaxPercent,
    value: baseTaxableAmount * fonasaTaxPercent,
  };
};

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
  } = parseBooleans(data);

  const realCurrentSalary = calculateRealCurrentSalary(currentSalary);

  if (isProfessional && professionalCategory) {
    return calculateContractorSalary({
      realCurrentSalary,
      professionalCategory,
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
      return findGrossUnipersonalNoCapitalWorkNational({
        desiredNet: realCurrentSalary,
        socialSecurityCategory,
        hasChildsInCharge,
        hasPartnerInCharge,
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
 * @returns {number} - The gross salary (before taxes) that corresponds to the given net salary.
 */
export const calculateIrpfFromNetSalaryBS = (
  netSalary: number,
  retirementContributions?: number,
  fonasaContributions?: number,
  frlContribution?: number,
  professionalFundContributions?: number,
  solidarityFundContributions?: number,
  additionalSolidarityFund?: boolean,
  dependentsDeductionFactor?: number,
  nonDisabledChildrenCount?: number,
  disabledChildrenCount?: number,
  otherDeductions?: number
) => {
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
    console.log(calculatedNetSalary, "calculatedNetSalary");
    estimatedGrossSalary = (lowerBound + upperBound) / 2;
  }

  return calculatedIrpf;
};

function computeNetUnipersonalNoCapitalWorkNationalBS({
  gross,
  socialSecurityCategory,
  hasChildsInCharge,
  hasPartnerInCharge,
}: {
  gross: number;
  socialSecurityCategory: number;
  hasChildsInCharge?: boolean;
  hasPartnerInCharge?: boolean;
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
  });

  return gross - (retirementTax + frlTax + fonasaTax + totalIRPF);
}

function findGrossUnipersonalNoCapitalWorkNational({
  desiredNet,
  socialSecurityCategory,
  hasChildsInCharge,
  hasPartnerInCharge,
}: {
  desiredNet: number;
  socialSecurityCategory: number;
  hasChildsInCharge?: boolean;
  hasPartnerInCharge?: boolean;
}) {
  let lower = 0;
  let upper = 100000000;
  const TOLERANCE = 0.1;

  while (upper - lower > TOLERANCE) {
    const mid = (lower + upper) / 2;
    const net = computeNetUnipersonalNoCapitalWorkNationalBS({
      gross: mid,
      socialSecurityCategory,
      hasChildsInCharge,
      hasPartnerInCharge,
    });
    console.log(net, "net", desiredNet, "desiredNet");

    if (net < desiredNet) lower = mid;
    else upper = mid;
  }

  return (lower + upper) / 2;
}

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
