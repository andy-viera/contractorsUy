import { describe, it, expect, vi } from "vitest";
import { areAllQuestionsAnswered } from "../src/lib/utils";

vi.mock("../src/lib/constants", () => ({}));

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

export type conditionType =
  | number
  | companyType
  | "foreign"
  | "national"
  | "true"
  | "false";

export type QuestionType = {
  question: { label: string; value: keyof FormData };
  type: "radio" | "checkbox" | "select" | "salary" | "number";
  options?: { label: string; value: FormData[keyof FormData] }[];
  followups?: FollowUpType[];
  placeholder?: string;
};

type FollowUpType = {
  companyType?: companyType;
  condition?: conditionType | conditionType[];
  question: { label: string; value: keyof FormData };
  type: "radio" | "checkbox" | "select" | "salary" | "number";
  options?: { label: string; value: FormData[keyof FormData] }[];
  defaultValue?: FormData[keyof FormData];
  followups?: FollowUpType[];
};

const baseFormData: FormData = {
  originCompanyType: companyType.unipersonal,
  targetCompanyType: "national",
  isProfessional: "false",
  currentSalary: 1000,
};

describe("areAllQuestionsAnswered", () => {
  it("returns true if no questions are provided", () => {
    expect(areAllQuestionsAnswered([], baseFormData)).toBe(true);
  });

  it("returns false if a question's answer is missing", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Current Salary", value: "currentSalary" },
        type: "salary",
      },
    ];

    const formValues = { ...baseFormData } as Partial<FormData>;
    delete formValues.currentSalary;
    expect(areAllQuestionsAnswered(questions, formValues as FormData)).toBe(
      false
    );
  });

  it("returns false if a question's answer is null", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Current Salary", value: "currentSalary" },
        type: "salary",
      },
    ];
    const formValues = { ...baseFormData, currentSalary: null as any };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(false);
  });

  it("returns true if a single question is answered and has no followups", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Current Salary", value: "currentSalary" },
        type: "salary",
      },
    ];
    expect(areAllQuestionsAnswered(questions, baseFormData)).toBe(true);
  });

  it("ignores followup if its condition does not match the parent's answer", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Professional Category",
              value: "professionalCategory",
            },
            type: "select",
            condition: "true",
          },
        ],
      },
    ];
    const formValues: FormData = { ...baseFormData, isProfessional: "false" };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(true);
  });

  it("requires followup answer if parent's answer matches condition", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Professional Category",
              value: "professionalCategory",
            },
            type: "select",
            condition: "true",
          },
        ],
      },
    ];
    const formValues: FormData = { ...baseFormData, isProfessional: "true" };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(false);
  });

  it("returns true if followup is triggered and answered", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Professional Category",
              value: "professionalCategory",
            },
            type: "select",
            condition: "true",
          },
        ],
      },
    ];
    const formValues: FormData = {
      ...baseFormData,
      isProfessional: "true",
      professionalCategory: 1,
    };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(true);
  });

  it("handles followup condition as an array and does not trigger if parent's answer does not match", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Professional Category",
              value: "professionalCategory",
            },
            type: "select",
            condition: ["false"],
          },
        ],
      },
    ];

    const formValues: FormData = { ...baseFormData, isProfessional: "true" };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(true);
  });

  it("handles followup condition as an array and triggers if parent's answer matches one", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Professional Category",
              value: "professionalCategory",
            },
            type: "select",
            condition: ["true", "false"],
          },
        ],
      },
    ];
    const formValues: FormData = { ...baseFormData, isProfessional: "true" };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(false);
  });

  it("ignores followup if companyType does not match", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Combines Capital and Work",
              value: "combinesCapitalAndWork",
            },
            type: "radio",
            condition: "true",
            companyType: companyType.SAS,
          },
        ],
      },
    ];

    const formValues: FormData = {
      ...baseFormData,
      isProfessional: "true",
      originCompanyType: companyType.unipersonal,
    };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(true);
  });

  it("triggers followup if companyType matches and requires an answer", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Combines Capital and Work",
              value: "combinesCapitalAndWork",
            },
            type: "radio",
            condition: "true",
            companyType: companyType.unipersonal,
          },
        ],
      },
    ];

    const formValues: FormData = {
      ...baseFormData,
      isProfessional: "true",
      combinesCapitalAndWork: "true",
      originCompanyType: companyType.unipersonal,
    };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(true);
  });

  it("handles nested followups", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Has Childs", value: "hasChildsInCharge" },
        type: "radio",
        followups: [
          {
            question: { label: "Child Count", value: "childsInChargeCount" },
            type: "number",
            condition: "true",
            followups: [
              {
                question: {
                  label: "Disabled Child Count",
                  value: "disabledChildsInChargeCount",
                },
                type: "number",
                condition: "true",
              },
            ],
          },
        ],
      },
    ];

    let formValues = {
      ...baseFormData,
      hasChildsInCharge: "true",
    } as Partial<FormData>;
    expect(areAllQuestionsAnswered(questions, formValues as FormData)).toBe(
      false
    );

    formValues = {
      ...baseFormData,
      hasChildsInCharge: "true",
      childsInChargeCount: 2,
      disabledChildsInChargeCount: 1,
    };
    expect(areAllQuestionsAnswered(questions, formValues as FormData)).toBe(
      true
    );
  });

  it("returns true if all questions and applicable followups are answered", () => {
    const questions: QuestionType[] = [
      {
        question: { label: "Current Salary", value: "currentSalary" },
        type: "salary",
      },
      {
        question: { label: "Is Professional", value: "isProfessional" },
        type: "radio",
        followups: [
          {
            question: {
              label: "Professional Category",
              value: "professionalCategory",
            },
            type: "select",
            condition: "true",
          },
        ],
      },
    ];
    const formValues: FormData = {
      ...baseFormData,
      currentSalary: 5000,
      isProfessional: "true",
      professionalCategory: 2,
    };
    expect(areAllQuestionsAnswered(questions, formValues)).toBe(true);
  });
});
