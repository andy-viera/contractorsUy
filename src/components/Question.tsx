import { useEffect } from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { FormData } from "../App";
import { companyType } from "../lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FollowUpType = {
  companyType?: companyType;
  condition?: FormData[keyof FormData];
  question: { label: string; value: keyof FormData };
  type: "radio" | "checkbox" | "number" | "select";
  options?: { label: string; value: FormData[keyof FormData] }[];
  followups?: FollowUpType[];
};

export type QuestionType = {
  question: { label: string; value: keyof FormData };
  type: "radio" | "checkbox" | "number" | "select";
  options?: { label: string; value: FormData[keyof FormData] }[];
  followups?: FollowUpType[];
  placeholder?: string;
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

  // Reset follow-up answers when the parent question changes
  useEffect(() => {
    if (followups) {
      followups.forEach((followup) => {
        setValue(followup.question.value, undefined); // Clear the follow-up answer
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
                case "number":
                  return (
                    <div className="relative text-sm">
                      <span className="absolute inset-y-0 left-0 flex items-center p-2 ">
                        U$
                      </span>
                      <input
                        type={type}
                        {...register(question.value, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        className="w-full py-2 pl-8 pr-2 border rounded-md form-input"
                        placeholder="0"
                      />
                    </div>
                  );
                case "select":
                  return (
                    <>
                      <Select
                        value={String(watchedAnswer)}
                        onValueChange={(value) =>
                          setValue(question.value, Number(value))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
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
          watchedAnswer &&
          followups?.length > 0 &&
          followups?.map(
            (f, i) =>
              (f.condition === undefined ||
                watchedAnswer === String(f.condition)) &&
              (f.companyType === undefined ||
                watch("originCompanyType") === f.companyType) && (
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
          )}
      </div>
    </>
  );
}
