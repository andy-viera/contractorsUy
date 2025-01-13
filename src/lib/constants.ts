import { QuestionType } from "../components/Question";

export enum companyType {
  unipersonal = "unipersonal",
  SAS = "SAS",
}

export const INITIAL_INPUTS: QuestionType[] = [
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
  },
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
          value: "capitalAndWork",
        },
        type: "radio",
        options: [
          { label: "Sí", value: "yes" },
          { label: "No", value: "no" },
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
      { label: "Sí", value: "yes" },
      { label: "No", value: "no" },
    ],
    type: "radio",
    followups: [
      {
        condition: "yes",
        question: {
          label:
            "¿En que categoría de la escala de la caja de profesionales estás?",
          value: "professionalCategory",
        },
        type: "select",
        options: [
          { label: "1ra. Especial", value: "3.054" },
          { label: "1ra.", value: "6.075" },
          { label: "2da.", value: "11.491" },
          { label: "3ra.", value: "16.285" },
          { label: "4ta.", value: "20.427" },
          { label: "5ta.", value: "23.918" },
          { label: "6ta.", value: "26.792" },
          { label: "7ma.", value: "29.041" },
          { label: "8va.", value: "30.628" },
          { label: "9na.", value: "31.591" },
          { label: "10ma.", value: "31.900" },
        ],
      },
    ],
  },
  {
    question: {
      label: "¿Cuál es tu sueldo líquido actual?",
      value: "currentSalary",
    },
    type: "number",
  },
];
