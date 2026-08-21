'use client';

import React from 'react';

export interface CustomFieldSpec {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'file';
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  maxLength?: number;
  accept?: string;
}

interface CustomSchemaFormProps {
  fields: CustomFieldSpec[];
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function CustomSchemaForm({ fields, values, onChange }: CustomSchemaFormProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="glass p-5 space-y-4 border border-white/10 rounded-xl my-4">
      <div className="border-b border-white/8 pb-2">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Custom Order Attributes
        </h4>
        <p className="text-xs text-zinc-400">
          This product requires custom specifications for fulfillment.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                placeholder={field.placeholder || ''}
                maxLength={field.maxLength}
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="form-input text-xs py-2"
                required={field.required}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                placeholder={field.placeholder || ''}
                maxLength={field.maxLength}
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="form-input text-xs py-2 min-h-[70px]"
                required={field.required}
              />
            )}

            {field.type === 'select' && (
              <select
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="form-input text-xs py-2 bg-[#121215]"
                required={field.required}
              >
                <option value="">Select option...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'file' && (
              <input
                type="text"
                placeholder="Direct asset URL or presigned upload key"
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="form-input text-xs py-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
