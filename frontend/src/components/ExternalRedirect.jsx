import { useEffect } from 'react';

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  
  return <p>Redirecting...</p>;
};

export default ExternalRedirect;