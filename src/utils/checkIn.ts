const CHECK_IN_INTERVAL_HOURS = 4;

export function needsCheckIn(): boolean {
  const last = localStorage.getItem('lastCheckIn');

  if (!last) return true;

  const lastDate = new Date(last);
  const now = new Date();

  const diffMs = now.getTime() - lastDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= CHECK_IN_INTERVAL_HOURS;
}
