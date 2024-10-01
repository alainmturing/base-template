import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PasswordCriteria = ({ criteria }) => (
  <ul className="text-sm space-y-2">
    {Object.entries(criteria).map(([key, met]) => (
      <li key={key} className={`flex items-center space-x-2 ${met ? 'text-green-600' : 'text-red-600'}`}>
        <span>{met ? '✅' : '❌'}</span>
        <span>{key}</span>
      </li>
    ))}
  </ul>
);

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState({ value: 0, label: 'Weak' });
  const [criteria, setCriteria] = useState({
    'At least 8 characters': false,
    'Contains uppercase letters': false,
    'Contains lowercase letters': false,
    'Includes numbers': false,
    'Includes special characters': false,
  });

  useEffect(() => {
    let newStrength = { value: 0, label: 'Weak' };
    let newCriteria = { ...criteria };

    if (password.length === 0) {
      newStrength.value = 0;
    } else if (password.length > 0) {
      newStrength.value = 10; // Minimal value when password exists but is weak
    }

    if (password.length >= 8) {
      newStrength.value += 20;
      newCriteria['At least 8 characters'] = true;
    }
    if (/[A-Z]/.test(password)) {
      newStrength.value += 20;
      newCriteria['Contains uppercase letters'] = true;
    }
    if (/[a-z]/.test(password)) {
      newStrength.value += 20;
      newCriteria['Contains lowercase letters'] = true;
    }
    if (/[0-9]/.test(password)) {
      newStrength.value += 20;
      newCriteria['Includes numbers'] = true;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      newStrength.value += 20;
      newCriteria['Includes special characters'] = true;
    }

    if (newStrength.value >= 70) {
      newStrength.label = 'Strong';
    } else if (newStrength.value >= 40) {
      newStrength.label = 'Decent';
    }

    setStrength(newStrength);
    setCriteria(newCriteria);
  }, [password]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <Progress 
        value={strength.value} 
        className={`h-4 rounded-full ${password.length === 0 ? 'bg-red-500' : strength.label === 'Decent' ? 'bg-yellow-500' : strength.label === 'Strong' ? 'bg-green-500' : 'bg-gray-200'}`}
      />
      <div className="mt-4 text-center text-sm text-gray-600">
        Password Strength: <span className={`font-bold ${strength.label === 'Strong' ? 'text-green-600' : strength.label === 'Decent' ? 'text-yellow-600' : 'text-red-600'}`}>{strength.label}</span>
      </div>
      <PasswordCriteria criteria={criteria} />
    </div>
  );
};

export default function App() {
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Password Strength Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <PasswordStrengthMeter password={password} />
        </CardContent>
      </Card>
    </div>
  );
}