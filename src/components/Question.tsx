import { useEffect } from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { FormData } from "../App";
import { companyType, MINIMUM_WAGE } from "../lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn, normalizeConditions, normalizeValue } from "@/lib/utils";

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
interface QuestionProps extends QuestionType {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export default function Question({
  register,
  watch,
  setValue,
  question,
  options,
  type,
  followups,
}: QuestionProps) {
  const watchedAnswer = watch(question.value);

  useEffect(() => {
    if (followups) {
      followups.forEach((followup) => {
        const valueToSet =
          followup.defaultValue !== undefined
            ? followup.defaultValue
            : undefined;
        setValue(followup.question.value, valueToSet);
        if (followup.followups) {
          followup.followups.forEach((subFollowup) =>
            setValue(subFollowup.question.value, undefined)
          );
        }
      });
    }
  }, [watchedAnswer, followups, setValue]);

  return (
    <>
      <div>
        <label className="block mb-2 font-medium">{question.label}</label>
        <div className="space-y-1 text-sm">
          <div>
            {(() => {
              switch (type) {
                case "salary":
                case "number":
                  return (
                    <div className="relative text-sm">
                      {type === "salary" && (
                        <span className="absolute inset-y-0 left-0 flex items-center p-2 ">
                          U$
                        </span>
                      )}
                      <input
                        type={"number"}
                        min={type === "salary" ? MINIMUM_WAGE : 0}
                        {...register(question.value, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        className={cn(
                          type === "salary" ? "pl-8 w-full" : "pl-2 w-32",
                          "py-2 pr-2 border rounded-md form-input"
                        )}
                        placeholder="0"
                      />
                    </div>
                  );
                case "select":
                  return (
                    <>
                      <Select
                        value={
                          watchedAnswer !== undefined
                            ? String(watchedAnswer)
                            : ""
                        }
                        onValueChange={(value) =>
                          setValue(question.value, Number(value), {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {options?.map((option) => (
                            <SelectItem
                              key={option.label}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        {...register(question.value, {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                    </>
                  );
                default:
                  return options?.map((option, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type={type}
                        value={String(option.value)}
                        {...register(question.value, {
                          required: true,
                        })}
                        className="form-radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ));
              }
            })()}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {followups &&
          watchedAnswer !== undefined &&
          followups.length > 0 &&
          followups.map((f, i) => {
            const normalizedWatchedAnswer = normalizeValue(watchedAnswer);
            const normalizedConditions = normalizeConditions(f.condition);

            const conditionMatched =
              f.condition === undefined ||
              normalizedConditions.some(
                (cond) => cond === normalizedWatchedAnswer
              );

            const companyTypeMatched =
              f.companyType === undefined ||
              watch("originCompanyType") === f.companyType;

            return (
              conditionMatched &&
              companyTypeMatched && (
                <Question
                  key={i}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  question={f.question}
                  options={f.options}
                  type={f.type}
                  followups={f.followups}
                />
              )
            );
          })}
      </div>
    </>
  );
}
