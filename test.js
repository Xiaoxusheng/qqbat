function time() {
    let date = new Date()
    console.log(date)
    // 将日期设置为当年的4月1日
    const firstDayOfYear = new Date('2023-02-06').getTime()
    // 计算日期与当年4月1日的时间差
    const timeDiff = date - firstDayOfYear;
    // 计算时间差对应的天数
    const dayOfYear = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    // 计算当前日期属于第几周
    const weekNumber = Math.ceil(dayOfYear / 7);
    console.log(weekNumber)
}

time()


console.log(typeof (1) === "number")