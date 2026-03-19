import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '内申点シミュレーター | My Naishin';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '32px',
            padding: '60px 80px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.25)',
              marginBottom: '32px',
              fontSize: '56px',
            }}
          >
            ✦
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            My Naishin
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.9)',
              marginTop: '16px',
              textAlign: 'center',
            }}
          >
            内申点シミュレーター
          </div>
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.7)',
              marginTop: '12px',
              textAlign: 'center',
            }}
          >
            全国47都道府県対応 | 無料・登録不要
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
