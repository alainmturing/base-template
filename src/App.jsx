import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Utility function to convert hex to RGB
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Color harmony functions
const generateHarmony = (baseColor, type) => {
  const { r, g, b } = hexToRgb(baseColor);
  let colors = [];

  switch(type) {
    case 'complementary':
      colors = [{ r: 255 - r, g: 255 - g, b: 255 - b }];
      break;
    // Implement other harmony types similarly
    default:
      colors = [{ r, g, b }]; // Default to base color
  }

  return colors.map(color => 
    `#${((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)}`
  );
};

function ColorSchemeGenerator() {
  const [baseColor, setBaseColor] = useState("#FF5733");
  const [harmonyType, setHarmonyType] = useState('complementary');
  const [colors, setColors] = useState([]);
  
  useEffect(() => {
    setColors(generateHarmony(baseColor, harmonyType));
  }, [baseColor, harmonyType]);

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      alert('Color copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <Card className="w-full max-w-md p-4 sm:p-8">
        <CardHeader>
          <CardTitle>Color Scheme Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <input 
            type="color" 
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-full mb-4"
          />
          <select 
            value={harmonyType} 
            onChange={(e) => setHarmonyType(e.target.value)}
            className="mb-4 p-2 border rounded"
          >
            {['complementary', 'analogous', 'triadic'].map(type => 
              <option key={type} value={type}>{type}</option>
            )}
          </select>
          <div className="flex space-x-2 overflow-x-auto">
            {colors.map((color, idx) => (
              <div 
                key={idx} 
                style={{ backgroundColor: color }}
                className="h-24 w-24 flex-shrink-0 rounded cursor-pointer hover:scale-105 transition-transform"
                onClick={() => copyToClipboard(color)}
                title="Click to copy"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <ColorSchemeGenerator />;
}