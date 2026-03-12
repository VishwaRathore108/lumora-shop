import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToAnchor = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Agar URL mein hash hai (e.g., #features), toh wahan scroll karo
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Thoda wait taaki page load ho jaye
      }
    } 
    // Agar naya page hai (e.g. /contact), toh top par jao
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null; // Ye screen par kuch dikhata nahi, bas background mein kaam karta hai
};

export default ScrollToAnchor;