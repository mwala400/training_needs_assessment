'use client';

import Link from 'next/link';
import { getDef } from '@/lib/questionnaires/definitions';
import QrCode from '@/components/QrCode';
import { useEffect, useState } from 'react';

const def = getDef('entrepreneurship');

export default function HomePage() {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/fill/${def!.slug}`);
  }, []);

  return (
    <main className="container">
      <div className="card">
        <h1 className="section-title">ARUSHA TECHNICAL COLLEGE</h1>
        <p className="muted">Entrepreneurship Centre — Training Needs Assessment Questionnaire</p>
        <p>
          The Entrepreneurship Centre at Arusha Technical College plans to offer practical short courses
          to help people start, run and grow their own businesses. This questionnaire will help us
          understand what you want to learn, so that we can design courses that meet your needs.
        </p>
        <p className="muted">
          It takes about 10 minutes to complete. Your answers are confidential and used only to plan training.
        </p>
        <div className="btn-row">
          <Link className="btn" href={`/fill/${def!.slug}`}>
            Fill the Entrepreneurship Centre Questionnaire
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Share this questionnaire</h3>
        <p className="muted">Scan the QR code or copy the link to open the questionnaire directly.</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <QrCode path={`/fill/${def!.slug}`} size={240} />
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="muted" style={{ fontSize: 12, wordBreak: 'break-all', maxWidth: 300 }}>
              {shareUrl || '…'}
            </span>
            <button
              className="btn ghost"
              onClick={() => {
                if (!shareUrl) return;
                navigator.clipboard?.writeText(shareUrl);
              }}
            >
              Copy link
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Global Analysis</h3>
        <p className="muted">View aggregated results for the Entrepreneurship Centre questionnaire.</p>
        <Link className="btn secondary" href="/analysis?type=entrepreneurship">
          View Global Analysis
        </Link>
      </div>
    </main>
  );
}
