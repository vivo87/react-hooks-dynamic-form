import React from "react";

import { useFormApi } from "react-hooks-dynamic-form";

const FORM_FIELDS = [
  {
    type: "text",
    name: "login",
    label: "ID",
    value: "johndoe",
    placeholder: "Your ID",
    isRequired: true,
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Your Password",
    isRequired: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Your Email",
    isRequired: true,
  },
  {
    type: "phone",
    name: "phone",
    label: "Phone number",
    placeholder: "Your Phone",
  },
];

const YourForm = () => {
  const { data } = useFormApi(FORM_FIELDS);
  console.log("Your form", data);

  return <div className="your-form">TO-DO Your Form</div>;
};

export default YourForm;
