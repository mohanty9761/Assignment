import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

type FieldOption = {
  label: string;
  value: string;
};

type ValidationRule = {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  emailFormat?: boolean;
  passwordRule?: boolean; // min 8 chars + number
};

type Field = {
  id: string;
  type: string;
  label: string;
  required: boolean;
  defaultValue?: string;
  validation?: ValidationRule;
  options?: FieldOption[];
  isDerived?: boolean;
  parentFields?: string[];
  formula?: string; // JavaScript expression string
};

export default function Preview() {
  const [formSchema, setFormSchema] = useState<Field[]>([]);
  const [values, setValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem("formSchema");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormSchema(parsed);
      // initialize values with defaults
      const initVals: any = {};
      parsed.forEach((f: Field) => {
        initVals[f.id] = f.defaultValue || "";
      });
      setValues(initVals);
    }
  }, []);

  // Handle input changes
  const handleChange = (id: string, value: any) => {
    const updatedValues = { ...values, [id]: value };
    setValues(updatedValues);
    updateDerivedFields(updatedValues);
  };

  // Update derived fields when parents change
  const updateDerivedFields = (updatedValues: any) => {
    const newValues = { ...updatedValues };
    formSchema.forEach((field) => {
      if (field.isDerived && field.parentFields?.length && field.formula) {
        try {
          // Prepare parent values for formula
          const formulaFunc = new Function(
            ...field.parentFields,
            `return ${field.formula};`
          );
          const parentVals = field.parentFields.map(
            (pid) => updatedValues[pid]
          );
          newValues[field.id] = formulaFunc(...parentVals);
        } catch (err) {
          console.error("Error computing derived field", field.label, err);
        }
      }
    });
    setValues(newValues);
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: any = {};
    formSchema.forEach((field) => {
      const val = values[field.id];
      const rules = field.validation || {};

      if (field.required && !val) {
        newErrors[field.id] = "This field is required.";
        return;
      }
      if (rules.notEmpty && typeof val === "string" && val.trim() === "") {
        newErrors[field.id] = "Cannot be empty.";
      }
      if (rules.minLength && typeof val === "string" && val.length < rules.minLength) {
        newErrors[field.id] = `Minimum length is ${rules.minLength}.`;
      }
      if (rules.maxLength && typeof val === "string" && val.length > rules.maxLength) {
        newErrors[field.id] = `Maximum length is ${rules.maxLength}.`;
      }
      if (rules.emailFormat && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.id] = "Invalid email format.";
      }
      if (rules.passwordRule && val) {
        if (val.length < 8 || !/\d/.test(val)) {
          newErrors[field.id] =
            "Password must be at least 8 characters and contain a number.";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
      console.log("Submitted values:", values);
    }
  };

  const renderField = (field: Field) => {
    const commonProps = {
      key: field.id,
      label: field.label,
      value: values[field.id] || "",
      onChange: (e: any) => handleChange(field.id, e.target.value),
      error: !!errors[field.id],
      helperText: errors[field.id],
      fullWidth: true,
      disabled: field.isDerived,
    };

    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <TextField
            {...commonProps}
            type={field.type}
          />
        );
      case "textarea":
        return (
          <TextField
            {...commonProps}
            multiline
            rows={3}
          />
        );
      case "select":
        return (
          <FormControl fullWidth error={!!errors[field.id]}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={values[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
          </FormControl>
        );
      case "radio":
        return (
          <FormControl component="fieldset" error={!!errors[field.id]}>
            <Typography>{field.label}</Typography>
            <RadioGroup
              value={values[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              {field.options?.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
            {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={values[field.id] || false}
                onChange={(e) => handleChange(field.id, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Preview Form
      </Typography>
      {formSchema.length === 0 ? (
        <Typography>No form schema found. Please create a form first.</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            {formSchema.map((field) => renderField(field))}
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
