interface IcheckValidTime {
  date: string;
  time: string;
}

// Date when change to isostring will remove gmt so have plus gmt hour to get exact local date time, use getday. munite,... it already count gmt

const checkValidTime = (date: string, time: string): boolean => {
  const DATE = new Date();
  const dateNow = new Date(DATE.valueOf() - DATE.getTimezoneOffset() * 60000);
  if (dateNow.toISOString().slice(0, 10) === date) {
    const currentTime = DATE.getHours() * 60 + DATE.getMinutes();
    const timeArray = time.split("-");
    const timeStart =
      Number(timeArray[0].split(":")[0]) * 60 +
      Number(timeArray[0].split(":")[1]);
    const timeEnd =
      Number(timeArray[1].split(":")[0]) * 60 +
      Number(timeArray[1].split(":")[1]);
    if (currentTime >= timeStart && currentTime <= timeEnd) {
      return true;
    } else return false;
  } else return false;
};
const checkExamStarted = (date: string, time: string): boolean => {
  const DATE = new Date();
  const dateNow = new Date(DATE.valueOf() - DATE.getTimezoneOffset() * 60000);

  if (isTimeOlder(dateNow.toISOString().slice(0, 10), date)) {
    return true;
  }
  if (dateNow.toISOString().slice(0, 10) === date) {
    const currentTime = DATE.getHours() * 60 + DATE.getMinutes();
    const timeArray = time.split("-");
    const timeStart =
      Number(timeArray[0].split(":")[0]) * 60 +
      Number(timeArray[0].split(":")[1]);
    // const timeEnd =
    //   Number(timeArray[1].split(":")[0]) * 60 +
    //   Number(timeArray[1].split(":")[1]);
    if (currentTime >= timeStart) {
      return true;
    } else return false;
  } else return false;
};

const isTimeOlder = (time1: string, time2: string) => {
  const time1Arr = time1.split("-");
  const time2Arr = time2.split("-");
  if (
    Number(time1Arr[0]) * 500 + Number(time1Arr[1]) * 40 + Number(time1Arr[2]) >
    Number(time2Arr[0]) * 500 + Number(time2Arr[1]) * 40 + Number(time2Arr[2])
  )
    return true;
  return false;
};
export { checkValidTime, checkExamStarted };
