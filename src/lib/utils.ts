import { FormData } from "@/App";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ADICIONAL_FONDO_SOLIDARIDAD,
  BFC,
  BPC,
  companyType,
  DEDUCCION_HIJO_CON_DISCAPACIDAD,
  DEDUCCION_HIJO_SIN_DISCAPACIDAD,
  INCREMENTO_INGRESOS_GRAVADOS,
  IRPF_FRANJAS,
  TASA_DEDUCCIONES_DESDE15BPC,
  TASA_DEDUCCIONES_HASTA15BPC,
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
  console.log(retirementTax, frlTax, fonasaTax);
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
  } = parseBooleans(data);

  const realCurrentSalary = calculateRealCurrentSalary(currentSalary);

  if (isProfessional && professionalCategory) {
    return calculateContractorSalary({
      realCurrentSalary,
      professionalCategory,
      addIrpf:
        originCompanyType === companyType.unipersonal && combinesCapitalAndWork,
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
      addIrpf: combinesCapitalAndWork,
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
export const calcularIPRF = (
  salarioNominal: number,
  aportesJubilatorios: number = 0,
  aportesFONASA: number = 0,
  aporteFRL: number = 0,
  factorDeduccionPersonasACargo: number = 0,
  cantHijosSinDiscapacidad: number = 0,
  cantHijosConDiscapacidad: number = 0,
  aportesFondoSolidaridad: number = 0,
  adicionalFondoSolidaridad?: boolean,
  aportesCJPPU: number = 0,
  otrasDeducciones: number = 0
) => {
  const salarioEnBPC = salarioNominal / BPC;
  let tasaDeducciones = null;
  if (salarioEnBPC > 15) tasaDeducciones = TASA_DEDUCCIONES_DESDE15BPC;
  else tasaDeducciones = TASA_DEDUCCIONES_HASTA15BPC;

  // Calcular si hay que aplicar el aumento a ingresos gravados Seguridad Social
  if (salarioEnBPC > 10) salarioNominal *= 1 + INCREMENTO_INGRESOS_GRAVADOS;

  // Cantidad deducida del IRPF por los hijos
  const deduccionesHijos =
    factorDeduccionPersonasACargo *
    (cantHijosSinDiscapacidad * DEDUCCION_HIJO_SIN_DISCAPACIDAD +
      cantHijosConDiscapacidad * DEDUCCION_HIJO_CON_DISCAPACIDAD);

  const aporteAdicionalFondoSolidaridad = adicionalFondoSolidaridad
    ? ADICIONAL_FONDO_SOLIDARIDAD
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

  IRPF_FRANJAS.forEach(
    (franja: { hasta: number; desde: number; tasa: number }) => {
      const hasta = franja.hasta !== 0 ? franja.hasta : 999;
      if (salarioNominal > franja.desde * BPC) {
        const impuesto =
          (Math.min(hasta * BPC, salarioNominal) - franja.desde * BPC) *
          franja.tasa;

        detalleIRPF.impuestoFranja.push(impuesto);
      } else {
        detalleIRPF.impuestoFranja.push(0);
      }
    }
  );

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
    const { totalIRPF } = calcularIPRF(
      estimatedGrossSalary,
      factorDeduccionPersonasACargo,
      cantHijosSinDiscapacidad,
      cantHijosConDiscapacidad,
      aportesJubilatorios,
      aportesFONASA,
      aporteFRL,
      aportesFondoSolidaridad,
      adicionalFondoSolidaridad,
      aportesCJPPU,
      otrasDeducciones
    );

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
