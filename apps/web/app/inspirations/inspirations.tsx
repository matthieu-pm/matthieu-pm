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
import catalogue from "./catalogue.json"
import styles from "./inspirations.module.css"

type Resource = (typeof catalogue)[number]["items"][number]
type Theme = "auto" | "light" | "dark"
const resources = catalogue.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title }))
)
const navigation = [
  { label: "Inspiration", href: "/inspirations", count: resources.length },
  {
    label: "Components",
    href: "https://www.designeer.xyz/components",
    count: 120,
  },
  { label: "Build", href: "https://www.designeer.xyz/build", count: 64 },
  { label: "Visuals", href: "https://www.designeer.xyz/visuals", count: 55 },
  {
    label: "Utilities",
    href: "https://www.designeer.xyz/utilities",
    count: 61,
  },
  {
    label: "Design Engineers",
    href: "https://www.designeer.xyz/designers",
    count: 132,
  },
]
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
function Globe({ small = false }: { small?: boolean }) {
  return (
    <Image
      src="/inspirations/globe.png"
      alt=""
      width={100}
      height={100}
      priority
      className={small ? styles.smallGlobe : styles.globe}
    />
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
        <Image src={resource.icon!} alt="" width={42} height={42} />
        <strong>{resource.name}</strong>
        <span>{resource.description}</span>
      </div>
    </div>
  )
}

export function Inspirations() {
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
  const [activeSection, setActiveSection] = useState("inspiration")
  const [scrolled, setScrolled] = useState(false)
  const grid = view === "grid"
  const openSearch = useCallback(() => {
    setQuery("")
    setMenuOpen(false)
    setSearchOpen(true)
  }, [])
  const explore = useCallback(() => {
    setSelected(resources[Math.floor(Math.random() * resources.length)] ?? null)
  }, [])
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
      setActiveSection(current?.id ?? "inspiration")
    }
    window.addEventListener("keydown", keydown)
    window.addEventListener("scroll", scroll, { passive: true })
    scroll()
    return () => {
      window.removeEventListener("keydown", keydown)
      window.removeEventListener("scroll", scroll)
    }
  }, [openSearch, explore])
  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [menuOpen])
  const filtered = resources.filter((resource) =>
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
      <span aria-hidden="true">
        {grid ? (
          <HugeiconsIcon icon={ListViewIcon} size={16} strokeWidth={1.4} />
        ) : (
          <Icon index={10} />
        )}
      </span>
    </button>
  )
  const navLinks = navigation.map((item, index) => (
    <a
      key={item.label}
      className={index === 0 ? styles.activeNav : undefined}
      href={item.href}
      aria-current={index === 0 ? "page" : undefined}
    >
      <Icon index={index} />
      <span>{item.label}</span>
      <small>{item.count}</small>
    </a>
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
          <a href="#top">
            <Globe small />
            inspirations
          </a>
          {themeButton}
        </header>
        <div className={styles.columns} id="top">
          <aside className={styles.sidebar}>
            <div className={styles.identity}>
              <a href="#top" aria-label="Inspirations home">
                <Globe />
              </a>
              <span className={styles.mobileTheme}>{themeButton}</span>
              <a className={styles.wordmark} href="#top">
                inspirations<span>.design</span>
              </a>
              <h1>{description}</h1>
            </div>
            <div className={styles.sidebarNavigation}>
              <p className={styles.kicker}>Navigation</p>
              <nav aria-label="Main navigation">{navLinks}</nav>
              <div className={styles.sectionNavigation}>
                <p className={styles.kicker}>Sections</p>
                <nav aria-label="Sections">{sectionLinks}</nav>
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
                          <Image
                            src={resource.icon!}
                            width={18}
                            height={18}
                            alt=""
                          />
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
                  <a href={item.href} key={item.label}>
                    {item.label}
                  </a>
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
            <nav aria-label="Mobile navigation">{navLinks}</nav>
            <nav aria-label="Jump to section">{sectionLinks}</nav>
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
                  <a key={item.label} href={item.href}>
                    <Icon index={index} />
                    <span>{item.label}</span>
                  </a>
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
                    <Image src={resource.icon!} width={24} height={24} alt="" />
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
            {resources
              .filter((resource) => saved.includes(resource.href))
              .map((resource) => (
                <div className={styles.savedRow} key={resource.href}>
                  <a href={resource.href} target="_blank" rel="noreferrer">
                    <Image src={resource.icon!} width={24} height={24} alt="" />
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
            <Image src={selected.icon!} width={18} height={18} alt="" />
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
