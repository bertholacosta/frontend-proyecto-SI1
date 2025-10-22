import { TextField } from '@mui/material';
import { useState } from 'react';
import { FIELD_LIMITS, validateField } from '../utils/fieldValidations';

/**
 * TextField con validaciones integradas
 * Uso:
 * <ValidatedTextField 
 *   label="Nombre" 
 *   value={nombre} 
 *   onChange={setNombre}
 *   fieldConfig={FIELD_LIMITS.empleado.nombre}
 * />
 */
const ValidatedTextField = ({
  label,
  value,
  onChange,
  fieldConfig,
  type = 'text',
  required = false,
  disabled = false,
  multiline = false,
  rows = 1,
  showCharCount = true,
  ...otherProps
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Limitar longitud en tiempo real si hay maxLength
    if (fieldConfig?.maxLength && newValue.length > fieldConfig.maxLength) {
      return; // No permitir más caracteres
    }
    
    onChange(newValue);
    
    // Validar solo si el campo ha sido tocado
    if (touched && fieldConfig) {
      const validation = validateField(newValue, fieldConfig);
      setError(validation.error);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (fieldConfig && value) {
      const validation = validateField(value, fieldConfig);
      setError(validation.error);
    }
  };

  const handleFocus = () => {
    setError(''); // Limpiar error al enfocar
  };

  // Generar helper text
  let helperText = '';
  if (error && touched) {
    helperText = error;
  } else if (showCharCount && fieldConfig?.maxLength) {
    helperText = `${value?.length || 0}/${fieldConfig.maxLength} caracteres`;
  } else if (fieldConfig?.errorMessage && !touched) {
    helperText = fieldConfig.errorMessage;
  }

  // Atributos del input
  const inputProps = {
    ...otherProps.inputProps,
  };

  if (fieldConfig?.minLength) inputProps.minLength = fieldConfig.minLength;
  if (fieldConfig?.maxLength) inputProps.maxLength = fieldConfig.maxLength;
  if (fieldConfig?.min !== undefined) inputProps.min = fieldConfig.min;
  if (fieldConfig?.max !== undefined) inputProps.max = fieldConfig.max;
  if (fieldConfig?.pattern) inputProps.pattern = fieldConfig.pattern.source;

  return (
    <TextField
      fullWidth
      label={label}
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      type={type}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      error={touched && !!error}
      helperText={helperText}
      inputProps={inputProps}
      {...otherProps}
    />
  );
};

export default ValidatedTextField;
