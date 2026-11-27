// Only for public, static storefront JSON. Successful reads can be shared by Wix mounts.
// Failed reads must leave the next mount free to try again.
export function shareSuccessful(load) {
  let pending;
  return () => pending ??= load().catch(error => {
    pending = undefined;
    throw error;
  });
}

export async function readStoreJson(url, options = {}, prefetched) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let status;
    try {
      const response = await (attempt === 0 && prefetched ? prefetched : fetch(url, {
        ...options, cache: attempt ? 'reload' : options.cache, signal: AbortSignal.timeout(4500)
      }));
      status = response.status;
      if (!response.ok) throw Error('HTTP ' + status);
      return await response.json();
    } catch (cause) {
      if (attempt === 2 || (status >= 400 && status < 500 && ![408, 429].includes(status))) {
        throw Error('STORE_DATA_' + new URL(url).pathname.split('/').pop() + ': ' + cause.message, {cause});
      }
      await new Promise(resolve => setTimeout(resolve, attempt ? 550 : 150));
    }
  }
}
