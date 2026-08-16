export function getAiraloAffiliateUrl(productNameOrId: string = ''): string {
  const name = (productNameOrId || '').toLowerCase();
  let countrySlug = '';

  if (name.includes('nigeria') || name.includes('esim-nigeria') || name.includes('🇳🇬')) {
    countrySlug = 'nigeria-esim';
  } else if (name.includes('usa') || name.includes('united states') || name.includes('esim-usa') || name.includes('🇺🇸')) {
    countrySlug = 'united-states-esim';
  } else if (name.includes('uk') || name.includes('united kingdom') || name.includes('esim-uk') || name.includes('🇬🇧')) {
    countrySlug = 'united-kingdom-esim';
  } else if (name.includes('canada') || name.includes('esim-canada') || name.includes('🇨🇦')) {
    countrySlug = 'canada-esim';
  } else if (name.includes('uae') || name.includes('dubai') || name.includes('esim-uae') || name.includes('🇦🇪')) {
    countrySlug = 'united-arab-emirates-esim';
  } else if (name.includes('saudi') || name.includes('esim-saudi') || name.includes('🇸🇦')) {
    countrySlug = 'saudi-arabia-esim';
  } else if (name.includes('ghana') || name.includes('esim-ghana') || name.includes('🇬🇭')) {
    countrySlug = 'ghana-esim';
  } else if (name.includes('south africa') || name.includes('esim-sa') || name.includes('🇿🇦')) {
    countrySlug = 'south-africa-esim';
  } else if (name.includes('turkey') || name.includes('esim-turkey') || name.includes('🇹🇷')) {
    countrySlug = 'turkey-esim';
  } else if (name.includes('europe') || name.includes('esim-europe') || name.includes('🇪🇺')) {
    countrySlug = 'europe-esim';
  }

  const baseUrl = countrySlug ? `https://www.airalo.com/${countrySlug}` : 'https://www.airalo.com';
  return `${baseUrl}?ref=GOYE`;
}

export function openAiraloAffiliateCheckout(productNameOrId: string) {
  const url = getAiraloAffiliateUrl(productNameOrId);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
