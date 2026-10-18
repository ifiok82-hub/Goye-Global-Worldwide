export async function GET(request: Request) {
  const host = request.headers.get('host') || '';
  let token = 'piappstudio-ZB6ZEYvsQsJOE1egnfGW0NcZYbCA5Gpl';
  
  if (host.includes('sirwise.online')) {
    token = 'piappstudio-QXBlNcU5qsqGJeJM47lYz42WVRHKQOb2';
  }
  if (host.includes('gasv.store')) {
    token = 'piappstudio-ZB6ZEYvsQsJOE1egnfGW0NcZYbCA5Gpl';
  }
  
  return new Response(token, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
