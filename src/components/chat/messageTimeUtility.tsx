  export default function formatMessageTime(timestamp: string | Date) {
    const date = new Date(timestamp);
    const now = new Date();
  
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
  
    const optionsDate: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    };
  
    const optionsDayName: Intl.DateTimeFormatOptions = { weekday: 'long' };
  
    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      // Today
      return date.toLocaleTimeString([], optionsTime);
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week → show day name
      return date.toLocaleDateString([], optionsDayName);
    } else {
      // Older → show date
      return date.toLocaleDateString([], optionsDate);
    }
  }