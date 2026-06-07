"use client";

import React from "react";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomIcon from "../custom-icon/custom-icon";

type CustomAccordionProps = Omit<AccordionProps, "children"> & {
  title: React.ReactNode;
  /** Node rendered on the right side of the accordion header (e.g. a switch) */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
};

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  headerAction,
  children,
  ...props
}) => {
  return (
    <Accordion disableGutters elevation={0} {...props}>
      <AccordionSummary expandIcon={<CustomIcon name="expandMore" fontSize="large" />}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            pr: 1,
          }}
        >
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 600 }}>{title}</Typography>
          {headerAction && <Box onClick={(e) => e.stopPropagation()}>{headerAction}</Box>}
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
