# React hooks dynamic form library

![Downloads](https://img.shields.io/npm/dw/react-hooks-dynamic-form) ![Milestones](https://img.shields.io/github/milestones/all/vivo87/react-hooks-dynamic-form) ![Latest tag](https://img.shields.io/github/v/tag/vivo87/react-hooks-dynamic-form?color=yellow) ![License](https://img.shields.io/npm/l/react-hooks-dynamic-form?color=red) ![Peer React](https://img.shields.io/npm/dependency-version/react-hooks-dynamic-form/peer/react?color=violet&logo=React)

A simple but powerful library for managing form states, either by using the custom React hooks API for managing your own form, or using the library's auto generated Form Component (work in progress).

<br/>

See the full documentation and examples from our **[storybook](https://vivo87.github.io/react-hooks-dynamic-form/)**

<br/>

# Getting Started

```
npm install --save react-hooks-dynamic-form
```

# Usage

## 1. User defined parameters

As introducted above, the library provide 2 ways for managing form states. Both ways start by setting the form parameters:

### 1.1. Field definitions

An array containing fields definitions.

```javascript
const FORM_FIELDS = [
  {
    type: "email",
    name: "email",
  },
  {
    type: "phone",
    name: "phone",
    isRequired: true,
    validateOnChange: true,
    errorMessages: {
      isRequired: "I NEED THIS PHONE NUMBER !",
      phone: "I WANT A BETTER NUMBER !",
    },
  },
  {
    type: "number",
    name: "age",
    isRequired: true,
    customValidators: [
      {
        validate: (value, formData) => !Number.isNaN(value) && value >= 18,
        errorMessage: "You must be over 18 !",
      },
    ],
  },
];
```

> Please note, some properties are only for library's Form Component, such as className, label, render ... In case of using API on user's own custom form, only logical properties for managing state are taken into account. See list below.

#### _--- Common settings for Form API and Form Component_

| Property                | Type                | Description                                                                                                                                         | Default                                                                                                                          |
| ----------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| name                    | string              | HTML name attribute, also used as field identifier in the form, must be unique                                                                      |                                                                                                                                  |
| type                    | string              | Field type that will be use for adding default validation rule and render method when using Form component. See FieldTypeEnum for available option  | `"text"`                                                                                                                         |
| value                   | any                 | Initial field value                                                                                                                                 |                                                                                                                                  |
| isRequired              | boolean \| function | If true, the field is required for validation. Can be a predicate with formData as parameter in case of conditional validation based on other field | `false`                                                                                                                          |
| customValidators        | Array               | Array of custom validation rules `{ validate: (value, formData) => boolean, errorMessage: string }`                                                 | `[]`                                                                                                                             |
| errorMessages           | Object              | Validation error messages. Please note, "email" and "phone" are only applicable to related type                                                     | `{ isRequired: "This field is required", email: "Invalid email", phone: "Invalid phone number", default: "Invalid field value"}` |
| validateOnChange        | boolean             | If true, validate field on change                                                                                                                   | `false`                                                                                                                          |
| disableBuiltInValidator | boolean             | If true, disable built-in validator, applicable to type with default validator (email, phone)                                                       | `false`                                                                                                                          |

#### _--- Settings only applicable to Form Component_

| Property | Type | Description  | Default |
| -------- | ---- | ------------ | ------- |
| Work     | In   | Progress ... | 💯👍    |

<br/>

### 1.2. Default settings for all fields

We can provide a default common settings for all fields.

> Please note, these settings will be merged and eventually overridden by each specific field definition above.

```javascript
const DEFAULT_SETTINGS = {
  validateOnChange: true,
  errorMessages: {
    isRequired: "A custom message for required field",
    default: "A custom message for incorrect input",
  },
};
```

### 1.3. Remote values

Sometimes the fields values can't be defined on initialization but rather dynamically from external sources (such as server-side or parent components ...). In this case we can pass an object containing `key : value` combos and the library will watch for values change and take care of updating the form accordingly.

```javascript
const remoteValues = { login: "Jane", phone: "01-02-03-04-05" };
```

> These remote values will override all values from field definitions or default settings.

<br/>

## 2. Using React Hooks API for managing your own form

You can use the library form API for managing your own form. Form API provide these properties:

```javascript
interface FormApi {
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

> Please note, remoteValues are subject for useEffect immutable dependencies. These values **MUST NOT** be assigned inline with useFormApi call in order to avoid infinity loop overload. See example below.

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

Each component update can cause an infinity loop as a new `remoteValues` object is created. Therefore, only assign remoteValues in other scope (parent component, react hooks useState, useMemo ...). Anyway, for the purpose of `remoteValues`, it will never be initialized inline this way but only by error.

<br/>

## 3. Using the library's auto generated Form component

Following the next major release, the library will provide an auto generated Form component that also take care of the form rendering according to field settings.

```
WORK IN PROGRESS ...
```
