import { nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vitepress';

type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void };
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];

function publicUrl(raw: string, campaigns = false) {
  if (!raw) return '';
  const url = new URL(raw, location.origin);
  const query = new URLSearchParams();
  if (campaigns) for (const key of campaignKeys) {
    const value = url.searchParams.get(key);
    if (value && value.length <= 150 && !value.includes('@')) query.set(key, value);
  }
  return url.origin + url.pathname + (query.size ? `?${query}` : '');
}

/** 只在正式主站采集；本地预览和旧站迁移页不产生增长访问。 */
export function useDocsAnalytics() {
  const route = useRoute();
  let previous = '';
  const track = () => {
    const analytics = window as AnalyticsWindow;
    if (location.hostname !== 'mp2rss.bugcode.dev' || !analytics.gtag) return;
    const page = publicUrl(location.href, true);
    if (previous === page) return;
    analytics.gtag('event', 'page_view', {
      page_location: page,
      page_title: document.title,
      page_referrer: previous || publicUrl(document.referrer),
      content_group: 'docs',
    });
    previous = page;
  };
  const click = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link || location.hostname !== 'mp2rss.bugcode.dev') return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || target.pathname.startsWith('/docs')) return;
    (window as AnalyticsWindow).gtag?.('event', 'docs_cta_click', {
      target_path: target.pathname,
      page_location: publicUrl(location.href, true),
      content_group: 'docs',
    });
  };
  watch(() => route.path, () => nextTick(track));
  onMounted(() => { nextTick(track); document.addEventListener('click', click); });
  onUnmounted(() => document.removeEventListener('click', click));
}
