'use client';

import { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface SocialShareProps {
  path: string;
  title: string;
}

export default function SocialShare({ path = '/fill/entrepreneurship', title }: SocialShareProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(typeof window !== 'undefined' ? `${window.location.origin}${path}` : path);
  }, [path]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!shareUrl) return;
      try {
        const data = await QRCode.toString(shareUrl, {
          type: 'svg',
          width: 220,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        });
        if (active) setQrSvg(data);
      } catch {
        if (active) setQrSvg(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [shareUrl]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const share = useCallback(
    (platform: string) => {
      const shareUrls: Record<string, string> = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        instagram: `https://www.instagram.com`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        tiktok: `https://www.tiktok.com/upload?url=${encodeURIComponent(shareUrl)}`,
        twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`,
        sms: `sms:?body=${encodeURIComponent(`${title} ${shareUrl}`)}`
      };
      const target = shareUrls[platform];
      if (target) {
        window.open(target, '_blank', 'noopener,noreferrer');
      }
    },
    [title, shareUrl]
  );

  const icons: Record<string, string> = {
    whatsapp:
      '<path fill="#25D366" d="M16.75 1.75A15 15 0 0 0 1 .25c-.265 0-.52.033-.775.098l.002-.014c-.512.102-.993.31-1.406.698-.216.204-.403.44-.574.686-.821 1.23-.576 2.749.323 3.878l.006.007c.744.935.967 2.185.763 3.354-.171.988-.611 1.917-1.24 2.738-.557.731-1.186 1.398-1.964 2.037-.424.349-.868.677-1.425.894-.652.253-1.34.407-2.07.407H.25c-.414 0-.75.336-.75.75v15c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75c0-5.238-3.09-9.72-7.462-11.438.232-.487.5-.956.79-1.427a15 15 0 0 0 2.394-2.438c.47-.29.94-.558 1.427-.79 1.717-4.372 6.2-7.462 11.438-7.462 4.135 0 7.613 3.274 7.613 7.313 0 .684-.092 1.346-.258 1.982a.75.75 0 0 0 .209.938l.003.001a.7.7 0 0 0 .495.274l.002-.001c2.451.696 4.675 1.864 6.545 3.528.412.365.782.778 1.11 1.229a.75.75 0 0 0 1.196-.187l.005-.006c.761-1.029.991-2.282.797-3.517a16 16 0 0 0-.112-1.092c-.009-.134-.029-.266-.041-.398a6 6 0 0 0-.047-.34c-.01-.06-.027-.117-.039-.177a1 1 0 0 0-.039-.176c-.017-.08-.04-.155-.061-.233a1 1 0 0 0-.038-.154c-.026-.094-.058-.184-.092-.274a1 1 0 0 0-.042-.14c-.038-.118-.081-.232-.127-.344a1 1 0 0 0-.062-.172c-.048-.123-.101-.242-.157-.359a1 1 0 0 0-.073-.17c-.064-.131-.133-.257-.206-.378a1 1 0 0 0-.092-.16c-.082-.137-.17-.268-.262-.394a1 1 0 0 0-.113-.165c-.103-.136-.21-.265-.321-.389a1 1 0 0 0-.152-.168c-.12-.121-.245-.234-.373-.341a1 1 0 0 0-.174-.143c-.137-.102-.278-.196-.422-.283a1 1 0 0 0-.201-.122c-.15-.08-.303-.152-.459-.216a1 1 0 0 0-.23-.102c-.163-.063-.328-.117-.496-.162a1 1 0 0 0-.234-.075c-.182-.05-.366-.09-.552-.122a1 1 0 0 0-.255-.064c-.196-.04-.394-.07-.594-.09-.257-.026-.515-.041-.775-.041H1c-.414 0-.75.336-.75.75s.336.75.75.75h14.25a14.25 14.25 0 0 1 28.5 0c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"/></svg>',
    facebook:
      '<path fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.654 9.126 8.438 9.878v-6.987H5.625V9.25h2.813v2.812h4.313v3.093H9.25v-3.093c0-.751.027-1.484.234-2.255-.027-.24-.052-.482-.081-.724h-2.067v-2.813h2.067c.041-.9.457-1.82 1.377-2.297 1.012-.528 2.44-.821 4.174-.821 2.967 0 5.117 1.173 5.117 3.474v3.587h-2.23c-1.187 0-1.625.789-1.625 1.484v1.75h4.25l-.344 2.813z"/></svg>',
    instagram:
      '<path fill="#E1306C" d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.144 4.771 1.721 4.916 4.916.06 1.265.072 3.252.072 4.85s-.012 3.584-.072 4.85c-.144 3.252-1.721 4.771-4.916 4.916-1.266.06-3.253.072-4.85.072s-3.584-.012-4.85-.072-4.771-1.721-4.916-4.916c-.06-1.266-.072-3.253-.072-4.85s.012-3.584.072-4.85c.144-3.252 1.721-4.771 4.916-4.916 1.265-.06 3.252-.072 4.85-.072m0-2.163C5.093 0 0 5.093 0 11.382S5.093 22.764 11.382 22.764 22.764 17.672 22.764 11.382 17.672 0 11.382 0zm0 1.942c-5.188 0-9.44 4.252-9.44 9.44s4.252 9.44 9.44 9.44 9.44-4.252 9.44-9.44-4.252-9.44-9.44-9.44zm0 8.06a1.942 1.942 0 1 1 0-3.884 1.942 1.942 0 0 1 0 3.884m7.465-.197c.79.002 1.533.196 2.086.568.437.292.829.682 1.12 1.12.372.553.566 1.296.568 2.087.002.79-.196 1.533-.568 2.086-.292.437-.682.829-1.12 1.12-.553.372-1.296.566-2.087.568-.79-.002-1.533-.196-2.086-.568-.437-.292-.829-.682-1.12-1.12-.372-.553-.566-1.296-.568-2.087-.002-.79.196-1.533.568-2.086.292-.437.682-.829 1.12-1.12.552-.372 1.296-.566 2.087-.568z"/></svg>',
    linkedin:
      '<path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-5.649-9.015h-1.786v-1.918c0-1.179-.91-2.136-2.031-2.136-2.03 0-2.135 1.006-2.135 2.136v1.918H6.25v-7.376h1.956c.041 0 .077.004.118.013.337.077.697.171 1.071.29h.045v3.784h-.001c-.187 1.24-.855 2.385-2.03 2.792zm12.945 9.015h-3.553v-5.568c0-1.329-.026-3.038-1.852-3.038-1.853 0-2.135 1.446-2.135 2.939v5.668H19.25v-6.948c0-2.759 1.445-4.954 4.196-4.954 2.752 0 4.266 2.194 4.266 4.95v6.949z"/></svg>',
    tiktok:
      '<path fill="#FE2C55" d="M12 0C5.374 0 0 5.373 0 12c0 6.075 4.661 11.085 10.671 11.927C21.681 23.756 24 18.58 24 12 24 5.373 18.627 0 12 0m0 1.5a1.501 1.501 0 1 0 0 3.002 1.501 1.501 0 0 0 0-3.002M4.188 19.061A10.43 10.43 0 0 1 2.439 12c0-4.963 3.436-9.085 8-10.174A1.5 1.5 0 0 0 9.519 1.5a1.5 1.5 0 0 0 1.481-1.402 9.97 9.97 0 0 1 2.72-1.028C17.221.049 19.542 0 22 0c6.617 0 12 5.383 12 12s-5.383 12-12 12c-4.312 0-8.012-2.22-9.994-5.457a11.5 11.5 0 0 1-2.106.986 10.35 10.35 0 0 1-5.712-1.482M22 5.67c-.776 0-1.457.486-1.743 1.227l-1.096-1.69A9.5 9.5 0 0 0 17.186 3a9.55 9.55 0 0 0-5.186 1.417C9.885 2.271 8.021 1.5 6 1.5c-1.655 0-3.104.664-4.22 1.74a11 11 0 0 0-1.535-.44C-.372 3.048 0 6.401 0 12c0 1.021.137 2.012.405 2.959a10.5 10.5 0 0 0-1.475-.055C1.521 14.445 3.51 16 5.885 16c4.237 0 7.978-2.342 9.713-5.932a11.16 11.16 0 0 1 1.732-2.387 11.7 11.7 0 0 1-.019-1.39c0-5.523 4.477-10 10-10 .724 0 1.423.08 2.099.22l-1.315 1.754c-.458-.088-.92-.136-1.392-.136z"/></svg>',
    twitter:
      '<path fill="#000000" d="M23.271 4.527c-.856.37-1.775.62-2.725.735.987-.592 1.648-1.524 1.857-2.62-.927.55-1.944.9-2.987 1.012-.874-.933-2.122-1.514-3.454-1.514-2.612 0-4.731 2.119-4.731 4.732 0 .37.042.732.118 1.085-3.929-.198-7.409-2.077-9.94-4.928-.407.697-.633 1.502-.633 2.365 0 1.642.839 3.094 2.108 3.947-.779-.025-1.511-.24-2.183-.604v.062c0 2.293 1.632 4.202 3.807 4.633-.398.108-.82.165-1.248.165-.306 0-.605-.027-.9-.076c.42 1.31 1.637 2.264 3.065 2.289-1.616 1.263-3.644 2.014-5.845 2.014-.38 0-.756-.025-1.13-.075c.545 1.687 1.684 2.913 3.015 2.947-1.612 1.265-3.632 2.015-5.838 2.015-.38 0-.756-.025-1.13-.075-.277 1.043-.43 2.138-.43 3.273 0 3.59 2.562 6.573 5.95 6.573-2.533.199-4.79-.843-6.392-2.117.83 2.625 3.238 4.538 6.092 4.594-2.542 1.993-5.743 3.18-9.213 3.18-.597 0-1.187-.034-1.776-.098 2.512 1.617 5.485 2.502 8.635 2.502 10.373 0 16.038-8.595 16.038-16.039 0-.245-.007-.487-.015-.73 1.389-.796 2.607-1.796 3.669-2.957"/></svg>',
    email:
      '<path fill="#666666" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0L12 10l-6 4zm0 2 6 4 6-4z"/></svg>',
    sms:
      '<path fill="#333333" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    copy:
      '<path fill="#333333" d="M16 1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 2h8c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H18c-1.1 0-2-.9-2-2V3c0-1.1-.9-2-2-2m-7 0c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V3c0-1.1-.9-2-2-2z"/></svg>'
  };

  const labels: Record<string, string> = {
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    twitter: 'Twitter / X',
    email: 'Email',
    sms: 'SMS',
    copy: copied ? 'Copied!' : 'Copy link'
  };

  const order = ['whatsapp', 'facebook', 'instagram', 'linkedin', 'tiktok', 'twitter', 'email', 'sms', 'copy'];

  return (
    <div className="card share-card">
      <h3 className="section-title">Share this questionnaire</h3>
      <p className="muted">Scan the QR code or share the link to open the questionnaire directly.</p>

      <div className="share-qr">
        {qrSvg ? (
          <div
            dangerouslySetInnerHTML={{ __html: qrSvg }}
            style={{
              width: 220,
              height: 220,
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        ) : null}
      </div>

      <div className="share-grid">
        {order.map((platform) => (
          <button
            key={platform}
            className="share-btn"
            onClick={() => (platform === 'copy' ? handleCopy() : share(platform))}
          >
            <span className="share-icon" dangerouslySetInnerHTML={{ __html: icons[platform] }} />
            <span>{labels[platform]}</span>
          </button>
        ))}
      </div>

      <input
        readOnly
        className="share-link-input"
        value={shareUrl}
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
}
