export function getProxyImageUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  
  let cleanUrl = url.trim();
  if (cleanUrl.startsWith('//')) {
    cleanUrl = 'https:' + cleanUrl;
  }

  // Already a proxied URL
  if (cleanUrl.startsWith('/api/image-proxy') || cleanUrl.startsWith('/api/proxy-image')) {
    return cleanUrl;
  }

  // Route external CDN images through express image proxy
  if (
    cleanUrl.startsWith('http://') || 
    cleanUrl.startsWith('https://') || 
    cleanUrl.includes('cjdropshipping.com') || 
    cleanUrl.includes('aliyuncs.com') || 
    cleanUrl.includes('alicdn.com')
  ) {
    // If it's unsplash, direct fetch works well, but proxy works too
    if (cleanUrl.includes('unsplash.com')) {
      return cleanUrl;
    }
    return `/api/image-proxy?url=${encodeURIComponent(cleanUrl)}`;
  }

  return cleanUrl;
}
