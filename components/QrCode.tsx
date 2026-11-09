'use client';

import { useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';

interface QrCodeProps {
  path: string;
  size?: number;
}

export default function QrCode({ path = '/fill/entrepreneurship', size = 220 }: QrCodeProps) {
  const [svg, setSvg] = useState<string | null>(null);

  const generate = useCallback(async () => {
    try {
      const value = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
      const data = await QRCode.toString(value, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      setSvg(data);
    } catch {
      setSvg(null);
    }
  }, [path, size]);

  useEffect(() => {
    generate();
  }, [generate]);

  if (!svg) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        border: '1px solid #dddddd',
        padding: 8,
        borderRadius: 8
      }}
    />
  );
}
