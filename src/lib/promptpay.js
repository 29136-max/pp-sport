/**
 * Thai PromptPay Payload Helper (EMVCo standard format)
 */

function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePromptPayPayload(targetMobileOrTaxId = '0812345678', amount = 0) {
  // Clean phone number / TAX ID
  const cleaned = targetMobileOrTaxId.replace(/[^0-9]/g, '');
  
  let targetType = '01'; // 01 for mobile, 02 for TAX ID / National ID
  let targetFormatted = '';

  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    targetType = '01';
    targetFormatted = '0066' + cleaned.substring(1);
  } else if (cleaned.length === 13) {
    targetType = '02';
    targetFormatted = cleaned;
  } else {
    targetType = '01';
    targetFormatted = '0066812345678';
  }

  // Build Tag 29 sub-fields
  const aid = '0016A000000677010111';
  const targetTag = `${targetType}${targetFormatted.length.toString().padStart(2, '0')}${targetFormatted}`;
  const tag29Content = `${aid}${targetTag}`;
  const tag29 = `29${tag29Content.length.toString().padStart(2, '0')}${tag29Content}`;

  // Tag 53 (Currency - THB 764)
  const tag53 = '5303764';
  
  // Tag 54 (Amount if > 0)
  let tag54 = '';
  if (amount && amount > 0) {
    const amountStr = amount.toFixed(2);
    tag54 = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;
  }

  // Tag 58 (Country Code TH)
  const tag58 = '5802TH';

  // Assembly base payload
  const basePayload = `000201010212${tag29}${tag53}${tag54}${tag58}6304`;
  const checksum = crc16(basePayload);

  return `${basePayload}${checksum}`;
}
