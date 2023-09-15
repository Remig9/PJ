export const convertTimeToSeconds = t => {
    const timeArray = t.split(':');
    return (timeArray[0] * 60 * 60) + (timeArray[1] * 60) + (timeArray[2]);
}

export const getOpeningHours = (openingTime, closingTime) => {
    const currentTime = convertTimeToSeconds(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);
    const openingHour = convertTimeToSeconds(openingTime);
    const closingHour = convertTimeToSeconds(closingTime);

    return {currentTime, openingHour, closingHour};
}
