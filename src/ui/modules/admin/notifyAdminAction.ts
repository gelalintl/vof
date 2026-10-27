"use client";

import { toast } from "sonner";

function actionErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export function notifyAdminAction(
  action: (formData: FormData) => Promise<unknown>,
  successMessage: string,
  onSuccess?: () => void,
) {
  return async (formData: FormData) => {
    try {
      const result = await action(formData);
      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success === false &&
        "error" in result &&
        typeof result.error === "string"
      ) {
        toast.error(result.error);
        return;
      }
      onSuccess?.();
      toast.success(successMessage);
    } catch (error) {
      toast.error(actionErrorMessage(error));
    }
  };
}

export async function notifyAdminConfirm(
  action: () => Promise<void>,
  successMessage: string,
) {
  try {
    await action();
    toast.success(successMessage);
  } catch (error) {
    toast.error(actionErrorMessage(error));
    throw error;
  }
}
