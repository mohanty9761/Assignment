// src/types.ts
export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export interface ValidationRule {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  emailFormat?: boolean;
  passwordRule?: boolean;
}

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string;
  validation?: ValidationRule;
  derived?: boolean;
  parentFields?: string[];
  formula?: string;
}

export interface FormSchema {
  name: string;
  createdAt: string;
  fields: FieldConfig[];
}
export interface FieldConfig {
  name: string;
  label: string;
  
  validation?: ValidationRule;
  options?: string[]; // ✅ Now allowed
}
export interface FieldConfig {
  name: string;
  label: string;
  
  validation?: ValidationRule;
  options?: string[];
  isDerived?: boolean; // ✅ Added this
}
