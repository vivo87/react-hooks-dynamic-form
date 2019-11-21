import React from "react";

import { FieldSettings, useFormUtils } from "react-hooks-dynamic-form";

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
  const { data } = useFormUtils(FORM_FIELDS);
  console.log("My Form", data);

  return <div className="my-form">TO-DO My Form</div>;
};

export default MyForm;
