# React hooks dynamic form library

A simple but powerful library for managing form states, either by using the custom React hooks API for managing your own form, or using the library's auto generated Form component (work in progress).

# Getting Started

```
npm install --save react-hooks-dynamic-form
```

# Usage

## 1. User defined parameters

As introducted above, the library provide 2 ways for managing form states. Both ways start by setting the form parameters:

### Fields

An array containing fields definitions.

> The `name` property must be unique as being field key in the form.

```javascript
const FORM_FIELDS = [
  {
    type: "text",
    name: "login",
    value: "johndoe",
    label: "ID",
    placeholder: "Your ID",
    isRequired: true,
    validateOnChange: true,
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
    isRequired: true,
    errorMessages: {
      isRequired: "I NEED THIS PHONE NUMBER !",
      phone: "I WANT A BETTER NUMBER !",
    },
  },
];
```

> Please note, some properties are only for library's Form component, such as className, label, render ... In case of using API on user's own custom form, only logical properties for managing state are taken into account.

### Common settings for all fields

We can provide a common settings for all fields.

> Please note, these settings will be merged and eventually overridden by each specific field settings above.

```javascript
const DEFAULT_SETTINGS: Partial<FieldSettings> = {
  validateOnBlur: true,
  errorMessages: { isRequired: "A custom message for required field" },
};
```

### Remote values

Sometimes the fields values can't be defined on initialization but rather dynamically from external sources (such as server-side or parent components ...). In this case we can pass an object containing `key : value` combos and the library will watch for values change and take care of updating the form accordingly.

```javascript
const remoteValues = { login: "Jane", phone: "01-02-03-04-05" };
```

> These remote values will override all values from field definitions or common settings.

<br/>

## 2. Using React Hooks API for managing your own form

You can use the library form API for managing your own form. Form API provide these properties:

```javascript
return {
  isInit, // indicate whether form data is initialized
  values, // current field values { key: value }
  setFieldValue, // set field value function(name, value)
  validateField, // validate a field function(name)
  validateForm, // validate all form function()
  getFieldInputError, // get field input error function(name)
  resetForm, // reset form function
};
```

Form API can be used as custom React hooks:

```javascript
import { useFormApi } from "react-hooks-dynamic-form";

const CustomForm = ({ remoteData }) => {
  const { isInit, values, setFieldValue, validateField, getFieldInputError } = useFormApi(
    FORM_FIELDS,
    DEFAULT_SETTINGS,
    remoteData
  );
  return isInit ? (
    <div className="my-form">
      <div className="field">
        <label>Login that valid itself on change: </label>
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
        <label>Phone that valid itself on blur: </label>
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
```

> Please note, remoteValues are subject for useEffect immutable dependencies. they `MUST NOT` be assigned inline with useFormApi call in order to avoid infinity loop overload. See example below.

Considering this example with inline initialization of remoteValues:

```javascript
import { useFormApi } from "react-hooks-dynamic-form";

const CustomForm = () => {
  const { values, setFieldValue } = useFormApi(FORM_FIELDS, DEFAULT_SETTINGS, {
    fieldA: "value A",
    fieldB: "value B",
  });
  return <form>Anything...</form>;
};
```

Each component update can cause an infinity loop a new `remoteValues` object is created. Therefore, only assign remoteValues in other scope (parent component, react hooks useState, useMemo ...)

<br/>

## 3. Using the library's auto generated Form component

Following the next major release, the library will provide an auto generated Form component that also take care of the form rendering according to field settings.

```
WORK IN PROGRESS ...
```
