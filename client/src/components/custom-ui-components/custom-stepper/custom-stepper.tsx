"use client";

import React from "react";
import Stepper, { type StepperProps } from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

type CustomStepperProps = Omit<StepperProps, "children"> & {
  steps: string[];
};

const CustomStepper: React.FC<CustomStepperProps> = ({ steps, ...props }) => {
  return (
    <Stepper alternativeLabel {...props}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper;
