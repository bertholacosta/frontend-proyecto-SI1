/**
 * Configuración de validaciones y límites de campos
 * Basado en el schema de Prisma y reglas de negocio
 */

export const FIELD_LIMITS = {
  // Usuario
  usuario: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    errorMessage: 'El usuario debe tener entre 3-50 caracteres (solo letras, números, guiones y guiones bajos)'
  },
  
  // Contraseña
  contrasena: {
    minLength: 8,
    maxLength: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    errorMessage: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
  },
  
  // Email
  email: {
    maxLength: 150,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Ingresa un correo electrónico válido (máx. 150 caracteres)'
  },
  
  // Cliente
  cliente: {
    nombre: {
      minLength: 3,
      maxLength: 200,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      errorMessage: 'Nombre debe tener 3-200 caracteres (solo letras y espacios)'
    },
    ci: {
      minLength: 6,
      maxLength: 10,
      pattern: /^\d+$/,
      errorMessage: 'CI debe tener 6-10 dígitos numéricos'
    },
    telefono: {
      minLength: 7,
      maxLength: 15,
      pattern: /^\d+$/,
      errorMessage: 'Teléfono debe tener 7-15 dígitos'
    },
    direccion: {
      minLength: 5,
      maxLength: 250,
      errorMessage: 'Dirección debe tener entre 5-250 caracteres'
    }
  },
  
  // Empleado
  empleado: {
    nombre: {
      minLength: 3,
      maxLength: 120,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      errorMessage: 'Nombre debe tener 3-120 caracteres (solo letras y espacios)'
    },
    ci: {
      minLength: 6,
      maxLength: 10,
      pattern: /^\d+$/,
      errorMessage: 'CI debe tener 6-10 dígitos numéricos'
    },
    telefono: {
      minLength: 7,
      maxLength: 15,
      pattern: /^\d+$/,
      errorMessage: 'Teléfono debe tener 7-15 dígitos'
    },
    direccion: {
      minLength: 5,
      maxLength: 200,
      errorMessage: 'Dirección debe tener entre 5-200 caracteres'
    }
  },
  
  // Moto
  moto: {
    placa: {
      minLength: 6,
      maxLength: 10,
      pattern: /^[A-Z0-9-]+$/,
      errorMessage: 'Placa debe tener 6-10 caracteres (letras mayúsculas, números y guiones)'
    },
    modelo: {
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Modelo debe tener entre 2-100 caracteres'
    },
    chasis: {
      minLength: 10,
      maxLength: 30,
      pattern: /^[A-Z0-9]+$/,
      errorMessage: 'Chasis debe tener 10-30 caracteres alfanuméricos'
    },
    year: {
      min: 1900,
      max: new Date().getFullYear() + 1,
      errorMessage: `Año debe estar entre 1900 y ${new Date().getFullYear() + 1}`
    }
  },
  
  // Servicio
  servicio: {
    descripcion: {
      minLength: 5,
      maxLength: 200,
      errorMessage: 'Descripción debe tener entre 5-200 caracteres'
    }
  },
  
  // Categoría
  categoria: {
    nombre: {
      minLength: 3,
      maxLength: 80,
      errorMessage: 'Nombre debe tener entre 3-80 caracteres'
    }
  },
  
  // Herramienta
  herramienta: {
    nombre: {
      minLength: 3,
      maxLength: 120,
      errorMessage: 'Nombre debe tener entre 3-120 caracteres'
    },
    descripcion: {
      maxLength: 250,
      errorMessage: 'Descripción debe tener máximo 250 caracteres'
    }
  },
  
  // Marca
  marca: {
    nombre: {
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Nombre debe tener entre 2-100 caracteres'
    }
  },
  
  // Diagnóstico
  diagnostico: {
    descripcion: {
      minLength: 10,
      maxLength: 500,
      errorMessage: 'Descripción debe tener entre 10-500 caracteres'
    }
  },
  
  // Proforma
  proforma: {
    descripcion: {
      minLength: 5,
      maxLength: 250,
      errorMessage: 'Descripción debe tener entre 5-250 caracteres'
    },
    repuesto: {
      minLength: 2,
      maxLength: 120,
      errorMessage: 'Nombre del repuesto debe tener entre 2-120 caracteres'
    }
  },
  
  // Números y montos
  decimal: {
    monto: {
      min: 0,
      max: 9999999999.99,
      decimals: 2,
      errorMessage: 'Monto debe ser positivo y con máximo 2 decimales'
    },
    cantidad: {
      min: 0,
      max: 99999999.99,
      decimals: 2,
      errorMessage: 'Cantidad debe ser positiva y con máximo 2 decimales'
    }
  }
};

/**
 * Valida un campo según su configuración
 * @param {string} value - Valor a validar
 * @param {object} config - Configuración del campo
 * @returns {object} { valid: boolean, error: string }
 */
export const validateField = (value, config) => {
  if (!config) {
    return { valid: true, error: '' };
  }

  // Verificar longitud mínima
  if (config.minLength && value.length < config.minLength) {
    return { valid: false, error: config.errorMessage || `Mínimo ${config.minLength} caracteres` };
  }

  // Verificar longitud máxima
  if (config.maxLength && value.length > config.maxLength) {
    return { valid: false, error: config.errorMessage || `Máximo ${config.maxLength} caracteres` };
  }

  // Verificar patrón
  if (config.pattern && !config.pattern.test(value)) {
    return { valid: false, error: config.errorMessage || 'Formato inválido' };
  }

  // Verificar rango numérico
  if (config.min !== undefined || config.max !== undefined) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { valid: false, error: 'Debe ser un número válido' };
    }
    if (config.min !== undefined && numValue < config.min) {
      return { valid: false, error: config.errorMessage || `Valor mínimo: ${config.min}` };
    }
    if (config.max !== undefined && numValue > config.max) {
      return { valid: false, error: config.errorMessage || `Valor máximo: ${config.max}` };
    }
  }

  return { valid: true, error: '' };
};

/**
 * Obtiene los atributos HTML para un input basado en la configuración
 * @param {object} config - Configuración del campo
 * @returns {object} Atributos para el input
 */
export const getInputAttributes = (config) => {
  if (!config) return {};

  const attrs = {};

  if (config.minLength) attrs.minLength = config.minLength;
  if (config.maxLength) attrs.maxLength = config.maxLength;
  if (config.min !== undefined) attrs.min = config.min;
  if (config.max !== undefined) attrs.max = config.max;
  if (config.pattern) attrs.pattern = config.pattern.source;

  return attrs;
};

/**
 * Formatea un número con decimales específicos
 * @param {number|string} value - Valor a formatear
 * @param {number} decimals - Número de decimales
 * @returns {string} Valor formateado
 */
export const formatDecimal = (value, decimals = 2) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
};

/**
 * Valida un monto decimal
 * @param {string|number} value - Valor a validar
 * @param {object} config - Configuración del decimal
 * @returns {object} { valid: boolean, error: string }
 */
export const validateDecimal = (value, config = FIELD_LIMITS.decimal.monto) => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Debe ser un número válido' };
  }

  if (num < config.min) {
    return { valid: false, error: `Valor mínimo: ${config.min}` };
  }

  if (num > config.max) {
    return { valid: false, error: `Valor máximo: ${config.max}` };
  }

  // Verificar decimales
  const decimals = (value.toString().split('.')[1] || '').length;
  if (decimals > config.decimals) {
    return { valid: false, error: `Máximo ${config.decimals} decimales` };
  }

  return { valid: true, error: '' };
};

export default FIELD_LIMITS;
