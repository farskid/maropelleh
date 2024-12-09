export function getDistanceBetweenRects(fromRect: DOMRect, toRect: DOMRect) {
  // Calculate the center points of fromRect and toRect
  const fromCenterX = fromRect.left + fromRect.width / 2;
  const fromCenterY = fromRect.top + fromRect.height / 2;
  const toCenterX = toRect.left + toRect.width / 2;
  const toCenterY = toRect.top + toRect.height / 2;

  // Calculate distance using the Pythagorean theorem
  const distance = Math.hypot(toCenterX - fromCenterX, toCenterY - fromCenterY);

  // Calculate angle for rotation
  const angleDegrees =
    Math.atan2(toCenterY - fromCenterY, toCenterX - fromCenterX) *
    (180 / Math.PI);

  return { distance, angleDegrees };
}

export function getHumanFriendlyPlayerPosition(position: number): string {
  return position === -1 ? "out" : position.toString();
}
