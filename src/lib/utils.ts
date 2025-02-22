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
  IRPF_FRANJAS,
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
  const grossSalary = addIrpf
    ? calcularSalarioBrutoDesdeNeto(
        realCurrentSalary,
        retirementTax,
        fonasaTax,
        frlTax,
        professionalCategory
      )
    : 0;

  const taxPercentage =
    (retirementTax + fonasaTax + frlTax + professionalCategory) /
    realCurrentSalary;

  return addIrpf ? grossSalary : realCurrentSalary / (1 - taxPercentage);
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
  let fonasaTax = baseTaxableAmount * 0.095;

  if (hasChildsInCharge && hasPartnerInCharge)
    fonasaTax = baseTaxableAmount * 0.13;
  else if (hasChildsInCharge) fonasaTax = baseTaxableAmount * 0.11;
  else if (hasPartnerInCharge) fonasaTax = baseTaxableAmount * 0.115;

  return fonasaTax;
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
  const retirementTax = socialSecurityValue * 0.225;
  const frlTax = socialSecurityValue * 0.001;
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
 * @param salarioNominal - Salario nominal.
 * @param factorDeduccionPersonasACargo - Factor por el que se multiplica la deduccion correspondiente a
 *   las personas a cargo.
 * @param cantHijosSinDiscapacidad - Cantida de hijos sin discapacidad.
 * @param cantHijosConDiscapacidad - Cantida de hijos con discapacidad.
 * @param aportesJubilatorios - Aportes jubilatorios.
 * @param aportesFONASA - Aportes FONASA.
 * @param aporteFRL - Aporte FRL.
 * @param aportesFondoSolidaridad - Cantidad de BPC que se aportan al Fondo de Solidaridad.
 * @param adicionalFondoSolidaridad - True si corresponde aportar adicional al Fondo de Solidaridad.
 * @param aportesCJPPU - Aportes a la Caja de Profesionales Universitarios.
 * @param otrasDeducciones - Otras deducciones.
 *
 * @returns {ImpuestoIRPF} - El monto total de IRPF y los detalles de las distintas franjas y deducciones.
 */
export const calcularIRPF = ({
  salarioNominal,
  aportesJubilatorios = 0,
  aportesFONASA = 0,
  aporteFRL = 0,
  factorDeduccionPersonasACargo = 0,
  cantHijosSinDiscapacidad = 0,
  cantHijosConDiscapacidad = 0,
  aportesFondoSolidaridad = 0,
  adicionalFondoSolidaridad = false,
  aportesCJPPU = 0,
  otrasDeducciones = 0,
}: {
  salarioNominal: number;
  aportesJubilatorios?: number;
  aportesFONASA?: number;
  aporteFRL?: number;
  factorDeduccionPersonasACargo?: number;
  cantHijosSinDiscapacidad?: number;
  cantHijosConDiscapacidad?: number;
  aportesFondoSolidaridad?: number;
  adicionalFondoSolidaridad?: boolean;
  aportesCJPPU?: number;
  otrasDeducciones?: number;
}) => {
  const salarioEnBPC = salarioNominal / BPC;
  let tasaDeducciones = null;
  if (salarioEnBPC > 15) tasaDeducciones = DEDUCTIONS_RATE_OVER_15BPC;
  else tasaDeducciones = DEDUCTIONS_RATE_UNDER_15BPC;

  // Calcular si hay que aplicar el aumento a ingresos gravados Seguridad Social
  if (salarioEnBPC > 10) salarioNominal *= 1 + TAXABLE_INCOME_INCREASE;

  // Cantidad deducida del IRPF por los hijos
  const deduccionesHijos =
    factorDeduccionPersonasACargo *
    (cantHijosSinDiscapacidad * CHILD_DEDUCTION +
      cantHijosConDiscapacidad * DISABLED_CHILD_DEDUCTION);

  const aporteAdicionalFondoSolidaridad = adicionalFondoSolidaridad
    ? ADDITIONAL_SOLIDARITY_FUND
    : 0;

  const deducciones =
    deduccionesHijos +
    aportesJubilatorios +
    aportesFONASA +
    aporteFRL +
    (aportesFondoSolidaridad * BPC) / 12 +
    aporteAdicionalFondoSolidaridad +
    aportesCJPPU +
    otrasDeducciones;

  // Cantidad de impuesto de IRPF de cada franja
  const detalleIRPF: {
    impuestoFranja: number[];
    deducciones: number;
    tasaDeducciones: number;
  } = { impuestoFranja: [], deducciones, tasaDeducciones };

  IRPF_FRANJAS.forEach((franja: { from: number; to: number; rate: number }) => {
    const to = franja.to !== 0 ? franja.to : 999;
    if (salarioNominal > franja.from * BPC) {
      const impuesto =
        (Math.min(to * BPC, salarioNominal) - franja.from * BPC) * franja.rate;

      detalleIRPF.impuestoFranja.push(impuesto);
    } else {
      detalleIRPF.impuestoFranja.push(0);
    }
  });

  const totalIRPF = Math.max(
    0,
    detalleIRPF.impuestoFranja.reduce((a, b) => a + b, 0) -
      deducciones * tasaDeducciones
  );

  return { detalleIRPF, totalIRPF };
};

/**
 * @param netSalary - Desired net salary after taxes.
 * @param factorDeduccionPersonasACargo - Factor for deductions based on dependents.
 * @param cantHijosSinDiscapacidad - Number of children without disabilities.
 * @param cantHijosConDiscapacidad - Number of children with disabilities.
 * @param portesJubilatorios - Retirement contributions.
 * @param aportesFONASA - FONASA contributions.
 * @param aporteFRL - FRL contributions.
 * @param aportesFondoSolidaridad - Contributions to the Solidarity Fund (BPC).
 * @param adicionalFondoSolidaridad - Whether additional contributions to the Solidarity Fund apply.
 * @param aportesCJPPU - Contributions to the Caja de Profesionales Universitarios.
 * @param otrasDeducciones - Other deductions.
 *
 * @returns {number} - The gross salary (before taxes) that corresponds to the given net salary.
 */
export const calcularSalarioBrutoDesdeNeto = (
  netSalary: number,
  aportesJubilatorios?: number,
  aportesFONASA?: number,
  aporteFRL?: number,
  aportesCJPPU?: number,
  aportesFondoSolidaridad?: number,
  adicionalFondoSolidaridad?: boolean,
  factorDeduccionPersonasACargo?: number,
  cantHijosSinDiscapacidad?: number,
  cantHijosConDiscapacidad?: number,
  otrasDeducciones?: number
) => {
  const TOLERANCE = 0.01;
  let lowerBound = netSalary;
  let upperBound = netSalary * 2;
  let estimatedGrossSalary = (lowerBound + upperBound) / 2;

  while (upperBound - lowerBound > TOLERANCE) {
    const { totalIRPF } = calcularIRPF({
      salarioNominal: estimatedGrossSalary,
      factorDeduccionPersonasACargo,
      cantHijosSinDiscapacidad,
      cantHijosConDiscapacidad,
      aportesJubilatorios,
      aportesFONASA,
      aporteFRL,
      aportesFondoSolidaridad,
      adicionalFondoSolidaridad,
      aportesCJPPU,
      otrasDeducciones,
    });

    const calculatedNetSalary =
      estimatedGrossSalary -
      totalIRPF -
      (aportesJubilatorios || 0) -
      (aportesFONASA || 0) -
      (aporteFRL || 0);

    if (calculatedNetSalary < netSalary) lowerBound = estimatedGrossSalary;
    else upperBound = estimatedGrossSalary;

    estimatedGrossSalary = (lowerBound + upperBound) / 2;
  }

  return estimatedGrossSalary;
};
