import { useEffect, useMemo, useState } from 'react'
import {
  getPublishedContent,
  getPublishedContentBySlug,
  getPublishedContentMeta,
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

const getProjectName = (item) => item.project || 'Vault'

const sortByName = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })

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

function ProjectRail({ projects, selectedProject, onProjectChange }) {
  if (projects.length === 0) {
    return null
  }

  return (
    <aside className="content-projects" aria-label="Vault projects">
      <span className="content-projects-label">Projects</span>
      <div className="content-projects-list">
        {projects.map((project) => (
          <button
            className={`content-project-button ${selectedProject === project.project ? 'active' : ''}`}
            key={project.project}
            type="button"
            onClick={() => onProjectChange(project.project)}
          >
            <span className="content-project-name">{project.project}</span>
            <span className="content-project-count">{project.count}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

function ContentList({ route, onOpenItem, selectedProject, onProjectChange }) {
  const [items, setItems] = useState([])
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
      getPublishedContentMeta(),
    ])
      .then(([contentItems, contentMeta]) => {
        if (!active) {
          return
        }

        setItems(Array.isArray(contentItems) ? contentItems : [])
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

  const projects = useMemo(() => {
    const counts = new Map()

    items.forEach((item) => {
      const project = getProjectName(item)
      counts.set(project, (counts.get(project) || 0) + 1)
    })

    if (Array.isArray(meta?.projects)) {
      meta.projects.forEach((projectMeta) => {
        if (projectMeta?.project) {
          counts.set(projectMeta.project, projectMeta.count ?? counts.get(projectMeta.project) ?? 0)
        }
      })
    }

    return Array.from(counts.entries())
      .map(([project, count]) => ({ project, count }))
      .sort((a, b) => sortByName(a.project, b.project))
  }, [items, meta])

  useEffect(() => {
    if (status === 'ready' && !selectedProject && projects.length > 0) {
      onProjectChange(projects[0].project)
    }
  }, [onProjectChange, projects, selectedProject, status])

  const projectItems = useMemo(() => (
    selectedProject
      ? items.filter((item) => getProjectName(item) === selectedProject)
      : []
  ), [items, selectedProject])

  const types = useMemo(() => (
    Array.from(new Set(projectItems.map((item) => item.type).filter(Boolean))).sort(sortByName)
  ), [projectItems])

  const tags = useMemo(() => {
    const counts = new Map()

    projectItems.forEach((item) => {
      item.tags?.forEach((tag) => {
        if (tag?.trim()) {
          counts.set(tag, (counts.get(tag) || 0) + 1)
        }
      })
    })

    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => sortByName(a.tag, b.tag))
  }, [projectItems])

  useEffect(() => {
    if (selectedType && !types.includes(selectedType)) {
      setSelectedType('')
    }
  }, [selectedType, types])

  useEffect(() => {
    if (selectedTag && !tags.some((tag) => tag.tag.toLowerCase() === selectedTag.toLowerCase())) {
      setSelectedTag('')
    }
  }, [selectedTag, tags])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projectItems.filter((item) => {
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
  }, [projectItems, query, selectedTag, selectedType])

  const selectedProjectMeta = projects.find((project) => project.project === selectedProject)

  return (
    <main className="content-shell">
      <section className="content-heading">
        <div>
          <p className="content-kicker">Private Vault</p>
          <h1>Vault Notes</h1>
        </div>
        <ContentMeta meta={meta} />
      </section>

      {status === 'loading' && (
        <div className="content-state">Loading vault notes...</div>
      )}

      {status === 'error' && (
        <div className="content-state error">{error}</div>
      )}

      {status === 'ready' && (
        <div className="content-browser-layout">
          <ProjectRail
            projects={projects}
            selectedProject={selectedProject}
            onProjectChange={onProjectChange}
          />

          <section className="content-project-panel">
            <div className="content-project-heading">
              <div>
                <p className="content-kicker">Current Project</p>
                <h2>{selectedProject || 'No project selected'}</h2>
              </div>
              {selectedProjectMeta && (
                <span className="content-project-total">
                  {selectedProjectMeta.count} notes
                </span>
              )}
            </div>

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

            {filteredItems.length === 0 ? (
              <div className="content-state">
                No notes found in this project.
              </div>
            ) : (
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
          </section>
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
              <span className="content-project-chip">{item.project || 'Vault'}</span>
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
  const [selectedProject, setSelectedProject] = useState('')
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
      selectedProject={selectedProject}
      onProjectChange={setSelectedProject}
    />
  )
}

export default ContentBrowser
