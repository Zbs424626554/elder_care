import { useRef, useState } from 'react';
import { Toast } from 'antd-mobile';
import { PhoneFill } from 'antd-mobile-icons';
import { speak } from '../utils/tts';
import { MicRecorder, blobToBase64 } from '../utils/recorder';
import { getCurrentGeoPoint } from '../utils/location';
import * as emergency from '../services/emergency';

export default function EmergencyCall() {
  const recorderRef = useRef<MicRecorder | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [alertId, setAlertId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const start = async () => {
    const res = await emergency.initiate();
    const id = res.alertId;
    setAlertId(id);
    recorderRef.current = new MicRecorder();
    await recorderRef.current.start();
    speak('将在五秒后给紧急联系人打电话');
    setCountdown(5);
    if (timerRef.current) window.clearInterval(timerRef.current);
    const t = window.setInterval(() => {
      setCountdown(prev => {
        if ((prev ?? 0) <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          confirmCall().catch(console.error);
          return null;
        }
        return (prev as number) - 1;
      });
    }, 1000);
    timerRef.current = t as unknown as number;
  };

  const cancel = async () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (alertId) await emergency.cancel(alertId);
    if (recorderRef.current) {
      try { await recorderRef.current.stop(); } catch { }
    }
    Toast.show({ content: '已取消' });
    setAlertId(null);
    setCountdown(null);
  };

  const confirmCall = async () => {
    try {
      const blob = await recorderRef.current!.stop();
      const base64 = await blobToBase64(blob);
      if (alertId) await emergency.uploadAudioBase64(alertId, base64);
      const location = await getCurrentGeoPoint();
      if (alertId) await emergency.commit(alertId, { location });
      Toast.show({ content: '已通知紧急联系人' });
    } catch (e) {
      Toast.show({ content: '操作失败' });
    } finally {
      setAlertId(null);
      setCountdown(null);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <div style={{ padding: '0.24rem', width: '100%' }}>
      <div style={{ textAlign: 'center', fontSize: '0.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>紧急呼叫</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 外环光晕 */}
        <div
          onClick={() => (countdown === null ? start() : cancel())}
          style={{
            width: '6.2rem',
            height: '6.2rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,76,61,0.2) 100%)',
            boxShadow: '0 0 0.24rem rgba(255,255,255,0.95), 0 0 0.6rem rgba(243,67,61,0.45), 0 0 1rem rgba(243,67,61,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {/* 内部红色圆 */}
          <div
            style={{
              width: '5.2rem',
              height: '5.2rem',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #f3433d 0%, #d9363e 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '0.12rem',
              fontWeight: 800,
              textShadow: '0 0 0.06rem rgba(0,0,0,0.15)'
            }}
            aria-label="一键呼叫"
          >
            <div style={{ lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneFill style={{ fontSize: '2.5rem' }} />
            </div>
            <div style={{ fontSize: '0.48rem' }}>{countdown === null ? '一键呼叫' : '取消'}</div>
          </div>
        </div>
      </div>

      {countdown !== null && (
        <div style={{ marginTop: '0.4rem', fontSize: '0.34rem', textAlign: 'center', color: '#f3433d', fontWeight: 700 }}>
          将在 {countdown} 秒后呼叫，正在录音…
        </div>
      )}

      {/* 单一主按钮已集成到圆形按钮点击 */}
    </div>
  );
}

