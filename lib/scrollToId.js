'use client';

/**
 * Robust smooth scrolling to any section on the page.
 * Works seamlessly across all browsers and devices.
 */
export function scrollToId(id) {
  if (typeof window === 'undefined') return;

  if (id === 'home' || !id) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (_) {}
    return;
  }

  const el = document.getElementById(id);
  if (!el) {
    const fallback = document.querySelector(`[id="${id}"]`);
    if (!fallback) return;
    fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const navHeight = 72;
  const rect = el.getBoundingClientRect();
  const targetTop = rect.top + window.scrollY - navHeight;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth',
  });

  try {
    window.history.replaceState(null, '', `#${id}`);
  } catch (_) {}
}
