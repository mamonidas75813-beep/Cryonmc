import React, { createContext, useContext, useEffect, useState } from 'react';
import { CURRENCIES } from '../data/mockData';
import { CurrencyCode, CurrencyConfig } from '../types';

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (priceUSD: number, customPKR?: number, customINR?: number) => {
    amount: number;
    formatted: string;
    symbol: string;
    code: CurrencyCode;
  };
  availableCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('mc_store_currency');
    if (saved && saved in CURRENCIES) {
      return saved as CurrencyCode;
    }
    // Default to Indian Rupee (INR) on web join
    return 'INR';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('mc_store_currency', code);
  };

  const currencyConfig = CURRENCIES[currency] || CURRENCIES.INR;

  const convertPrice = (priceUSD: number, customPKR?: number, customINR?: number) => {
    if (currency === 'INR' && typeof customINR === 'number' && customINR > 0) {
      return {
        amount: customINR,
        formatted: `₹${Math.round(customINR).toLocaleString('en-IN')}`,
        symbol: '₹',
        code: 'INR' as CurrencyCode,
      };
    }
    if (currency === 'PKR' && typeof customPKR === 'number' && customPKR > 0) {
      return {
        amount: customPKR,
        formatted: `${Math.round(customPKR).toLocaleString('en-PK')} PKR`,
        symbol: 'PKR ',
        code: 'PKR' as CurrencyCode,
      };
    }
    const rate = currencyConfig.rateFromUSD;
    const amount = priceUSD * rate;
    return {
      amount,
      formatted: currencyConfig.format(amount),
      symbol: currencyConfig.symbol,
      code: currency,
    };
  };

  const availableCurrencies = Object.values(CURRENCIES);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig,
        setCurrency,
        convertPrice,
        availableCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
