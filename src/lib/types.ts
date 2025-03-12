export enum companyType {
  unipersonal = "unipersonal",
  SAS = "SAS",
}

export interface FormData {
  originCompanyType: companyType;
  targetCompanyType: "foreign" | "national";
  isProfessional: "true" | "false";
  currentSalary: number;
  combinesCapitalAndWork?: "true" | "false";
  professionalCategory?: number;
  hasChildsInCharge?: "true" | "false";
  childsInChargeCount?: number;
  disabledChildsInChargeCount?: number;
  dependentsDeductionFactor?: number;
  hasPartnerInCharge?: "true" | "false";
  socialSecurityCategory?: number;
  solidarityFundContribution?: number;
  appliesSolidarityFundAditional?: "true" | "false";
}

export enum TaxDetail {
  retirementTax = "Aportes jubilatorios",
  fonasaTax = "Aportes a FONASA",
  frlTax = "Aportes a FRL",
  irpfTax = "IRPF",
  professionalCategory = "Aporte a caja de profesionales",
  solidarityFundContribution = "Aporte a fondo de solidaridad",
  additionalSolidarityFundAmount = "Aporte adicional al fondo de solidaridad",
}
