export function formatDate(dateString: string) {
  const fullDate = new Date(dateString);
  const today = new Date
  const time = fullDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  if (fullDate.toDateString() == today.toDateString() ) {
    return `Today at ${time}`
  } else {
    const format = new Intl.DateTimeFormat('nl', { dateStyle: 'long'}).format(fullDate);
    return `${format} at ${time}`
  };
};

export function formatTime(time) {
  const dateString = time;

  // Create a new Date object from the given string
  const originalDate = new Date(dateString);

  // Get individual components of the date
  const year = originalDate.getUTCFullYear();
  const month = String(originalDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(originalDate.getUTCDate()).padStart(2, '0');
  const hours = String(originalDate.getUTCHours()).padStart(2, '0');
  const minutes = String(originalDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(originalDate.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(originalDate.getUTCMilliseconds()).padStart(3, '0');

  // Create the desired format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};
