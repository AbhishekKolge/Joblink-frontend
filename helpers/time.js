const checkTimeIsExpired = (timeArg) => {
  const currentTime = Date.now();
  const time = new Date(timeArg).getTime() - 300000;
  return time < currentTime;
};

const calculateRemainingTime = (timeArg) => {
  const currentTime = Date.now();
  const time = new Date(timeArg).getTime() - 300000;
  const remainingTime = time - currentTime;
  return remainingTime;
};

export { checkTimeIsExpired, calculateRemainingTime };
