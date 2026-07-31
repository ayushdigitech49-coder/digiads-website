// Centralized Cross-Tab Real-Time Sync Broadcast Channel
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sumit_cms_sync_channel') : null;

export const notifyCmsUpdate = (type: string, data?: any) => {
  // 1. Same-window local event
  window.dispatchEvent(new Event(`${type}_updated`));
  window.dispatchEvent(new Event('cms_updated'));

  // 2. Cross-tab / Cross-window broadcast
  if (channel) {
    channel.postMessage({ type, data, timestamp: Date.now() });
  }
};

export const subscribeCmsUpdate = (callback: (type: string, data?: any) => void) => {
  const handleLocalEvent = (e: Event) => {
    callback(e.type, null);
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && e.data.type) {
      callback(e.data.type, e.data.data);
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcast);
  }

  window.addEventListener('storage', handleLocalEvent);
  window.addEventListener('cms_updated', handleLocalEvent);
  window.addEventListener('contact_updated', handleLocalEvent);
  window.addEventListener('hero_updated', handleLocalEvent);
  window.addEventListener('reels_updated', handleLocalEvent);
  window.addEventListener('pricing_updated', handleLocalEvent);
  window.addEventListener('sections_updated', handleLocalEvent);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleLocalEvent);
    window.removeEventListener('cms_updated', handleLocalEvent);
    window.removeEventListener('contact_updated', handleLocalEvent);
    window.removeEventListener('hero_updated', handleLocalEvent);
    window.removeEventListener('reels_updated', handleLocalEvent);
    window.removeEventListener('pricing_updated', handleLocalEvent);
    window.removeEventListener('sections_updated', handleLocalEvent);
  };
};
