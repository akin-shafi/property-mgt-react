import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  // useFormContext
} from "react-hook-form";

import { cn } from "../../../lib/utils";
import { Label } from "./label";

const Form = FormProvider;

const FormField = ({ ...props }) => {
  return <Controller {...props} />;
};

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return <Label ref={ref} className={cn("", className)} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ ...props }, ref) => {
  return <Slot ref={ref} {...props} />;
});
FormControl.displayName = "FormControl";

export { Form, FormControl, FormField, FormItem, FormLabel };
