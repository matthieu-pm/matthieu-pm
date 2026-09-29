"use client"

import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  FavouriteIcon,
  Menu01Icon,
  ListViewIcon,
  Globe02Icon,
} from "@hugeicons/core-free-icons"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  allResources,
  catalogues,
  navigation,
  type CatalogueId,
  type Resource,
} from "./catalogues"
import { Globe } from "./pixel-globe"
import styles from "./inspirations.module.css"

type Theme = "auto" | "light" | "dark"
const description =
  "A curated collection of interface craft, component libraries, AI tools, and resources for builders."

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("inspirations-change", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("inspirations-change", callback)
  }
}
function usePreference(key: string, fallback: string) {
  const snapshot = useCallback(() => {
    try {
      return localStorage.getItem(`inspirations:${key}`) ?? fallback
    } catch {
      return fallback
    }
  }, [key, fallback])
  const value = useSyncExternalStore(subscribe, snapshot, () => fallback)
  const set = (next: string) => {
    try {
      localStorage.setItem(`inspirations:${key}`, next)
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    window.dispatchEvent(new Event("inspirations-change"))
  }
  return [value, set] as const
}

function Icon({
  index,
  className = "",
}: {
  index: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.icon} ${className}`}
      style={
        {
          "--icon": `url("/inspirations/control-${index}.svg")`,
        } as CSSProperties
      }
    />
  )
}
function SidebarNavigation({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  const ref = useRef<HTMLElement>(null)
  const moveHighlight = useCallback((link: Element | null) => {
    const nav = ref.current
    if (!nav || !(link instanceof HTMLElement)) return
    nav.style.setProperty("--highlight-y", `${link.offsetTop}px`)
    nav.style.setProperty("--highlight-height", `${link.offsetHeight}px`)
  }, [])
  const restoreHighlight = useCallback(() => {
    const nav = ref.current
    moveHighlight(
      nav?.querySelector("a:focus-visible") ??
        nav?.querySelector("a[aria-current]") ??
        null
    )
  }, [moveHighlight])

  useEffect(() => {
    const nav = ref.current
    if (!nav) return
    restoreHighlight()
    const observer = new ResizeObserver(restoreHighlight)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [children, restoreHighlight])

  return (
    <nav
      ref={ref}
      aria-label={label}
      onPointerOver={(event) => {
        if (event.pointerType === "touch") return
        if (event.target instanceof Element) {
          moveHighlight(event.target.closest("a"))
        }
      }}
      onPointerLeave={restoreHighlight}
      onFocus={(event) => moveHighlight(event.target.closest("a"))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          moveHighlight(event.currentTarget.querySelector("a[aria-current]"))
        }
      }}
    >
      {children}
    </nav>
  )
}

function Modal({
  children,
  label,
  onClose,
  className = "",
  onNavigate,
}: {
  children: ReactNode
  label: string
  onClose: () => void
  className?: string
  onNavigate?: (direction: number) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = "hidden"
    dialog?.querySelector<HTMLInputElement>("input")?.focus()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${className}`}
      aria-label={label}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const r = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < r.left ||
          event.clientX > r.right ||
          event.clientY < r.top ||
          event.clientY > r.bottom
        )
          onClose()
      }}
      onKeyDown={(event) => {
        if (
          onNavigate &&
          (event.key === "ArrowLeft" || event.key === "ArrowRight")
        ) {
          event.preventDefault()
          onNavigate(event.key === "ArrowLeft" ? -1 : 1)
        }
      }}
    >
      {children}
    </dialog>
  )
}
function ResourceIcon({
  resource,
  size,
}: {
  resource: Resource
  size: number
}) {
  const [failed, setFailed] = useState<string | null>(null)
  return resource.icon && failed !== resource.icon ? (
    <Image
      src={resource.icon}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(resource.icon)}
    />
  ) : (
    <HugeiconsIcon
      icon={Globe02Icon}
      size={size}
      strokeWidth={1.4}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    />
  )
}

function ResourceArtwork({ resource }: { resource: Resource }) {
  const [failedPreview, setFailedPreview] = useState<string | null>(null)
  if (resource.preview && resource.preview !== failedPreview)
    return (
      <Image
        unoptimized
        src={resource.preview}
        alt={`${resource.name} preview`}
        onError={() => setFailedPreview(resource.preview)}
        width={640}
        height={360}
        className={styles.previewImage}
      />
    )
  return (
    <div className={styles.catalogueArtwork}>
      <div className={styles.artworkTop}>
        <span>{new URL(resource.href).hostname.replace(/^www\./, "")}</span>
      </div>
      <div className={styles.artworkIdentity}>
        <ResourceIcon resource={resource} size={42} />
        <strong>{resource.name}</strong>
        <span>{resource.description}</span>
      </div>
    </div>
  )
}

export function Inspirations({
  category = "inspiration",
}: {
  category?: CatalogueId
}) {
  const catalogue = catalogues[category]
  const resources = useMemo(
    () =>
      catalogue.flatMap((section) =>
        section.items.map((item) => ({ ...item, section: section.title }))
      ),
    [catalogue]
  )
  const [theme, setTheme] = usePreference("theme", "auto")
  const [view, setView] = usePreference("view", "list")
  const [savedJson, setSavedJson] = usePreference("saved", "[]")
  const saved = useMemo<string[]>(() => {
    try {
      const value: unknown = JSON.parse(savedJson)
      return Array.isArray(value)
        ? value.filter((v): v is string => typeof v === "string")
        : []
    } catch {
      return []
    }
  }, [savedJson])
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [savedOpen, setSavedOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<Resource | null>(null)
  const [previewBelow, setPreviewBelow] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(
    catalogue[0]?.id ?? category
  )
  const [scrolled, setScrolled] = useState(false)
  const grid = view === "grid"
  const openSearch = useCallback(() => {
    setQuery("")
    setMenuOpen(false)
    setSearchOpen(true)
  }, [])
  const explore = useCallback(() => {
    setSelected(resources[Math.floor(Math.random() * resources.length)] ?? null)
  }, [resources])
  const toggleSaved = (resource: Resource) =>
    setSavedJson(
      JSON.stringify(
        saved.includes(resource.href)
          ? saved.filter((href) => href !== resource.href)
          : [...saved, resource.href]
      )
    )
  const changeTheme = () =>
    setTheme(
      ({ auto: "light", light: "dark", dark: "auto" } as Record<Theme, Theme>)[
        theme as Theme
      ] ?? "auto"
    )
  const changeView = () => setView(grid ? "list" : "grid")
  const navigatePreview = (direction: number) => {
    const index = resources.findIndex(
      (resource) => resource.href === selected?.href
    )
    setSelected(
      resources[(index + direction + resources.length) % resources.length] ??
        null
    )
  }
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return
      if (event.key.toLowerCase() === "k") {
        event.preventDefault()
        openSearch()
      }
      if (event.key.toLowerCase() === "e") {
        event.preventDefault()
        explore()
      }
    }
    const scroll = () => {
      setScrolled(window.scrollY > 250)
      const current = catalogue
        .filter(
          (section) =>
            (document.getElementById(section.id)?.getBoundingClientRect().top ??
              Infinity) < 140
        )
        .at(-1)
      setActiveSection(current?.id ?? catalogue[0]?.id ?? category)
    }
    window.addEventListener("keydown", keydown)
    window.addEventListener("scroll", scroll, { passive: true })
    scroll()
    return () => {
      window.removeEventListener("keydown", keydown)
      window.removeEventListener("scroll", scroll)
    }
  }, [openSearch, explore, catalogue, category])
  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [menuOpen])
  const filtered = allResources.filter((resource) =>
    `${resource.name} ${resource.description} ${resource.section} ${resource.href}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  )
  const saveButton = (resource: Resource, always = false) => (
    <button
      type="button"
      className={`${styles.saveButton} ${always ? styles.alwaysVisible : ""}`}
      aria-label={`${saved.includes(resource.href) ? "Remove" : "Save"} ${resource.name} ${saved.includes(resource.href) ? "from" : "to"} bookmarks`}
      aria-pressed={saved.includes(resource.href)}
      onClick={() => toggleSaved(resource)}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        size={17}
        strokeWidth={1.4}
        fill={saved.includes(resource.href) ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  )
  const themeButton = (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={`Switch theme — currently ${theme}`}
      title={`Theme: ${theme}`}
      onClick={changeTheme}
    >
      <Icon index={11} />
    </button>
  )
  const viewButton = (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={`Switch to ${grid ? "list" : "grid"} view`}
      title={`${grid ? "List" : "Grid"} view`}
      onClick={changeView}
    >
      {grid ? (
        <HugeiconsIcon
          icon={ListViewIcon}
          size={16}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      ) : (
        <Icon index={10} />
      )}
    </button>
  )
  const navLinks = navigation.map((item, index) => (
    <Link
      key={item.label}
      className={item.id === category ? styles.activeNav : undefined}
      href={item.href}
      aria-current={item.id === category ? "page" : undefined}
      onClick={() => setMenuOpen(false)}
    >
      <Icon index={index} />
      <span>{item.label}</span>
      <small>{item.count}</small>
    </Link>
  ))
  const sectionLinks = catalogue.map((section) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      className={activeSection === section.id ? styles.activeNav : undefined}
      aria-current={activeSection === section.id ? "location" : undefined}
      onClick={() => setMenuOpen(false)}
    >
      <span>{section.title}</span>
      <small>{section.items.length}</small>
    </a>
  ))
  return (
    <div className={styles.page} data-theme={theme}>
      <div className={styles.frame}>
        <header
          className={`${styles.mobileHeader} ${scrolled ? styles.mobileHeaderVisible : ""}`}
        >
          <Link href="/inspirations">
            <Globe small />
            inspirations
          </Link>
          {themeButton}
        </header>
        <div className={styles.columns} id="top">
          <aside className={styles.sidebar}>
            <div className={styles.identity}>
              <Link href="/inspirations" aria-label="Inspirations home">
                <Globe />
              </Link>
              <span className={styles.mobileTheme}>{themeButton}</span>
              <Link className={styles.wordmark} href="/inspirations">
                inspirations<span>.design</span>
              </Link>
              <h1>{description}</h1>
            </div>
            <div className={styles.sidebarNavigation}>
              <p className={styles.kicker}>Navigation</p>
              <SidebarNavigation label="Main navigation">
                {navLinks}
              </SidebarNavigation>
              <div className={styles.sectionNavigation}>
                <p className={styles.kicker}>Sections</p>
                <SidebarNavigation label="Sections">
                  {sectionLinks}
                </SidebarNavigation>
              </div>
            </div>
            <div className={styles.sidebarBottom}>
              <div className={styles.sidebarFooter}>
                <a href="https://www.designeer.xyz/info">Info</a>
              </div>
            </div>
          </aside>
          <main className={styles.main}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarGroup}>
                <button
                  type="button"
                  onClick={() => setSavedOpen(true)}
                  aria-label="Open bookmarks"
                >
                  <Icon index={6} />
                  <kbd>Saved{saved.length > 0 ? ` ${saved.length}` : ""}</kbd>
                </button>
                <a
                  href="https://www.designeer.xyz/"
                  aria-label="Open Designeer to submit a tool"
                  title="Submit a tool on Designeer"
                >
                  <Icon index={7} />
                </a>
              </div>
              <div className={styles.toolbarGroup}>
                <button type="button" onClick={openSearch} aria-label="Search">
                  <Icon index={8} />
                  <kbd>⌘</kbd>
                  <kbd>K</kbd>
                </button>
                <span className={styles.divider} />
                <button
                  type="button"
                  onClick={explore}
                  aria-label="Explore a random resource"
                >
                  <Icon index={9} />
                  <kbd>⌘</kbd>
                  <kbd>E</kbd>
                </button>
                <span className={styles.divider} />
                {viewButton}
                {themeButton}
              </div>
            </div>
            {catalogue.map((section, index) => (
              <section
                id={section.id}
                key={section.id}
                className={styles.section}
                aria-labelledby={`${section.id}-heading`}
              >
                <div className={styles.sectionHeading}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2 id={`${section.id}-heading`}>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
                <div className={grid ? styles.grid : styles.list}>
                  {section.items.map((resource) =>
                    grid ? (
                      <div key={resource.href} className={styles.card}>
                        <button
                          className={styles.cardPreview}
                          aria-label={`Expand the preview of ${resource.name}`}
                          onClick={() => setSelected(resource)}
                        >
                          <ResourceArtwork resource={resource} />
                        </button>
                        {saveButton(resource)}
                      </div>
                    ) : (
                      <div
                        key={resource.href}
                        className={styles.row}
                        data-preview-below={previewBelow === resource.href}
                        onMouseEnter={(event) =>
                          setPreviewBelow(
                            event.currentTarget.getBoundingClientRect().top <
                              240
                              ? resource.href
                              : null
                          )
                        }
                        onFocusCapture={(event) =>
                          setPreviewBelow(
                            event.currentTarget.getBoundingClientRect().top <
                              240
                              ? resource.href
                              : null
                          )
                        }
                      >
                        <a
                          href={resource.href}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.resourceLink}
                        >
                          <ResourceIcon resource={resource} size={18} />
                          <span className={styles.resourceText}>
                            <strong>{resource.name}</strong>
                            <span className={styles.dot} aria-hidden="true" />
                            <span>{resource.description}</span>
                          </span>
                        </a>
                        {saveButton(resource)}
                        <button
                          className={styles.hoverPreview}
                          aria-label={`Expand the preview of ${resource.name}`}
                          onClick={() => setSelected(resource)}
                        >
                          <ResourceArtwork resource={resource} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </section>
            ))}
          </main>
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerIdentity}>
            <span className={styles.wordmark}>
              inspirations<span>.design</span>
            </span>
            <p>
              Collection & design by{" "}
              <a href="https://www.designeer.xyz/">Designeer</a>.
            </p>
            <Link href="/">
              Back to Matthieu&apos;s projects{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </Link>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <p className={styles.kicker}>Navigate</p>
              <nav aria-label="Footer navigation">
                {navigation.map((item) => (
                  <Link href={item.href} key={item.label}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className={styles.kicker}>Source</p>
              <a href="https://www.designeer.xyz/">
                designeer.xyz{" "}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={14}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </a>
              <p>© 2026 Dhruv Jaradi</p>
            </div>
          </div>
        </footer>
      </div>
      <div className={styles.mobileControls}>
        <button onClick={openSearch}>
          <Icon index={8} />
          Search
        </button>
        <span className={styles.divider} />
        <button
          className={styles.iconButton}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="inspirations-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            size={16}
            strokeWidth={1.4}
            aria-hidden="true"
          />
        </button>
        {viewButton}
        {menuOpen && (
          <div id="inspirations-menu" className={styles.mobileMenu}>
            <SidebarNavigation label="Mobile navigation">
              {navLinks}
            </SidebarNavigation>
            <SidebarNavigation label="Jump to section">
              {sectionLinks}
            </SidebarNavigation>
            <button
              onClick={() => {
                setMenuOpen(false)
                setSavedOpen(true)
              }}
            >
              <Icon index={6} />
              Saved resources{saved.length > 0 && <small>{saved.length}</small>}
            </button>
            <Link href="/">Back to projects</Link>
          </div>
        )}
      </div>
      {searchOpen && (
        <Modal
          label="Search resources"
          onClose={() => setSearchOpen(false)}
          className={styles.searchDialog}
        >
          <div className={styles.searchField}>
            <Icon index={8} />
            <input
              aria-label="Search resources"
              placeholder="Search..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <kbd>Esc</kbd>
            </button>
          </div>
          <div className={styles.searchResults}>
            {!query.trim() ? (
              <>
                <p>Menu</p>
                {navigation.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                  >
                    <Icon index={index} />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <p>Sections</p>
                {catalogue.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    {section.title}
                  </a>
                ))}
              </>
            ) : (
              <>
                <p>
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "resource" : "resources"}
                </p>
                {filtered.map((resource) => (
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    key={resource.href}
                  >
                    <ResourceIcon resource={resource} size={24} />
                    <span>
                      <strong>{resource.name}</strong>
                      <small>
                        {resource.section} ·{" "}
                        {new URL(resource.href).hostname.replace(/^www\./, "")}
                      </small>
                    </span>
                  </a>
                ))}
                {filtered.length === 0 && (
                  <div className={styles.empty}>
                    No resources found. Try a different search.
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>
      )}
      {savedOpen && (
        <Modal
          label="Saved resources"
          onClose={() => setSavedOpen(false)}
          className={styles.savedDialog}
        >
          <div className={styles.modalHeading}>
            <h2>
              Saved resources <small>{saved.length}</small>
            </h2>
            <button
              aria-label="Close bookmarks"
              onClick={() => setSavedOpen(false)}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={16}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </button>
          </div>
          <div className={styles.searchResults}>
            {allResources
              .filter((resource) => saved.includes(resource.href))
              .map((resource) => (
                <div className={styles.savedRow} key={resource.href}>
                  <a href={resource.href} target="_blank" rel="noreferrer">
                    <ResourceIcon resource={resource} size={24} />
                    <span>
                      <strong>{resource.name}</strong>
                      <small>{resource.description}</small>
                    </span>
                  </a>
                  {saveButton(resource, true)}
                </div>
              ))}
            {saved.length === 0 && (
              <p className={styles.empty}>
                Your collection starts here. Save a resource using the heart
                beside it.
              </p>
            )}
          </div>
        </Modal>
      )}
      {selected && (
        <Modal
          label={selected.name}
          onClose={() => setSelected(null)}
          className={styles.previewDialog}
          onNavigate={navigatePreview}
        >
          <button
            className={styles.closePreview}
            aria-label="Close preview"
            onClick={() => setSelected(null)}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={16}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </button>
          <button
            className={styles.previousPreview}
            aria-label="Previous resource"
            onClick={() => navigatePreview(-1)}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </button>
          <button
            className={styles.nextPreview}
            aria-label="Next resource"
            onClick={() => navigatePreview(1)}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </button>
          <div className={styles.expandedArtwork}>
            <ResourceArtwork resource={selected} />
          </div>
          <div className={styles.previewFooter}>
            <ResourceIcon resource={selected} size={18} />
            <strong>{selected.name}</strong>
            <span>{selected.description}</span>
            {saveButton(selected, true)}
            <a href={selected.href} target="_blank" rel="noreferrer">
              Visit site{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </a>
          </div>
        </Modal>
      )}
    </div>
  )
}
