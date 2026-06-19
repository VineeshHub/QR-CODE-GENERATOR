import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Scanner({ addToHistory }) {
  const [result, setResult] = useState('');
  const [error, setError]   = useState('');
  const [active, setActive] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = () => {
    setResult('');
    setError('');
    setActive(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setActive(false);
  };

  useEffect(() => {
    if (!active) return;

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    }, false);

    scanner.render(
      (decodedText) => {
        setResult(decodedText);
        addToHistory({ type: 'Scanned', value: decodedText, time: new Date().toLocaleString() });
        scanner.clear().catch(() => {});
        scannerRef.current = null;
        setActive(false);
      },
      (err) => {
        // suppress repetitive "not found" errors
      }
    );

    scannerRef.current = scanner;
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [active]);

  const isURL = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Scan QR Code</h2>

      {!active && !result && (
        <div className="scan-idle">
          <div className="scan-icon">📷</div>
          <p>Point your camera at a QR code</p>
          <button className="btn btn-primary" onClick={startScanner}>Start Camera</button>
        </div>
      )}

      {active && (
        <div>
          <div id="qr-reader" className="qr-reader-box" />
          <button className="btn btn-danger" onClick={stopScanner}>✕ Stop Scanning</button>
        </div>
      )}

      {result && (
        <div className="scan-result">
          <div className="result-badge">✅ Scanned Successfully</div>
          <div className="result-value">{result}</div>
          {isURL(result) && (
            <a href={result} target="_blank" rel="noreferrer" className="btn btn-secondary">
              🔗 Open Link
            </a>
          )}
          <button className="btn btn-outline" onClick={() => { setResult(''); }}>Scan Another</button>
        </div>
      )}
    </div>
  );
}