import React, { FC } from "react";
import classNamesDedupe from "classnames/dedupe";
import { action } from "@storybook/addon-actions";

import { useFormApi } from "react-hooks-dynamic-form";
import { FormValues } from "react-hooks-dynamic-form/dist/api/form";
import { FieldSettings } from "react-hooks-dynamic-form/dist/api/field";

import "./Form.css";

interface Props {
  fields: FieldSettings[];
  defaultSettings: Partial<FieldSettings>;
  remoteValues?: FormValues;
}

const AVAILABLE_TYPES = ["text", "email", "number", "password"];

/**
 * Custom Typescript Form with library's `useFormApi` custom hooks
 */
const Form: FC<Props> = ({ fields, defaultSettings, remoteValues }: Props) => {
  const {
    isInit,
    values,
    setFieldValue,
    validateField,
    validateForm,
    getFieldInputError,
    resetForm,
  } = useFormApi(fields, defaultSettings, remoteValues);
  return isInit ? (
    <div className="form">
      {fields.map((fieldSettings, index) => {
        const { name, type, label, validateOnChange, placeholder } = {
          ...defaultSettings,
          ...fieldSettings,
        };
        return (
          <div key={`${name}-${index}`} className="field">
            <label>{label || `Field ${index + 1}`}</label>
            <input
              name={name}
              className={classNamesDedupe("field__input", {
                "field__input--error": !!getFieldInputError(name),
              })}
              placeholder={placeholder}
              type={AVAILABLE_TYPES.includes(type || "") ? type : "text"}
              value={values[name] as string}
              onChange={(ev): void => {
                setFieldValue(name, ev.target.value);
                if (validateOnChange) {
                  action("Validate field on change")(name, ev.target.value);
                }
              }}
              onBlur={(): void => {
                if (!validateOnChange) {
                  validateField(name);
                  action("Validate field on blur")(name);
                }
              }}
            />
            <span className="field__helper">{getFieldInputError(name)}</span>
          </div>
        );
      })}
      <div className="form__actions">
        <button
          className="validate-btn"
          onClick={() => {
            const isValid = validateForm();
            action(`Validate form: isValid = ${isValid}`)();
          }}>
          Validate form
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            resetForm();
            action(`Reset form`)();
          }}>
          Reset form
        </button>
      </div>
    </div>
  ) : null;
};

export default Form;
