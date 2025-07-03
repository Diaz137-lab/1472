import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Check, 
  AlertCircle, 
  Mail, 
  Phone, 
  User, 
  Building,
  DollarSign,
  Bitcoin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enhanced validation patterns
const validationRules = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Enter a valid email address',
    suggestions: ['@gmail.com', '@yahoo.com', '@outlook.com', '@quotexes.online']
  },
  phone: {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: 'Enter a valid phone number (10 digits)',
    format: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length >= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      } else if (digits.length >= 3) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      }
      return digits;
    }
  },
  name: {
    pattern: /^[a-zA-Z\s]{2,50}$/,
    message: 'Name should contain only letters and spaces (2-50 characters)'
  },
  company: {
    pattern: /^[a-zA-Z0-9\s&.,'-]{2,100}$/,
    message: 'Company name should be 2-100 characters'
  },
  amount: {
    pattern: /^\$?[\d,]+(\.\d{2})?$/,
    message: 'Enter a valid amount (e.g., $1,000.00)',
    format: (value) => {
      const number = parseFloat(value.replace(/[^\d.]/g, ''));
      return isNaN(number) ? '' : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(number);
    }
  }
};

// Common typo corrections
const emailCorrections = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yahoo.co': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'hotmial.com': 'hotmail.com'
};

export function BitcoinFormValidator({ 
  fields = [], 
  onValidationChange,
  showSuggestions = true,
  bitcoinThemed = true 
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [validation, setValidation] = useState({});
  const [suggestions, setSuggestions] = useState({});

  // Auto-correct email domains
  const correctEmail = (email) => {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    
    const correctedDomain = emailCorrections[domain.toLowerCase()] || domain;
    return `${local}@${correctedDomain}`;
  };

  // Generate email suggestions
  const generateEmailSuggestions = (email) => {
    const [local] = email.split('@');
    if (!local || local.length < 2) return [];
    
    return validationRules.email.suggestions.map(domain => `${local}${domain}`);
  };

  // Validate field
  const validateField = (fieldName, value, rules) => {
    if (!value) {
      return { isValid: false, message: `${fieldName} is required` };
    }

    const rule = validationRules[rules.type];
    if (!rule) {
      return { isValid: true, message: 'Valid' };
    }

    const isValid = rule.pattern.test(value);
    return {
      isValid,
      message: isValid ? 'Valid' : rule.message
    };
  };

  // Handle input change
  const handleInputChange = (fieldName, value, rules) => {
    let processedValue = value;
    
    // Auto-format based on field type
    if (rules.type === 'phone' && validationRules.phone.format) {
      processedValue = validationRules.phone.format(value);
    }
    
    if (rules.type === 'amount' && validationRules.amount.format) {
      processedValue = validationRules.amount.format(value);
    }
    
    if (rules.type === 'email') {
      // Auto-correct common email mistakes
      processedValue = correctEmail(value);
      
      // Generate suggestions
      if (showSuggestions && !processedValue.includes('@')) {
        setSuggestions(prev => ({
          ...prev,
          [fieldName]: generateEmailSuggestions(processedValue)
        }));
      } else {
        setSuggestions(prev => ({ ...prev, [fieldName]: [] }));
      }
    }

    // Update form data
    setFormData(prev => ({ ...prev, [fieldName]: processedValue }));
    
    // Validate field
    const fieldValidation = validateField(fieldName, processedValue, rules);
    setValidation(prev => ({ ...prev, [fieldName]: fieldValidation }));
    
    // Notify parent component
    if (onValidationChange) {
      onValidationChange({
        data: { ...formData, [fieldName]: processedValue },
        validation: { ...validation, [fieldName]: fieldValidation }
      });
    }
  };

  // Apply suggestion
  const applySuggestion = (fieldName, suggestion) => {
    const field = fields.find(f => f.name === fieldName);
    handleInputChange(fieldName, suggestion, field);
    setSuggestions(prev => ({ ...prev, [fieldName]: [] }));
  };

  // Get field icon
  const getFieldIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'name': return <User className="w-4 h-4" />;
      case 'company': return <Building className="w-4 h-4" />;
      case 'amount': return bitcoinThemed ? <Bitcoin className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${bitcoinThemed ? 'bg-gradient-to-br from-bitcoin-light/10 to-gold-light/10 p-6 rounded-xl border border-bitcoin-orange/20' : 'p-4'}`}>
      {bitcoinThemed && (
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-bitcoin-gradient rounded-lg">
            <Bitcoin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bitcoin-Enhanced Form</h3>
            <p className="text-sm text-gray-600">Smart validation with auto-corrections</p>
          </div>
          <Badge className="bg-bitcoin-gradient text-white border-0 ml-auto">
            AI Powered
          </Badge>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.name} className="relative">
          <Label htmlFor={field.name} className="flex items-center space-x-2 mb-2">
            {getFieldIcon(field.type)}
            <span>{field.label}</span>
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          
          <Input
            id={field.name}
            type={field.type === 'email' ? 'email' : 'text'}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value, field)}
            placeholder={field.placeholder}
            className={`
              ${bitcoinThemed ? 'border-bitcoin-orange/30 focus:border-bitcoin-orange focus:ring-bitcoin-orange/20' : ''}
              ${validation[field.name]?.isValid === false ? 'border-red-500 bg-red-50' : ''}
              ${validation[field.name]?.isValid === true ? 'border-green-500 bg-green-50' : ''}
              transition-all duration-200
            `}
          />
          
          {/* Suggestions dropdown */}
          {suggestions[field.name]?.length > 0 && showSuggestions && (
            <Card className="absolute top-full left-0 right-0 z-10 mt-1 shadow-lg">
              <CardContent className="p-2">
                <div className="text-xs text-gray-500 mb-2">Did you mean:</div>
                {suggestions[field.name].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left hover:bg-bitcoin-light/20"
                    onClick={() => applySuggestion(field.name, suggestion)}
                  >
                    <Mail className="w-3 h-3 mr-2" />
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Validation message */}
          {validation[field.name] && (
            <div className={`flex items-center space-x-2 mt-2 text-sm ${
              validation[field.name].isValid 
                ? bitcoinThemed ? 'text-green-600' : 'text-green-600'
                : 'text-red-600'
            }`}>
              {validation[field.name].isValid ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{validation[field.name].message}</span>
              {validation[field.name].isValid && bitcoinThemed && (
                <Badge variant="outline" size="sm" className="bg-green-100 text-green-700 border-green-300">
                  Verified
                </Badge>
              )}
            </div>
          )}
        </div>
      ))}
      
      {bitcoinThemed && (
        <div className="mt-6 p-4 bg-bitcoin-gradient/10 rounded-lg border border-bitcoin-orange/20">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Bitcoin className="w-4 h-4 text-bitcoin-orange" />
            <span>Your information is secured with Bitcoin-grade encryption</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BitcoinFormValidator;