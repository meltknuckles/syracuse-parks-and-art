export const formatTitle = (d: any): string => {
  let title = d.title || d.name || d.properties?.name;
  const park = d.properties?.park ?? d.park;

  if (park) {
    if (d.type === 'pool') {
      title = `${d.properties.park || ''} Pool`
        .replace('Pool Pool', 'Pool')
        .trim();
    }
    if (!title && d.properties?.COURT_TYPE) {
      title =
        `${d.properties.park || ''} ${d.properties.COURT_TYPE} Court`.trim();
    }
    if (!title && d.properties?.type) {
      title = `${d.properties.park || ''} ${d.properties.type}`.trim();
    }
  }
  return title;
};
