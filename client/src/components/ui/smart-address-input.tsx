import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Check, AlertCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// US ZIP code database (sample data - in production would use a more comprehensive API)
const zipDatabase = {
  '76513': { city: 'Belton', state: 'TX', county: 'Bell County' },
  '10001': { city: 'New York', state: 'NY', county: 'New York County' },
  '90210': { city: 'Beverly Hills', state: 'CA', county: 'Los Angeles County' },
  '60601': { city: 'Chicago', state: 'IL', county: 'Cook County' },
  '33101': { city: 'Miami', state: 'FL', county: 'Miami-Dade County' },
  '75201': { city: 'Dallas', state: 'TX', county: 'Dallas County' },
  '98101': { city: 'Seattle', state: 'WA', county: 'King County' },
  '30301': { city: 'Atlanta', state: 'GA', county: 'Fulton County' },
  '80202': { city: 'Denver', state: 'CO', county: 'Denver County' },
  '85001': { city: 'Phoenix', state: 'AZ', county: 'Maricopa County' }
};

// Address validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  state: /^[A-Z]{2}$/
};

// Common address corrections
const addressCorrections = {
  'st': 'St',
  'ave': 'Ave',
  'blvd': 'Blvd',
  'dr': 'Dr',
  'ln': 'Ln',
  'rd': 'Rd',
  'ct': 'Ct',
  'pl': 'Pl'
};

export function SmartAddressInput({ 
  onAddressChange, 
  initialData = {},
  showValidation = true,
  bitcoinThemed = true 
}) {
  const { toast } = useToast();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    ...initialData
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [validation, setValidation] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Auto-correct street address
  const correctStreetAddress = useCallback((input) => {
    let corrected = input;
    Object.entries(addressCorrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      corrected = corrected.replace(regex, correct);
    });
    return corrected;
  }, []);

  // ZIP code lookup and auto-fill
  const handleZipCodeChange = useCallback(async (zipCode) => {
    if (validationPatterns.zipCode.test(zipCode)) {
      setIsValidating(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const locationData = zipDatabase[zipCode.substring(0, 5)];
        
        if (locationData) {
          setAddress(prev => ({
            ...prev,
            city: locationData.city,
            state: locationData.state,
            zipCode: zipCode
          }));
          
          toast({
            title: "Address Auto-filled",
            description: `Location detected: ${locationData.city}, ${locationData.state}`,
            className: bitcoinThemed ? "bg-bitcoin-light border-bitcoin-orange" : ""
          });
          
          setValidation(prev => ({
            ...prev,
            zipCode: { isValid: true, message: 'Valid ZIP code' }
          }));
        } else {
          setValidation(prev => ({
            ...prev,
            zipCode: { isValid: false, message: 'ZIP code not found in database' }
          }));
        }
        setIsValidating(false);
      }, 500);
    }
  }, [toast, bitcoinThemed]);

  // Street address suggestions
  const generateStreetSuggestions = useCallback((input) => {
    if (input.length < 3) return [];
    
    const commonStreets = [
      'Main Street', 'Oak Avenue', 'First Street', 'Second Street', 'Park Avenue',
      'Broadway', 'Washington Street', 'Lincoln Avenue', 'Maple Street', 'Cedar Lane'
    ];
    
    return commonStreets
      .filter(street => street.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  }, []);

  // Validate field
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'street':
        return {
          isValid: value.length >= 5,
          message: value.length < 5 ? 'Street address should be at least 5 characters' : 'Valid address'
        };
      case 'city':
        return {
          isValid: value.length >= 2,
          message: value.length < 2 ? 'City name required' : 'Valid city'
        };
      case 'state':
        return {
          isValid: validationPatterns.state.test(value.toUpperCase()),
          message: !validationPatterns.state.test(value.toUpperCase()) ? 'Use 2-letter state code (e.g., TX)' : 'Valid state'
        };
      case 'zipCode':
        return {
          isValid: validationPatterns.zipCode.test(value),
          message: !validationPatterns.zipCode.test(value) ? 'Enter valid ZIP code (12345 or 12345-6789)' : 'Valid ZIP code'
        };
      default:
        return { isValid: true, message: '' };
    }
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Auto-correct street address
    if (field === 'street') {
      processedValue = correctStreetAddress(value);
      setSuggestions(generateStreetSuggestions(value));
    }
    
    // Auto-uppercase state
    if (field === 'state') {
      processedValue = value.toUpperCase();
    }
    
    // Handle ZIP code auto-fill
    if (field === 'zipCode' && value.length === 5) {
      handleZipCodeChange(value);
    }
    
    setAddress(prev => ({ ...prev, [field]: processedValue }));
    
    // Validate field if validation is enabled
    if (showValidation) {
      const fieldValidation = validateField(field, processedValue);
      setValidation(prev => ({ ...prev, [field]: fieldValidation }));
    }
    
    // Notify parent component
    if (onAddressChange) {
      onAddressChange({ ...address, [field]: processedValue });
    }
  };

  // Apply suggestion
  const applySuggestion = (suggestion) => {
    handleInputChange('street', suggestion);
    setSuggestions([]);
  };

  return (
    <div className={`space-y-4 ${bitcoinThemed ? 'bg-bitcoin-light/20 p-4 rounded-lg border border-bitcoin-orange/20' : ''}`}>
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className={`w-5 h-5 ${bitcoinThemed ? 'text-bitcoin-orange' : 'text-blue-600'}`} />
        <Label className="text-lg font-semibold">Smart Address Input</Label>
        {bitcoinThemed && (
          <Badge variant="outline" className="bg-bitcoin-gradient text-white border-0">
            Bitcoin Enhanced
          </Badge>
        )}
      </div>

      {/* Street Address */}
      <div className="relative">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={address.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          placeholder="Enter your street address..."
          className={`${bitcoinThemed ? 'border-bitcoin-orange/30 focus:border-bitcoin-orange' : ''} ${
            validation.street?.isValid === false ? 'border-red-500' : validation.street?.isValid ? 'border-green-500' : ''
          }`}
        />
        
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-10 mt-1">
            <CardContent className="p-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
        
        {validation.street && showValidation && (
          <div className={`flex items-center space-x-1 mt-1 text-sm ${
            validation.street.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validation.street.isValid ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{validation.street.message}</span>
          </div>
        )}
      </div>

      {/* City and State Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="City"
            className={`${bitcoinThemed ? 'border-bitcoin-orange/30 focus:border-bitcoin-orange' : ''} ${
              validation.city?.isValid === false ? 'border-red-500' : validation.city?.isValid ? 'border-green-500' : ''
            }`}
          />
          {validation.city && showValidation && (
            <div className={`flex items-center space-x-1 mt-1 text-sm ${
              validation.city.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.city.isValid ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{validation.city.message}</span>
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="TX"
            maxLength={2}
            className={`${bitcoinThemed ? 'border-bitcoin-orange/30 focus:border-bitcoin-orange' : ''} ${
              validation.state?.isValid === false ? 'border-red-500' : validation.state?.isValid ? 'border-green-500' : ''
            }`}
          />
          {validation.state && showValidation && (
            <div className={`flex items-center space-x-1 mt-1 text-sm ${
              validation.state.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.state.isValid ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{validation.state.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* ZIP Code */}
      <div>
        <Label htmlFor="zipCode">ZIP Code</Label>
        <div className="relative">
          <Input
            id="zipCode"
            value={address.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="12345"
            className={`${bitcoinThemed ? 'border-bitcoin-orange/30 focus:border-bitcoin-orange' : ''} ${
              validation.zipCode?.isValid === false ? 'border-red-500' : validation.zipCode?.isValid ? 'border-green-500' : ''
            }`}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className={`animate-spin rounded-full h-4 w-4 border-2 border-gray-300 ${
                bitcoinThemed ? 'border-t-bitcoin-orange' : 'border-t-blue-600'
              }`}></div>
            </div>
          )}
        </div>
        {validation.zipCode && showValidation && (
          <div className={`flex items-center space-x-1 mt-1 text-sm ${
            validation.zipCode.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validation.zipCode.isValid ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{validation.zipCode.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartAddressInput;