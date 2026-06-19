import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function Generator({ addToHistory }) {
  const [text, setText]   = useState('');
  const [size, setSize]   = useState(256);
  const [fg, setFg]       = useState('#000000');
  const [bg, setBg]       = useState('#ffffff');
  const [level, setLevel] = useState('M');
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef(null);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setGenerated(true);
    addToHistory({ type: 'Generated', value: text, time: new Date().toLocaleString() });
  };

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-canvas canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Generate QR Code</h2>

      <div className="form-group">
        <label>Text or URL</label>
        <input
          className="input"
          type="text"
          placeholder="https://example.com"
          value={text}
          onChange={e => { setText(e.target.value); setGenerated(false); }}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Size (px)</label>
          <select className="input" value={size} onChange={e => setSize(Number(e.target.value))}>
            {[128, 192, 256, 320, 512].map(s => (
              <option key={s} value={s}>{s} × {s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Error Correction</label>
          <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Foreground</label>
          <div className="color-wrap">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
            <span>{fg}</span>
          </div>
        </div>
        <div className="form-group">
          <label>Background</label>
          <div className="color-wrap">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
            <span>{bg}</span>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleGenerate} disabled={!text.trim()}>
        Generate QR
      </button>

      {generated && text && (
        <div className="qr-output">
          <div id="qr-canvas" ref={canvasRef} className="qr-box">
            <QRCodeCanvas
              value={text}
              size={size}
              fgColor={fg}
              bgColor={bg}
              level={level}
              includeMargin
            />
          </div>
          <p className="qr-label">{text.length > 50 ? text.slice(0, 50) + '…' : text}</p>
          <button className="btn btn-secondary" onClick={handleDownload}>⬇ Download PNG</button>
        </div>
      )}
    </div>
  );
}