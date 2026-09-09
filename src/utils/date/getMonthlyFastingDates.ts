/**
 * Dates du rassemblement mensuel de jeûne et prière (3 jours consécutifs).
 *
 * Règle par défaut : 1er, 2e et 3e jours du mois.
 * Report : si le 1er tombe vendredi, samedi, dimanche ou lundi,
 * le jeûne commence le premier mardi du mois (mardi, mercredi, jeudi).
 *
 * @param year Année civile (ex. 2026)
 * @param month Mois de 1 (janvier) à 12 (décembre)
 */
export function getMonthlyFastingDates(
  year: number,
  month: number,
): [Date, Date, Date] {
  if (month < 1 || month > 12) {
    throw new RangeError("month must be between 1 and 12");
  }

  const monthIndex = month - 1;
  const first = new Date(year, monthIndex, 1);
  const weekday = first.getDay();
  const startDay = shouldPostponeFasting(weekday)
    ? 1 + daysUntilTuesday(weekday)
    : 1;

  return [
    new Date(year, monthIndex, startDay),
    new Date(year, monthIndex, startDay + 1),
    new Date(year, monthIndex, startDay + 2),
  ];
}

/** Vendredi (5), samedi (6), dimanche (0) ou lundi (1). */
function shouldPostponeFasting(weekday: number) {
  return weekday === 5 || weekday === 6 || weekday === 0 || weekday === 1;
}

function daysUntilTuesday(weekday: number) {
  return (2 - weekday + 7) % 7;
}
