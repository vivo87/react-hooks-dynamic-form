import React, { FC } from "react";
import TsForm from "../components/TsForm";

export default {
  title: "TsForm tsx",
  component: TsForm,
};

export const example: FC = () => <TsForm remoteData={{ phone: "01-02-03-04-05" }} />;
