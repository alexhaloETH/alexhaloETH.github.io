import { apiRequest, withErrorContext } from './apiClient';

export const getPublishedContent = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return withErrorContext('Error fetching published content', () => (
    apiRequest(`/content${query ? `?${query}` : ''}`)
  ));
};

export const getPublishedContentBySlug = async (slug) => withErrorContext(
  `Error fetching published content ${slug}`,
  () => apiRequest(`/content/${encodeURIComponent(slug)}`),
);

export const getPublishedContentTags = async () => withErrorContext(
  'Error fetching published content tags',
  () => apiRequest('/content/tags'),
);

export const getPublishedContentMeta = async () => withErrorContext(
  'Error fetching published content metadata',
  () => apiRequest('/content/meta'),
);
