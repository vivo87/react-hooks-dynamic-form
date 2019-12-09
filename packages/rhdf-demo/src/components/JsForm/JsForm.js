import React from "react";
import PropTypes from "prop-types";

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

const JsForm = () => {
  const { values } = useFormApi(FORM_FIELDS);

  return <div className="your-form">TO-DO JS Form: {JSON.stringify(values)}</div>;
};

JsForm.propTypes = {
  remoteData: PropTypes.object,
};

export default JsForm;
