import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
//SelectContent added by trainer, model failed to wrap the content of the Select in it and was throwing an error
import { Select, SelectItem, SelectContent } from "@/components/ui/select";

const harmonyRules = {
  complementary: 2,
  analogous: 3,
  triadic: 3,
  tetradic: 4,
  monochromatic: 5,
  splitComplementary: 3,
};

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255,
      g = parseInt(hex.slice(3,5),16)/255,
      b = parseInt(hex.slice(5,7),16)/255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function generateColors(baseHsl, rule, adjustments) {
  const [h, s, l] = baseHsl;
  let colors = [baseHsl];
  const angle = 360 / harmonyRules[rule];
  
  for(let i = 1; i < harmonyRules[rule]; i++) {
    let newH = (h + angle * i) % 360;
    colors.push([(newH + adjustments.hue) % 360, s + adjustments.saturation, l + adjustments.brightness]);
  }
  
  return colors.map(hsl => hslToHex(...hsl.map(v => Math.round(v))));
}

export default function App() {
  const [baseColor, setBaseColor] = useState('#007BFF');
  const [harmony, setHarmony] = useState('complementary');
  const [adjustments, setAdjustments] = useState({hue: 0, saturation: 0, brightness: 0});
  const [generatedColors, setGeneratedColors] = useState([]);

  useEffect(() => {
    const baseHsl = hexToHsl(baseColor);
    setGeneratedColors(generateColors(baseHsl, harmony, adjustments));
  }, [baseColor, harmony, adjustments]);

  const handleColorChange = (e) => {
    setBaseColor(e.target.value);
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      alert(`Color ${color} copied to clipboard!`);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
      <Card className="w-full max-w-lg p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Color Scheme Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            type="color" 
            value={baseColor} 
            onChange={handleColorChange} 
            className="mb-4 w-full"
            label="Base Color"
          />
          <Select value={harmony} onChange={(e) => setHarmony(e.target.value)} className="mb-4">
            <SelectContent>
              {Object.keys(harmonyRules).map(rule => 
                <SelectItem key={rule} value={rule}>{rule.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <Slider defaultValue={[0]} max={360} onValueChange={(value) => setAdjustments(prev => ({...prev, hue: value[0]}))} />
            <Slider defaultValue={[0]} max={100} onValueChange={(value) => setAdjustments(prev => ({...prev, saturation: value[0]}))} />
            <Slider defaultValue={[0]} max={100} onValueChange={(value) => setAdjustments(prev => ({...prev, brightness: value[0]}))} />
          </div>
          <div className="flex flex-wrap mt-4">
            {generatedColors.map((color, idx) => (
              <div 
                key={idx} 
                className="h-20 w-20 cursor-pointer hover:scale-105 transition-transform" 
                style={{backgroundColor: color}} 
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