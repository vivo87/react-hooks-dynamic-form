import { useState, useEffect, useCallback, useMemo } from "react";

import { Field, FieldValueType, FieldSettings } from "./field";
import { generateFormData, updateFormField, validateField, validateForm } from "./handlers";

/**
 * Form data with fields map
 */
export interface FormData {
  [fieldName: string]: Field;
}

/**
 * Field values map { [name]: value}
 */
export interface FormValues {
  [fieldName: string]: FieldValueType;
}

/**
 * Form API client interface
 */
export interface FormApi {
  /**
   * indicating whether form data is initialized
   */
  isInit: boolean;
  /**
   * current field values { key: value }
   */
  values: FormValues;
  /**
   * update form field value
   */
  setFieldValue: (name: string, value: FieldValueType) => void;
  /**
   * validate a field
   */
  validateField: (name: string) => void;
  /**
   * validate all form fields
   */
  validateForm: () => boolean;
  /**
   * return field input error if there is any
   */
  getFieldInputError: (fieldName: string) => string | null;
  /**
   * reset form to initial settings
   */
  resetForm: () => void;
}

/**
 * Form API library entry point to generate and reuse all Form API function
 * @param fields field definitions array
 * @param defaultSettings common settings for all fields
 * @param remoteValues in case fields values are remote (server, parents components ...)
 */
export const useFormApi = (
  fields: FieldSettings[],
  defaultSettings?: Partial<FieldSettings>,
  remoteValues?: FormValues
): FormApi => {
  const [formData, setFormData] = useState<FormData | null>(() =>
    // Init once without remote value
    generateFormData(fields, defaultSettings)
  );

  useEffect(() => {
    // Remote values can be lazily loaded
    if (remoteValues) {
      setFormData(currentFormData =>
        Object.entries(remoteValues).reduce(
          (updatedData, [name, value]) => updateFormField(updatedData, name, value),
          currentFormData as FormData
        )
      );
    }
  }, [remoteValues]);

  const resetForm = useCallback(() => {
    const data = generateFormData(fields, defaultSettings, remoteValues);
    setFormData(data);
  }, [fields, defaultSettings, remoteValues]);

  const handleFieldChange = useCallback((name: string, value: FieldValueType) => {
    setFormData(currentFormData => updateFormField(currentFormData as FormData, name, value));
  }, []);

  const handleFieldValidate = useCallback((name: string) => {
    setFormData(currentFormData => validateField(currentFormData as FormData, name));
  }, []);

  const handleFormValidate = useCallback(() => {
    const { isValid, updatedData } = validateForm(formData as FormData);
    setFormData(updatedData);
    return isValid;
  }, [formData]);

  const getFieldInputError = useCallback(
    (name: string) => (formData ? formData[name].getInputError() : null),
    [formData]
  );

  const values: FormValues = useMemo(
    () =>
      fields.reduce(
        (acc, { name }) => ({
          ...acc,
          ...(formData && name && formData[name] ? { [name]: formData[name].value } : {}),
        }),
        {}
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  );

  return {
    isInit: !!formData,
    values,
    setFieldValue: handleFieldChange,
    validateField: handleFieldValidate,
    validateForm: handleFormValidate,
    getFieldInputError,
    resetForm,
  };
};
