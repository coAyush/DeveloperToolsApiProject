import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, RefreshCcw, Image as ImageIcon } from "lucide-react";

const PRESETS = [
  { name: "Square • 1:1 (800×800)", w: 800, h: 800 },
  { name: "Widescreen • 16:9 (1280×720)", w: 1280, h: 720 },
  { name: "Classic • 4:3 (1024×768)", w: 1024, h: 768 },
  { name: "Photo • 3:2 (1200×800)", w: 1200, h: 800 },
  { name: "Story • 9:16 (1080×1920)", w: 1080, h: 1920 },
];

const swatches = [
  "#0ea5e9",
  "#38bdf8",
  "#111827",
  "#1f2937",
  "#374151",
  "#6b7280",
  "#e5e7eb",
  "#f3f4f6",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#8b5cf6",
];

export default function ImagePlaceholder() {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(675);
  const [bg, setBg] = useState("#f3f4f6");
  const [fg, setFg] = useState("#111827");
  const [text, setText] = useState("1200 × 675");
  const [fontSize, setFontSize] = useState(64);
  const [radius, setRadius] = useState(24);
  const [format, setFormat] = useState("png"); // png or jpeg
  const [density, setDensity] = useState(1); // export scale
  const canvasRef = useRef(null);

  // keep text in sync with current size if user hasn't customized it
  useEffect(() => {
    if (/^\d+\s×\s\d+$/.test(text)) setText(`${width} × ${height}`);
  }, [width, height]); // eslint-disable-line

  const safeName = useMemo(() => {
    return `placeholder-${width}x${height}.${format}`;
  }, [width, height, format]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = Math.max(1, density);

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // background with radius
    const r = Math.min(radius, Math.min(width, height) / 2);
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, width, height, r);
    ctx.fill();

    // text
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter`;
    // Auto-shrink if text overflows
    let f = fontSize;
    while (ctx.measureText(text).width > width * 0.9 && f > 8) {
      f -= 2;
      ctx.font = `600 ${f}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter`;
    }
    ctx.fillText(text, width / 2, height / 2);
  };

  useEffect(draw, [width, height, bg, fg, text, fontSize, radius, density]);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const handlePreset = (p) => {
    setWidth(p.w);
    setHeight(p.h);
  };

  const randomize = () => {
    const p = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    const nb = swatches[Math.floor(Math.random() * swatches.length)];
    const nf = swatches[Math.floor(Math.random() * swatches.length)];
    handlePreset(p);
    setBg(nb);
    setFg(nf === nb ? "#111827" : nf);
  };

  const download = () => {
    const a = document.createElement("a");
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const quality = format === "jpeg" ? 0.92 : 1;
    a.href = canvasRef.current.toDataURL(mime, quality);
    a.download = safeName;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 px-6 py-24 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-6xl w-full mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          Image Placeholder
        </h1>
        <p className="text-gray-700 mt-3">
          Generate beautiful placeholder images with custom size, colors, text,
          and radius — all client-side.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ImageIcon size={22} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Settings</h2>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(1, +e.target.value || 1))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(1, +e.target.value || 1))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Presets</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePreset(p)}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Background</label>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {swatches.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBg(c)}
                    className="w-6 h-6 rounded-md border border-gray-200"
                    style={{ background: c }}
                    aria-label={`bg ${c}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Text Color</label>
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg cursor-pointer border border-gray-200"
              />
            </div>
          </div>

          {/* Text */}
          <div className="mt-6">
            <label className="text-sm text-gray-600">Overlay Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 1200 × 675"
            />
          </div>

          {/* Font & Radius */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Font Size</label>
              <input
                type="range"
                min={8}
                max={160}
                value={fontSize}
                onChange={(e) => setFontSize(+e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-500">{fontSize}px</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Corner Radius</label>
              <input
                type="range"
                min={0}
                max={120}
                value={radius}
                onChange={(e) => setRadius(+e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-500">{radius}px</div>
            </div>
          </div>

          {/* Export */}
          <div className="mt-6 grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-sm text-gray-600">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Export Scale</label>
              <select
                value={density}
                onChange={(e) => setDensity(+e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={3}>3×</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={randomize}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                title="Randomize"
              >
                <RefreshCcw size={16} />
                Random
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={download}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2"
            >
              <Download size={18} />
              Download {safeName}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Preview</h2>
            <div className="text-sm text-gray-600">
              {width}×{height} @ {density}×
            </div>
          </div>
          <div className="grow w-full overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto block mx-auto rounded-xl shadow-sm"
              style={{ background: "transparent" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
