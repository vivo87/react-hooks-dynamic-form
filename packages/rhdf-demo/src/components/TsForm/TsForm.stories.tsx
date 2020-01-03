import React, { FC } from "react";

import TsForm from "./TsForm";

export default {
  title: "TS Form CSF",
  component: TsForm,
};

export const example: FC = () => (
  <TsForm remoteData={{ login: "John Doe", phone: "01-02-03-04-05" }} />
);
