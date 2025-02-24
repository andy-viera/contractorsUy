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
  IRPF_FRANJAS,
  LABOR_RETRAINING_CONTRIBUTION,
  RETIREMENT_CONTRIBUTIONS,
  TAXABLE_INCOME_INCREASE,
} from "./constants";

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
    ? calculateIrpfFromNetSalary(
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

  return baseTaxableAmount * fonasaTaxPercent;
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
    const { retirementTax, frlTax, fonasaTax } = calculateTaxes({
      socialSecurityValue: 15 * BFC,
      fonasaBaseTaxableAmount: 6.5 * BPC,
      hasChildsInCharge,
      hasPartnerInCharge,
    });
    return calculateContractorSalary({
      realCurrentSalary,
      retirementTax,
      fonasaTax,
      frlTax,
    });
  }

  if (originCompanyType === companyType.unipersonal && socialSecurityCategory) {
    const { retirementTax, frlTax, fonasaTax } = calculateTaxes({
      socialSecurityValue: socialSecurityCategory,
      hasChildsInCharge,
      hasPartnerInCharge,
    });
    return calculateContractorSalary({
      realCurrentSalary,
      retirementTax,
      fonasaTax,
      frlTax,
      addIrpf: combinesCapitalAndWork || targetCompanyType === "national",
    });
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

  IRPF_FRANJAS.forEach(
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
export const calculateIrpfFromNetSalary = (
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
  const TOLERANCE = 0.01;
  let lowerBound = netSalary;
  let upperBound = netSalary * 2;
  let estimatedGrossSalary = (lowerBound + upperBound) / 2;

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

    estimatedGrossSalary = (lowerBound + upperBound) / 2;
  }

  return estimatedGrossSalary - netSalary;
};

export const parseWithDots = (value: number) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
