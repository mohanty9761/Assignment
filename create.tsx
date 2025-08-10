
import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, 
  Checkbox as MUICheckbox, FormControlLabel,
  IconButton, Typography, Paper
} from "@mui/material";
import { Delete, ArrowUpward, ArrowDownward, Save } from "@mui/icons-material";
import type { FieldConfig, FieldType } from "./types";
import { v4 as uuidv4 } from "uuid";

const fieldTypes: FieldType[] = [
  "text", "number", "textarea", "select", "radio", "checkbox", "date"
];

export default function FormBuilder() {
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [formName, setFormName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("form-schema");
    if (saved) setFields(JSON.parse(saved));
  }, []);

  const addField = (type: FieldType) => {
    const newField: FieldConfig = {
        id: uuidv4(),
        type,
        label: "",
        required: false,
        defaultValue: "",
        validation: {},
        options: ["Option 1", "Option 2"],
        isDerived: false,
        name: ""
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const moveField = (index: number, dir: "up" | "down") => {
    const newFields = [...fields];
    const targetIndex = dir === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveForm = () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }
    localStorage.setItem("form-schema", JSON.stringify(fields));
    alert("Form schema saved!");
  };

  return (
    <Box p={3}>
      <Typography variant="h4">Form Builder</Typography>

      <Box mt={2}>
        <TextField
          label="Form Name"
          value={formName}
          onChange={e => setFormName(e.target.value)}
          fullWidth
        />
      </Box>

      <Box mt={2}>
        {fieldTypes.map(type => (
          <Button key={type} variant="outlined" onClick={() => addField(type)} sx={{ m: 0.5 }}>
            Add {type}
          </Button>
        ))}
      </Box>

      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mt: 2 }}>
          <TextField
            label="Label"
            value={field.label}
            onChange={e => updateField(field.id, { label: e.target.value })}
            fullWidth
          />
          <FormControlLabel
            control={
              <MUICheckbox
                checked={field.required}
                onChange={e => updateField(field.id, { required: e.target.checked })}
              />
            }
            label="Required"
          />
          <TextField
            label="Default Value"
            value={field.defaultValue}
            onChange={e => updateField(field.id, { defaultValue: e.target.value })}
            fullWidth
          />

          {["select", "radio", "checkbox"].includes(field.type) && (
            <TextField
              label="Options (comma separated)"
              value={field.options?.join(",")}
              onChange={e =>
                updateField(field.id, { options: e.target.value.split(",") })
              }
              fullWidth
            />
          )}

          <FormControlLabel
            control={
              <MUICheckbox
                checked={field.isDerived || false}
                onChange={e => updateField(field.id, { isDerived: e.target.checked })}
              />
            }
            label="Derived Field"
          />
          {field.isDerived && (
            <>
              <TextField
                label="Parent Field IDs (comma separated)"
                value={field.parentFields?.join(",") || ""}
                onChange={e =>
                  updateField(field.id, { parentFields: e.target.value.split(",") })
                }
                fullWidth
              />
              <TextField
                label="Formula"
                value={field.formula || ""}
                onChange={e => updateField(field.id, { formula: e.target.value })}
                fullWidth
              />
            </>
          )}

          <Box mt={1}>
            <IconButton onClick={() => moveField(index, "up")}>
              <ArrowUpward />
            </IconButton>
            <IconButton onClick={() => moveField(index, "down")}>
              <ArrowDownward />
            </IconButton>
            <IconButton onClick={() => deleteField(field.id)}>
              <Delete />
            </IconButton>
          </Box>
        </Paper>
      ))}

      <Box mt={2}>
        <Button variant="contained" startIcon={<Save />} onClick={saveForm}>
          Save Form
        </Button>
      </Box>
    </Box>
  );
}
