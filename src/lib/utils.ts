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

export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};
