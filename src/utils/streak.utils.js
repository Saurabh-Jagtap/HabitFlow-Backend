export const calculateCurrentStreak = (habitLogs = []) => {
    // Algorithm to calculate streak

    // 1. Normalize today’s date
    // 2. Set expectedDate = today
    // 3. Initialize streak = 0
    // 4. While true:
    // - Look for a HabitLog whose date === expectedDate
    // - If no log exists → STOP
    // - If log exists but completed === false → STOP
    //     Else:
    //    streak++
    //     expectedDate = expectedDate - 1 day
    //5.. Return streak

    if(!habitLogs.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let expectedDate = new Date(today);
    let streak = 0;

    const logMap = new Map();

    for (const log of habitLogs) {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        logMap.set(logDate.getTime(), log);
    }

    while (true) {
        const log = logMap.get(expectedDate.getTime());

        if (!log || log.completed !== true) {
            break;
        }

        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
    }

    return streak
}