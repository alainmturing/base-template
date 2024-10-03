import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const PasswordStrengthMeter = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Weak',
    color: 'bg-red-500'
  });

  const [criteria, setCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const analyzePassword = () => {
      let score = 0;
      const newCriteria = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      };

      // Update criteria state
      setCriteria(newCriteria);

      // Calculate score
      score += newCriteria.length ? 1 : 0;
      score += newCriteria.upper ? 1 : 0;
      score += newCriteria.lower ? 1 : 0;
      score += newCriteria.number ? 1 : 0;
      score += newCriteria.special ? 1 : 0;

      // Determine strength label and color
      if (score === 0 && password === '') {
        setStrength({ score: 0, label: 'Weak', color: 'bg-red-500' });
      } else if (score <= 2) {
        setStrength({ score: 33, label: 'Weak', color: 'bg-red-500' });
      } else if (score <= 4) {
        setStrength({ score: 66, label: 'Decent', color: 'bg-yellow-500' });
      } else {
        setStrength({ score: 100, label: 'Strong', color: 'bg-green-500' });
      }
    };

    analyzePassword();
  }, [password]);

  const Criterion = ({ met, children }) => (
    <p className={`text-sm ${met ? 'text-green-600' : 'text-red-600'}`}>
      {children}
    </p>
  );

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Strength Meter</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            type="text" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
            className="mb-4"
          />
          <Progress value={strength.score} className={`h-4 rounded-full ${strength.color}`} />
          <div className="mt-4 space-y-2">
            <Criterion met={criteria.length}>At least 8 characters</Criterion>
            <Criterion met={criteria.upper}>Contains uppercase letters</Criterion>
            <Criterion met={criteria.lower}>Contains lowercase letters</Criterion>
            <Criterion met={criteria.number}>Includes numbers</Criterion>
            <Criterion met={criteria.special}>Includes special characters</Criterion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <PasswordStrengthMeter />;
}