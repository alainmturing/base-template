import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const PasswordStrengthMeter = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Weak',
    color: 'bg-red-500',
  });
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[^A-Za-z0-9]/.test(password);

    setCriteria({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    });

    const score = [length, uppercase, lowercase, number, specialChar].filter(Boolean).length;

    if (password.length === 0) {
      setStrength({ score: 0, label: 'Weak', color: 'bg-red-500' });
    } else if (score <= 2) {
      setStrength({ score, label: 'Weak', color: 'bg-red-500' });
    } else if (score === 3 || score === 4) {
      setStrength({ score, label: 'Decent', color: 'bg-yellow-500' });
    } else {
      setStrength({ score, label: 'Strong', color: 'bg-green-500' });
    }
  }, [password]);

  const getProgressSections = () => {
    const sections = [];
    const totalCriteria = Object.values(criteria).filter(Boolean).length;

    if (password.length === 0) {
      return [<div key="empty" className="h-full w-full bg-red-500"></div>];
    }

    for (let i = 0; i < 5; i++) {
      if (i < totalCriteria) {
        sections.push(
          <div
            key={i}
            className={`h-full w-1/5 ${strength.color} transition-all duration-300 ease-in-out`}
          ></div>
        );
      } else {
        sections.push(
          <div
            key={i}
            className="h-full w-1/5 bg-gray-300 transition-all duration-300 ease-in-out"
          ></div>
        );
      }
    }

    return sections;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Password Strength Meter</CardTitle>
          <CardDescription>Enter your password to see its strength</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <div className="h-4 w-full bg-gray-200 rounded overflow-hidden flex">
              {getProgressSections()}
            </div>
            <span className="text-sm mt-1 block text-gray-700">{strength.label}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Improve Your Password</h3>
            <ul className="list-disc list-inside space-y-1">
              <li className={criteria.length ? 'text-green-600' : 'text-red-600'}>
                At least 8 characters
              </li>
              <li className={criteria.uppercase ? 'text-green-600' : 'text-red-600'}>
                Contains uppercase letters
              </li>
              <li className={criteria.lowercase ? 'text-green-600' : 'text-red-600'}>
                Contains lowercase letters
              </li>
              <li className={criteria.number ? 'text-green-600' : 'text-red-600'}>
                Includes numbers
              </li>
              <li className={criteria.specialChar ? 'text-green-600' : 'text-red-600'}>
                Includes special characters
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <span className="text-sm text-gray-500">
            Password strength evaluated based on common security standards.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordStrengthMeter;