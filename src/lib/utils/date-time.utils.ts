export interface TimeLeft {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
  isTimeUp: boolean;
  formattedText: string;
}

export function calculateTimeLeft(
  targetDate: string,
  endBetMin: number
): TimeLeft {
  // Set now to timezone UTC+7
  const now = new Date();

  // Set date to timezone UTC+7
  const date = new Date(targetDate.replace("T", " ").split(".")[0]);
  date.setHours(date.getHours() + 7);

  const end_bet_min = new Date(date.getTime() - endBetMin * 60 * 1000);
  const difference = Number(end_bet_min) - Number(now);

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let hoursToStr = "00";
  let minutesToStr = "00";
  let secondsToStr = "00";
  let isTimeUp = false;

  if (difference > 0) {
    days = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((difference / (1000 * 60)) % 60);
    seconds = Math.floor((difference / 1000) % 60);

    hoursToStr = hours.toString().padStart(2, "0");
    minutesToStr = minutes.toString().padStart(2, "0");
    secondsToStr = seconds.toString().padStart(2, "0");
  } else {
    // Time is up
    isTimeUp = true;
  }
  return {
    days,
    hours: hoursToStr,
    minutes: minutesToStr,
    seconds: secondsToStr,
    isTimeUp,
    formattedText: `${days} วัน ${hoursToStr}:${minutesToStr}:${secondsToStr}`,
  };
}

export function formatDateTime(dateString: string, endBetMin: number): string {
  try {
    let end_bet_min;
    let date = new Date(dateString.replace("T", " ").split(".")[0]);

    // set timezone to GMT+7
    date.setHours(date.getHours() + 7);

    if (endBetMin > 0) {
      end_bet_min = new Date(date.getTime() - endBetMin * 60 * 1000);
      date = end_bet_min;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if parsing fails
  }
}
