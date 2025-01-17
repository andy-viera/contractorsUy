import { FormData } from "@/App";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ADICIONAL_FONDO_SOLIDARIDAD,
  BFC,
  BPC,
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

const calculateContractorSalary = (
  realCurrentSalary: number,
  retirementTax: number = 0,
  fonasaTax: number = 0,
  frlTax = 0,
  professionalCategory: number = 0,
  addIrpf: boolean = false
) => {
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
    (retirementTax + fonasaTax + frlTax) / realCurrentSalary;
  return addIrpf ? grossSalary : realCurrentSalary / (1 - taxPercentage);
};

const calculateRealCurrentSalary = (salary: number) => {
  const hourlyRate = salary / 160; // 8 hour shift
  const holidaySalary = hourlyRate * 8 * 20; // 20 days of holidays
  const annualRealSalary = salary * 13 + holidaySalary; // 13th salary (aguinaldo)
  return annualRealSalary / 12;
};

export const calculateSalaryForPath = (data: FormData) => {
  const {
    currentSalary,
    targetCompanyType,
    combinesCapitalAndWork,
    isProfessional,
    professionalCategory,
    socialSecurityCategory,
    hasChildsInCharge,
    hasPartnerInCharge,
  } = data;

  const realCurrentSalary = calculateRealCurrentSalary(currentSalary);

  if (targetCompanyType === "foreign") {
    if (!combinesCapitalAndWork) {
      if (isProfessional && professionalCategory) {
        return calculateContractorSalary(
          realCurrentSalary,
          professionalCategory
        );
      } else if (socialSecurityCategory) {
        const retirementTax = socialSecurityCategory * 0.225;
        const frlTax = socialSecurityCategory * 0.001;
        let fonasaTax;

        if (hasChildsInCharge && hasPartnerInCharge)
          fonasaTax = socialSecurityCategory * 0.13;
        else if (hasChildsInCharge) fonasaTax = socialSecurityCategory * 0.11;
        else if (hasPartnerInCharge) fonasaTax = socialSecurityCategory * 0.115;

        return calculateContractorSalary(
          realCurrentSalary,
          retirementTax,
          fonasaTax,
          frlTax
        );
      }
    } else {
      if (isProfessional && professionalCategory) {
        return calculateContractorSalary(
          realCurrentSalary,
          0,
          0,
          0,
          professionalCategory,
          true
        );
      } else if (socialSecurityCategory) {
        const retirementTax = socialSecurityCategory * 0.225;
        const frlTax = socialSecurityCategory * 0.001;
        let fonasaTax;

        if (hasChildsInCharge && hasPartnerInCharge)
          fonasaTax = socialSecurityCategory * 0.13;
        else if (hasChildsInCharge) fonasaTax = socialSecurityCategory * 0.11;
        else if (hasPartnerInCharge) fonasaTax = socialSecurityCategory * 0.115;

        return calculateContractorSalary(
          realCurrentSalary,
          retirementTax,
          fonasaTax,
          frlTax,
          0,
          true
        );
      }
    }
  } else {
    if (isProfessional && professionalCategory) {
      return calculateContractorSalary(
        realCurrentSalary,
        0,
        0,
        0,
        professionalCategory
      );
    } else {
      const retirementTax = 15 * BFC * 0.225;
      const frlTax = 15 * BFC * 0.001;
      let fonasaTax;

      if (hasChildsInCharge && hasPartnerInCharge) fonasaTax = 6.5 * BPC * 0.13;
      else if (hasChildsInCharge) fonasaTax = 6.5 * BPC * 0.11;
      else if (hasPartnerInCharge) fonasaTax = 6.5 * BPC * 0.115;

      return calculateContractorSalary(
        realCurrentSalary,
        retirementTax,
        fonasaTax,
        frlTax
      );
    }
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
