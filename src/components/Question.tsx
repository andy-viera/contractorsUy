import { useState } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { FormData } from "../App";
import { companyType } from "../lib/constants";

type FollowUpType = {
  companyType?: companyType;
  condition: string;
  question: { label: string; value: keyof FormData };
  type: "radio" | "checkbox" | "number" | "select";
  options?: { label: string; value: string }[];
  followups?: FollowUpType[];
};

export type QuestionType = {
  question: { label: string; value: keyof FormData };
  type: "radio" | "checkbox" | "number" | "select";
  options?: { label: string; value: string }[];
  followups?: FollowUpType[];
};

interface QuestionProps extends QuestionType {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
}

export default function Question({
  register,
  watch,
  question,
  options,
  type,
  followups,
}: QuestionProps) {
  const [answer, setAnswer] = useState<string | undefined>();

  return (
    <>
      <div>
        <label className="block mb-2 font-medium">{question.label}</label>
        {type == "number" ? (
          <div className="relative text-sm">
            <span className="absolute inset-y-0 left-0 flex items-center p-2 font-semibold">
              $
            </span>
            <input
              type={type}
              {...register(question.value, { required: true })}
              className="form-input pl-8 py-1.5  w-full border rounded-md"
              placeholder="0.00"
            />
          </div>
        ) : (
          <div className="space-y-1 text-sm">
            {options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type={type}
                  value={option.value}
                  {...register(question.value, { required: true })}
                  className="form-radio"
                  onChange={(e) =>
                    !!e.target.value && setAnswer(e.target.value)
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        {followups &&
          followups?.length > 0 &&
          followups?.map(
            (f, i) =>
              answer === f.condition &&
              (!f.companyType ||
                watch("originCompanyType") === f.companyType) && (
                <Question
                  key={i}
                  register={register}
                  watch={watch}
                  question={f.question}
                  options={f.options}
                  type={f.type}
                  followups={f.followups}
                />
              )
          )}
      </div>
    </>
  );
}
