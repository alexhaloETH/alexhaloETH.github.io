import { useEffect, useMemo, useState } from 'react'
import {
  getPublishedContent,
  getPublishedContentBySlug,
  getPublishedContentMeta,
  getPublishedContentTags,
} from '../../utils/contentApi'
import './ContentBrowser.css'

const formatDate = (value) => {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ContentMeta({ meta }) {
  if (!meta) {
    return null
  }

  return (
    <div className="content-meta-strip" aria-label="Content sync status">
      <span>{meta.publishedCount ?? 0} selected</span>
      {meta.lastSyncAt && <span>Synced {formatDate(meta.lastSyncAt)}</span>}
    </div>
  )
}

function ContentFilters({
  query,
  selectedTag,
  selectedType,
  tags,
  types,
  onQueryChange,
  onTagChange,
  onTypeChange,
}) {
  return (
    <div className="content-filters">
      <input
        className="content-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search content"
        aria-label="Search published content"
      />

      <select
        className="content-select"
        value={selectedTag}
        onChange={(event) => onTagChange(event.target.value)}
        aria-label="Filter by tag"
      >
        <option value="">All tags</option>
        {tags.map((tag) => (
          <option key={tag.tag} value={tag.tag}>
            {tag.tag}
          </option>
        ))}
      </select>

      <select
        className="content-select"
        value={selectedType}
        onChange={(event) => onTypeChange(event.target.value)}
        aria-label="Filter by type"
      >
        <option value="">All types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  )
}

function ContentList({ route, onOpenItem }) {
  const [items, setItems] = useState([])
  const [tags, setTags] = useState([])
  const [meta, setMeta] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedType, setSelectedType] = useState(route.type || '')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setStatus('loading')
    setError('')

    Promise.all([
      getPublishedContent(),
      getPublishedContentTags(),
      getPublishedContentMeta(),
    ])
      .then(([contentItems, contentTags, contentMeta]) => {
        if (!active) {
          return
        }

        setItems(Array.isArray(contentItems) ? contentItems : [])
        setTags(Array.isArray(contentTags) ? contentTags : [])
        setMeta(contentMeta)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (!active) {
          return
        }

        setError(requestError.message || 'Unable to load published content')
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setSelectedType(route.type || '')
  }, [route.type])

  const types = useMemo(() => (
    Array.from(new Set(items.map((item) => item.type).filter(Boolean))).sort()
  ), [items])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items.filter((item) => {
      if (selectedType && item.type !== selectedType) {
        return false
      }

      if (selectedTag && !item.tags?.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())) {
        return false
      }

      if (normalizedQuery) {
        const title = item.title?.toLowerCase() || ''
        const description = item.description?.toLowerCase() || ''

        if (!title.includes(normalizedQuery) && !description.includes(normalizedQuery)) {
          return false
        }
      }

      return true
    })
  }, [items, query, selectedTag, selectedType])

  return (
    <main className="content-shell">
      <section className="content-heading">
        <div>
          <p className="content-kicker">Private Vault</p>
          <h1>Vault Notes</h1>
        </div>
        <ContentMeta meta={meta} />
      </section>

      <ContentFilters
        query={query}
        selectedTag={selectedTag}
        selectedType={selectedType}
        tags={tags}
        types={types}
        onQueryChange={setQuery}
        onTagChange={setSelectedTag}
        onTypeChange={setSelectedType}
      />

      {status === 'loading' && (
        <div className="content-state">Loading vault notes...</div>
      )}

      {status === 'error' && (
        <div className="content-state error">{error}</div>
      )}

      {status === 'ready' && filteredItems.length === 0 && (
        <div className="content-state">
          No selected vault notes found.
        </div>
      )}

      {status === 'ready' && filteredItems.length > 0 && (
        <div className="content-list">
          {filteredItems.map((item) => (
            <a
              className="content-card"
              href={`#vault/${item.slug}`}
              key={item.slug}
              onClick={(event) => {
                if (onOpenItem) {
                  event.preventDefault()
                  onOpenItem(item.slug)
                }
              }}
            >
              <div className="content-card-topline">
                <span className="content-type">{item.type || 'note'}</span>
                {item.featured && <span className="content-featured">Featured</span>}
              </div>
              <h2>{item.title}</h2>
              {item.description && <p>{item.description}</p>}
              <div className="content-card-footer">
                {item.date && <time>{formatDate(item.date)}</time>}
                {item.tags?.length > 0 && (
                  <div className="content-tags">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}

function ContentDetail({ slug, onBack, onOpenItem }) {
  const [item, setItem] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setStatus('loading')
    setError('')

    getPublishedContentBySlug(slug)
      .then((contentItem) => {
        if (!active) {
          return
        }

        setItem(contentItem)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (!active) {
          return
        }

        setError(requestError.message || 'Unable to load published content')
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [slug])

  const handleBackClick = (event) => {
    if (onBack) {
      event.preventDefault()
      onBack()
    }
  }

  const handleBodyClick = (event) => {
    if (!onOpenItem || !(event.target instanceof Element)) {
      return
    }

    const link = event.target.closest('a')
    const href = link?.getAttribute('href') || ''

    if (!href.startsWith('/content/')) {
      return
    }

    const nextSlug = href
      .slice('/content/'.length)
      .split(/[?#]/)[0]

    if (nextSlug) {
      event.preventDefault()
      onOpenItem(decodeURIComponent(nextSlug))
    }
  }

  return (
    <main className="content-shell detail">
      <a className="content-back-link" href="#vault" onClick={handleBackClick}>
        Back to vault
      </a>

      {status === 'loading' && (
        <div className="content-state">Loading vault note...</div>
      )}

      {status === 'error' && (
        <div className="content-state error">{error}</div>
      )}

      {status === 'ready' && item && (
        <article className="content-detail">
          {item.coverImageUrl && (
            <img className="content-cover" src={item.coverImageUrl} alt="" />
          )}

          <header className="content-detail-header">
            <div className="content-card-topline">
              <span className="content-type">{item.type || 'note'}</span>
              {item.featured && <span className="content-featured">Featured</span>}
            </div>
            <h1>{item.title}</h1>
            {item.description && <p>{item.description}</p>}
            <div className="content-detail-meta">
              {item.date && <time>{formatDate(item.date)}</time>}
              {item.tags?.length > 0 && (
                <div className="content-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div
            className="content-body"
            dangerouslySetInnerHTML={{ __html: item.bodyHtml || '' }}
            onClick={handleBodyClick}
          />
        </article>
      )}
    </main>
  )
}

function ContentBrowser({ initialType = '' }) {
  const [activeSlug, setActiveSlug] = useState(null)
  const route = { base: '', slug: activeSlug, type: initialType }

  if (route.slug) {
    return (
      <ContentDetail
        slug={route.slug}
        onBack={() => setActiveSlug(null)}
        onOpenItem={setActiveSlug}
      />
    )
  }

  return (
    <ContentList
      route={route}
      onOpenItem={setActiveSlug}
    />
  )
}

export default ContentBrowser
