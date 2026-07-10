import type { Step1Data, Step3Data } from "./createJobDialog.schemas";

export interface CreateJobDialogDraft {
  step1: Step1Data;
  payload: Record<string, unknown>;
  step3: Step3Data;
}
