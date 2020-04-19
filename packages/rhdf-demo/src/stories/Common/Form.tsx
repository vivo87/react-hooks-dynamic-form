import React, { FC } from "react";

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
  const { isInit, values, setFieldValue, validateField, getFieldInputError } = useFormApi(
    fields,
    defaultSettings,
    remoteValues
  );
  return isInit ? (
    <div className="my-form">
      {fields.map(({ name, type, label, validateOnChange, placeholder }, index) => (
        <div key={`${name}-${index}`} className="field">
          <label>{label || `Field ${index + 1}`}</label>
          <input
            name={name}
            className="field__input"
            placeholder={placeholder}
            type={AVAILABLE_TYPES.includes(type || "") ? type : "text"}
            value={values[name] as string}
            onChange={(ev): void => {
              setFieldValue(name, ev.target.value);
            }}
            onBlur={(): void => {
              if (!validateOnChange) {
                validateField(name);
              }
            }}
          />
          <span className="field__helper">{getFieldInputError(name)}</span>
        </div>
      ))}
    </div>
  ) : null;
};

export default Form;
