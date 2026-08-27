const calculateStreaks = (days, todayLocalDay) => {
  if (days.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  days.sort();

  let streak = 1;
  let longestStreak = 1;


  for (let i = 1; i < days.length; i++) {
    const previous = new Date(days[i - 1]);
    const current = new Date(days[i]);

    const difference =
      (current - previous) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
      streak++;
    } else {
      streak = 1;
    }

    longestStreak = Math.max(longestStreak, streak);
  }

//Current Streak

  let currentStreak = 0;

  let latestDay = days[days.length - 1];

  const today = new Date(todayLocalDay);

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const yesterdayLocalDay = yesterday
    .toISOString()
    .split("T")[0];

  if (
    latestDay !== todayLocalDay &&
    latestDay !== yesterdayLocalDay
  ) {
    currentStreak = 0;
  } else {
    currentStreak = 1;

    for (let i = days.length - 1; i > 0; i--) {
      const current = new Date(days[i]);
      const previous = new Date(days[i - 1]);

      const difference =
        (current - previous) / (1000 * 60 * 60 * 24);

      if (difference === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
};

module.exports = calculateStreaks;