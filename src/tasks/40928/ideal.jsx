import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

function App() {
  const [baseColor, setBaseColor] = useState('#3490dc');
  const [harmonyRule, setHarmonyRule] = useState('Complementary');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [generatedPalette, setGeneratedPalette] = useState([]);
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    generatePalette();
  }, [baseColor, harmonyRule, hue, saturation, brightness]);

  useEffect(() => {
    if (copiedColor) {
      const timer = setTimeout(() => {
        setCopiedColor(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedColor]);

  const generatePalette = () => {
    const baseHSL = hexToHSL(baseColor);
    let colors = [];

    switch (harmonyRule) {
      case 'Complementary':
        colors = getComplementary(baseHSL);
        break;
      case 'Analogous':
        colors = getAnalogous(baseHSL);
        break;
      case 'Triadic':
        colors = getTriadic(baseHSL);
        break;
      case 'Tetradic':
        colors = getTetradic(baseHSL);
        break;
      case 'Monochromatic':
        colors = getMonochromatic(baseHSL);
        break;
      case 'Split-complementary':
        colors = getSplitComplementary(baseHSL);
        break;
      default:
        colors = [baseColor];
    }

    // Apply adjustments
    const adjustedColors = colors.map((color) => {
      const hsl = hexToHSL(color);
      hsl.h = (hsl.h + hue + 360) % 360;
      hsl.s = clamp(hsl.s + saturation, 0, 100);
      hsl.l = clamp(hsl.l + brightness, 0, 100);
      return HSLToHex(hsl);
    });

    setGeneratedPalette(adjustedColors);
  };

  // Color Harmony Functions
  const getComplementary = (hsl) => {
    const complementaryHue = (hsl.h + 180) % 360;
    return [
      HSLToHex(hsl),
      HSLToHex({ ...hsl, h: complementaryHue }),
    ];
  };

  const getAnalogous = (hsl) => {
    const angle = 30;
    return [
      HSLToHex({ ...hsl, h: (hsl.h - angle + 360) % 360 }),
      HSLToHex(hsl),
      HSLToHex({ ...hsl, h: (hsl.h + angle) % 360 }),
    ];
  };

  const getTriadic = (hsl) => {
    return [
      HSLToHex(hsl),
      HSLToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
      HSLToHex({ ...hsl, h: (hsl.h + 240) % 360 }),
    ];
  };

  const getTetradic = (hsl) => {
    return [
      HSLToHex(hsl),
      HSLToHex({ ...hsl, h: (hsl.h + 90) % 360 }),
      HSLToHex({ ...hsl, h: (hsl.h + 180) % 360 }),
      HSLToHex({ ...hsl, h: (hsl.h + 270) % 360 }),
    ];
  };

  const getMonochromatic = (hsl) => {
    return [
      HSLToHex({ ...hsl, l: clamp(hsl.l - 30, 0, 100) }),
      HSLToHex({ ...hsl, l: clamp(hsl.l - 15, 0, 100) }),
      HSLToHex(hsl),
      HSLToHex({ ...hsl, l: clamp(hsl.l + 15, 0, 100) }),
      HSLToHex({ ...hsl, l: clamp(hsl.l + 30, 0, 100) }),
    ];
  };

  const getSplitComplementary = (hsl) => {
    return [
      HSLToHex(hsl),
      HSLToHex({ ...hsl, h: (hsl.h + 150) % 360 }),
      HSLToHex({ ...hsl, h: (hsl.h + 210) % 360 }),
    ];
  };

  // Utility function to clamp values
  const clamp = (value, min, max) => {
    return Math.min(max, Math.max(min, value));
  };

  // Color Conversion Functions
  const hexToHSL = (H) => {
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
      r = parseInt(H[1] + H[1], 16);
      g = parseInt(H[2] + H[2], 16);
      b = parseInt(H[3] + H[3], 16);
    } else if (H.length === 7) {
      r = parseInt(H[1] + H[2], 16);
      g = parseInt(H[3] + H[4], 16);
      b = parseInt(H[5] + H[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  };

  const HSLToHex = ({ h, s, l }) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };

  const handleColorInputChange = (e) => {
    setBaseColor(e.target.value);
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold">Color Scheme Generator</CardTitle>
          <p className="text-sm opacity-80">
            Create harmonious color palettes for your designs with ease.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Base Color Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="w-full sm:w-1/3 font-medium text-gray-700">Base Color:</label>
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={baseColor}
                onChange={handleColorInputChange}
                placeholder="#3490dc"
                className="flex-1"
              />
            </div>
          </div>

          {/* Harmony Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="w-full sm:w-1/3 font-medium text-gray-700">Color Harmony:</label>
            <Select
              value={harmonyRule}
              onValueChange={(value) => setHarmonyRule(value)}
              className="w-full sm:w-2/3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select harmony" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Complementary">Complementary (2 colors)</SelectItem>
                <SelectItem value="Analogous">Analogous (3 colors)</SelectItem>
                <SelectItem value="Triadic">Triadic (3 colors)</SelectItem>
                <SelectItem value="Tetradic">Tetradic (4 colors)</SelectItem>
                <SelectItem value="Monochromatic">Monochromatic (5 colors)</SelectItem>
                <SelectItem value="Split-complementary">
                  Split-complementary (3 colors)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Adjustments */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Hue Adjustment:</label>
              <Slider
                value={[hue]}
                onValueChange={(val) => setHue(val[0])}
                max={360}
                step={1}
                className="my-2"
              />
              <span className="text-sm text-gray-600">{hue}°</span>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Saturation Adjustment:</label>
              <Slider
                value={[saturation]}
                onValueChange={(val) => setSaturation(val[0])}
                min={-100}
                max={100}
                step={1}
                className="my-2"
              />
              <span className="text-sm text-gray-600">{saturation}%</span>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Brightness Adjustment:</label>
              <Slider
                value={[brightness]}
                onValueChange={(val) => setBrightness(val[0])}
                min={-100}
                max={100}
                step={1}
                className="my-2"
              />
              <span className="text-sm text-gray-600">{brightness}%</span>
            </div>
          </div>

          {/* Generated Palette */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Generated Palette:</label>
            <div className="flex flex-wrap gap-4">
              {generatedPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-24 h-24 rounded-lg shadow-md flex flex-col justify-end items-center p-2 transition-transform hover:scale-105 cursor-pointer relative"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                    {copiedColor === color ? 'Copied!' : 'Click to copy'}
                  </div>
                  <span className="text-white text-xs bg-black bg-opacity-50 rounded px-1 py-0.5">
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;