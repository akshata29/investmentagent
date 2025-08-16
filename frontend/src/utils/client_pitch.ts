export interface SentimentData {
  rolling?: { overall?: { sentiment?: string } };
}

export interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export const extractClientInfo = (text: string): ClientInfo => {
  const t = text || '';
  // Name patterns (simple heuristics)
  const namePatterns = [
    /\bmy name is\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,
    /\bthis is\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,
    /\bi am\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,
    /\bI'm\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,
  ];
  let name: string | undefined;
  for (const re of namePatterns) {
    const m = t.match(re);
    if (m && m[1]) { name = m[1].trim(); break; }
  }
  const email = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = t.match(/(?:\+?\d{1,2}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/)?.[0];
  const location = t.match(/\b(?:from|in)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/)?.[1];
  return { name, email, phone, location };
};

export const generateClientPitch = (params: {
  conversationText: string;
  recommendation: string;
  sentimentData?: SentimentData;
  clientName?: string;
}): string => {
  const { conversationText, recommendation, sentimentData, clientName } = params;
  const info = extractClientInfo(conversationText);
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Analyze conversation for key points
  const conversationLower = conversationText?.toLowerCase() || '';
  const financialGoals: string[] = [];
  const riskProfile: string[] = [];
  const timeframe: string[] = [];
  if (conversationLower.includes('retirement')) financialGoals.push('Retirement Planning');
  if (conversationLower.includes('college') || conversationLower.includes('education')) financialGoals.push('Education Funding');
  if (conversationLower.includes('house') || conversationLower.includes('home')) financialGoals.push('Home Purchase');
  if (conversationLower.includes('emergency')) financialGoals.push('Emergency Fund');
  if (conversationLower.includes('conservative') || conversationLower.includes('safe')) riskProfile.push('Conservative approach preferred');
  if (conversationLower.includes('aggressive') || conversationLower.includes('growth')) riskProfile.push('Growth-oriented strategy');
  if (conversationLower.includes('diversify')) riskProfile.push('Diversification focused');
  if (conversationLower.includes('short term') || conversationLower.includes('soon')) timeframe.push('Short-term objectives');
  if (conversationLower.includes('long term') || conversationLower.includes('years')) timeframe.push('Long-term planning');
  const amounts = conversationText?.match(/\$[\d,]+|[\d,]+\s*(?:million|thousand|k|m)\b/gi) || [];
  const investmentAmount = amounts.length > 0 ? amounts[0] : 'To be determined';
  const clientSentiment = sentimentData?.rolling?.overall?.sentiment || 'neutral';
  const sentimentNote = clientSentiment === 'positive' ? 'Client expressed enthusiasm about investment opportunities' :
                        clientSentiment === 'negative' ? 'Client has concerns that need to be addressed' :
                        'Client is taking a measured approach to investment decisions';

  const nameForHeader = (clientName || info.name || 'Client');
  const email = info.email || 'On file';
  const phone = info.phone || 'On file';
  const location = info.location ? ` (${info.location})` : '';

  return `
# Investment Recommendation Presentation
**Prepared for:** ${nameForHeader}  
**Date:** ${currentDate}  
**Advisor:** AI Investment Copilot  

---

## Executive Summary

Based on our detailed conversation and comprehensive analysis, I'm pleased to present personalized investment recommendations tailored to your specific needs and objectives.

**Key Insights from Our Discussion:**
${financialGoals.length > 0 ? `• **Financial Goals:** ${financialGoals.join(', ')}` : '• **Financial Goals:** Wealth building and financial security'}
${riskProfile.length > 0 ? `• **Risk Profile:** ${riskProfile.join(', ')}` : '• **Risk Profile:** Balanced approach to risk and returns'}
${timeframe.length > 0 ? `• **Investment Horizon:** ${timeframe.join(', ')}` : '• **Investment Horizon:** Medium to long-term focus'}
• **Investment Capacity:** ${investmentAmount}
• **Client Outlook:** ${sentimentNote}

---

## Personalized Recommendations

${recommendation.replace(/\n/g, '\n')}

---

## Why These Recommendations?

**✓ Aligned with Your Goals**  
Each recommendation directly addresses the objectives you've shared during our conversation.

**✓ Risk-Appropriate**  
Investment selections match your expressed comfort level and risk tolerance.

**✓ Diversified Approach**  
Balanced portfolio construction to minimize risk while maximizing opportunity.

**✓ Tax-Efficient**  
Structured to optimize your after-tax returns where applicable.

---

## Next Steps

**Immediate Actions (Next 7 Days):**
1. Review these recommendations thoroughly
2. Schedule follow-up meeting to discuss any questions
3. Complete necessary account documentation
4. Begin initial investment allocation

**Ongoing Partnership:**
• Quarterly portfolio reviews
• Annual strategy assessments  
• Continuous monitoring of market conditions
• Regular communication and updates

---

## Investment Process & Timeline

**Week 1-2:** Account setup and initial funding  
**Week 3-4:** Investment implementation and allocation  
**Month 2:** First portfolio review and adjustment if needed  
**Quarterly:** Ongoing performance review and rebalancing  

---

## Compliance & Disclosures

*This recommendation is based on information provided during our conversation and current market conditions. Past performance does not guarantee future results. All investments carry risk, including potential loss of principal. Please review all investment materials carefully and consult with your tax advisor as appropriate.*

---

## Contact Information

**Client:** ${nameForHeader}${location}  
**Email:** ${email}  
**Phone:** ${phone}  
**Questions?** I'm here to help every step of the way.  
**Next Meeting:** [To be scheduled]  
**Portfolio Platform:** [Access details to be provided]  

---

**Generated on ${currentDate} using AI Investment Copilot v2.0**
`;
};
