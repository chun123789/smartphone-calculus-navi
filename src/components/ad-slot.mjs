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
<aside class="ad-slot ad-slot-${normalizedPosition}" aria-label="広告枠">
  <!-- 広告配置ルール:
       1) 記事冒頭の結論ブロック直後に1枠
       2) 長文記事は本文中盤に1枠
       3) 連続で広告を置かない（最低1セクション分あける）
       AdSense導入時はこのdivをins.adsbygoogleへ差し替える -->
  <div class="ad-slot-box" data-ad-slot-id="${normalizedSlotId}">
    スポンサーリンク（ダミー）
  </div>
</aside>`.trim();
}

