export function formatDateTime(dateString: string, endBetMin: number): string {
  try {
    let end_bet_min;
    let date = new Date(dateString.replace('T', ' ').split('.')[0]);
    if(endBetMin > 0){
      end_bet_min = new Date(date.getTime() - endBetMin * 60 * 1000);
      date = end_bet_min;
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
}
