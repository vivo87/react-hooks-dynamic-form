import { useState, useEffect, useCallback } from "react";

import { FieldValueType, FieldSettings } from "../Field";
import { generateFormData, updateFormField, FormData, DefaultValues } from "./utils";

export interface FormHooks {
  isValid: boolean;
  data: FormData | null;
  onFieldChange: (name: string, value: FieldValueType) => void;
  isFieldInputError: (fieldName: string) => boolean;
  resetForm: () => void;
}

export const useFormHooks = (fields: FieldSettings[], defaultValues?: DefaultValues): FormHooks => {
  const [formData, setFormData] = useState<FormData | null>(null);

  const resetForm = useCallback(() => {
    const data = generateFormData(fields, defaultValues);
    setFormData(data);
  }, [fields, defaultValues]);

  useEffect(() => {
    // 1st init when fields or defaultValues change
    resetForm();
  }, [resetForm]);

  const handleFieldChange = useCallback((name: string, value: FieldValueType) => {
    setFormData(currentFormData => {
      const newFormData = updateFormField(currentFormData as FormData, name, value);

      return newFormData;
    });
  }, []);

  return {
    isValid: false,
    data: formData,
    onFieldChange: handleFieldChange,
    isFieldInputError: (): boolean => true,
    resetForm,
  };
};
