function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderAdSlot({ slotId, position = "inline" }) {
  const normalizedSlotId = escapeAttribute(slotId);
  const normalizedPosition = escapeAttribute(position);
  return `
<aside class="ad-slot ad-slot-${normalizedPosition}" aria-label="広告枠" data-slot-position="${normalizedPosition}">
  <!-- 広告ガードレール:
       1) 操作UI(スライダー・送信ボタン)の上下40px以内に配置しない
       2) 連続広告を置かない（最低1セクション間隔）
       3) 次へ/前へCTAの直前直後に置かない
       4) AdSense導入時はこのdivをins.adsbygoogleに差し替え -->
  <div class="ad-slot-box" data-ad-slot-id="${normalizedSlotId}">
    スポンサーリンク（ダミー）
  </div>
</aside>`.trim();
}
