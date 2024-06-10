export const Footer = (
  { mobile }: { mobile?: boolean } = { mobile: false },
) => {
  return (
    <div
      className={mobile ? 'mobile-footer' : 'non-mobile-footer flex'}
      style={
        mobile
          ? {
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 8px',
              fontSize: '0.8em',
            }
          : {
              justifyContent: 'space-between',
              padding: 4,
            }
      }
    >
      <span>
        &copy;{' '}
        <a
          href="https://www.linkedin.com/in/saramassoud/"
          target="_blank"
          rel="noreferrer"
        >
          Sara "Mel" Massoud
        </a>
      </span>
      <span>
        Using{' '}
        <a href="https://data.syr.gov/" target="_blank" rel="noreferrer">
          Syracuse Open Data
        </a>
      </span>
    </div>
  );
};
