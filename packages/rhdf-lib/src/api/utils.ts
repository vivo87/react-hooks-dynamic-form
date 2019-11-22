import { Field, FieldValueType, FieldSettings } from "./Field";

export interface FormData {
  [fieldName: string]: Field;
}
export interface DefaultValues {
  [fieldName: string]: FieldValueType;
}

/**
 * Generate form data by normalizing fields settings array
 * @param fields Array field settings
 * @param defaultValues fields values from parent
 */
export const generateFormData = (
  fields: FieldSettings[],
  defaultValues?: DefaultValues
): FormData => {
  const allFields = fields.reduce<FieldSettings[]>(
    (acc, field) => acc.concat(field.type === "fieldset" ? field.children || [] : field),
    []
  );

  return allFields.reduce((acc, fieldSettings) => {
    const field = new Field(fieldSettings);
    // Init Field state
    field.setPristine(true);
    field.setError(null);
    if (defaultValues && defaultValues[field.name]) {
      field.value = defaultValues[field.name];
    }

    switch (field.type) {
      case "email":
        // Auto add a default email validation
        //field.type = "text";
        field.customValidations.push({
          validate: (value: FieldValueType) => {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (
              (!field.isRequired && !value) || (!!value && regex.test((value as string).trim()))
            );
          },
          errorMessage: "Veuillez saisir un email valide",
        });
        break;
      case "phone":
        // Auto add a default french phone validation
        field.type = "text";
        field.customValidations.push({
          validate: (value: FieldValueType) => {
            const regex = /^(0[1-68])(?:[ _.-]?(\d{2})){4}$/;
            return (
              (!field.isRequired && !value) || (!!value && regex.test((value as string).trim()))
            );
          },
          errorMessage: "Veuillez saisir un téléphone valide",
        });
        break;
      default:
        break;
    }

    return {
      ...acc,
      [field.name]: field,
    };
  }, {});
};

/**
 * Update formData object with modified field value
 * @param formData current form data object
 * @param fieldName field name
 * @param newValue field new value
 * @returns updated formData
 */
export const updateFormField = (
  formData: FormData,
  fieldName: string,
  newValue: FieldValueType
): FormData => {
  if (!formData[fieldName]) {
    return formData;
  }
  formData[fieldName].updateValue(newValue);

  // Immutable to allow update
  return {
    ...formData,
  };
};
