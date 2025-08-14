
export type EmergencyAnalysisInput = {
  transcript?: string;
  location?: { type: 'Point'; coordinates: [number, number] };
};

export type EmergencyAnalysis = {
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  detectedKeywords: string[];
  recommendations: string[];
  needCallEmergency?: boolean;
};

// 占位分析：在未配置外部AI Key时，使用简单规则
export async function analyzeEmergency(input: EmergencyAnalysisInput): Promise<EmergencyAnalysis> {
  const text = (input.transcript || '').toLowerCase();
  const keywords = ['help', '救命', '跌倒', '心脏', '疼', '疼痛', '流血', '头晕', '呼吸'];
  const hit = keywords.filter(k => text.includes(k));

  let risk: EmergencyAnalysis['riskLevel'] = 'medium';
  if (hit.length >= 2) risk = 'high';
  if (hit.length === 0 && text.length < 4) risk = 'medium'; // 信息不足默认中等

  const recs: string[] = [];
  if (risk === 'high') {
    recs.push('建议立即联系家属并考虑拨打急救电话');
  } else {
    recs.push('建议尽快联系家属确认情况');
  }
  if (input.location?.coordinates) {
    recs.push('已记录位置信息，便于快速定位');
  }

  return {
    riskLevel: risk,
    summary: hit.length ? `检测到可能的紧急关键词：${hit.join('、')}` : '已记录紧急请求，等待进一步确认',
    detectedKeywords: hit,
    recommendations: recs,
    needCallEmergency: risk === 'high',
  };
}


