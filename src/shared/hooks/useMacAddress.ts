import { useEffect, useState } from 'react';

/**
 * Hook to automatically capture the user's MAC address from hotspot redirect parameters.
 * Common parameters: mac, client_mac, client-mac, src_mac, etc.
 */
export const useMacAddress = () => {
  const [macAddress, setMacAddress] = useState<string | undefined>(
    localStorage.getItem('user_mac_address') || undefined
  );

  useEffect(() => {
    if (macAddress) return;

    const params = new URLSearchParams(window.location.search);
    const macParams = ['mac', 'client_mac', 'client-mac', 'src_mac', 'mac_address'];
    
    for (const param of macParams) {
      const val = params.get(param);
      if (val) {
        setMacAddress(val);
        localStorage.setItem('user_mac_address', val);
        break;
      }
    }
  }, [macAddress]);

  return macAddress;
};
