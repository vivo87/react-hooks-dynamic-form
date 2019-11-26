import React from "react";

import { FieldSettings, useFormApi } from "react-hooks-dynamic-form";

import "./TsForm.css";

const FORM_FIELDS: Array<FieldSettings> = [
  {
    type: "text",
    name: "login",
    value: "johndoe",
    label: "ID",
    placeholder: "Your ID",
    isRequired: true,
    validateOnChange: true,
  } as FieldSettings,
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Your Password",
    isRequired: true,
  } as FieldSettings,
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Your Email",
    isRequired: true,
  } as FieldSettings,
  {
    type: "phone",
    name: "phone",
    label: "Phone number",
    placeholder: "Your Phone",
    isRequired: true,
  } as FieldSettings,
];

const TsForm: React.FC = () => {
  const { isInit, values, setFieldValue, validateField, getFieldInputError } = useFormApi(
    FORM_FIELDS
  );
  return isInit ? (
    <div className="my-form">
      <div className="field">
        <label>I valid myself on change: </label>
        <input
          name="login"
          className={getFieldInputError("login") ? "field--error" : ""}
          type="text"
          value={values.login as string}
          onChange={(ev): void => {
            setFieldValue("login", ev.target.value);
          }}
        />
        <span className="field-error-helper">{getFieldInputError("login")}</span>
      </div>
      <div className="field">
        <label>I valid myself on blur: </label>
        <input
          name="phone"
          className={getFieldInputError("phone") ? "field--error" : ""}
          type="text"
          value={values.phone as string}
          onChange={(ev): void => {
            setFieldValue("phone", ev.target.value);
          }}
          onBlur={(): void => {
            validateField("phone");
          }}
        />
        <span className="field-error-helper">{getFieldInputError("phone")}</span>
      </div>
    </div>
  ) : null;
};

export default TsForm;
