import React from "react";

import { FieldSettings, useFormApi } from "react-hooks-dynamic-form";

const FORM_FIELDS: Array<FieldSettings> = [
  {
    type: "text",
    name: "login",
    value: "johndoe",
    label: "ID",
    placeholder: "Your ID",
    isRequired: true,
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
  } as FieldSettings,
];

const MyForm: React.FC = () => {
  const { data, onFieldChange } = useFormApi(FORM_FIELDS);
  console.log(data);
  return (
    data && (
      <div className="my-form">
        <label>Your Form: </label>
        <input
          name="login"
          type="text"
          value={data.login.value as string}
          onChange={(ev): void => {
            onFieldChange("login", ev.target.value);
          }}
        />
      </div>
    )
  );
};

export default MyForm;
