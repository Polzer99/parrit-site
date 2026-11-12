/** Invoke only after observing cancellation, and observe late rejections too. */
export function withinDeadline(operation, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve().then(() => { signal.throwIfAborted(); return operation(); }).then(
      value => { signal.removeEventListener('abort', abort); resolve(value); },
      error => { signal.removeEventListener('abort', abort); reject(error); },
    );
  });
}

export function isTimeout(error) {
  return [error, error?.cause].some(item => item && (
    ['TimeoutError', 'AbortError'].includes(item.name) ||
    ['ETIMEDOUT', 'ABORT_ERR', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT'].includes(item.code) ||
    (item.killed && item.signal === 'SIGTERM')
  ));
}
export function errorCode(error) {
  const code = error?.cause?.code ?? error?.code ?? 'inconnu';
  return /^[A-Z0-9_]{1,50}$/i.test(String(code)) ? String(code) : 'inconnu';
}
export function sourceFailure(error) {
  if (isTimeout(error)) return 'delai_depasse';
  if (error?.code === 'SOURCE_TOO_LARGE' || error?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') return 'trop_lourde';
  const message = String(error?.message || '');
  const http = message.match(/^HTTP (\d+)$/);
  if (http) return `http_${http[1]}`;
  if (/refusé|registre|privée|non publique/.test(message)) return 'domaine_refuse';
  return `reseau_${errorCode(error)}`;
}
