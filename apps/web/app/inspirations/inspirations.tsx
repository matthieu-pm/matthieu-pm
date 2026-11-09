"use client"

import Image from "next/image"
import { useThemeChange, useThemePreference } from "@/components/theme-provider"
import Link from "next/link"
import { createPortal } from "react-dom"
import { useSelectedLayoutSegment } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpRight01Icon,
  ArrowUp01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  ListViewIcon,
  Globe02Icon,
  VolumeHighIcon,
  VolumeMute02Icon,
  ComputerIcon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useId,
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
  isCatalogueId,
  navigation,
  type CatalogueId,
  type Resource,
} from "./catalogues"
import stack from "./data/stack.json"
import { InspirationsOrb } from "./inspirations-orb"
import { useItemSounds } from "./use-item-sounds"
import styles from "./inspirations.module.css"

const description =
  "A collection of inspiring interfaces, component libraries, AI tools, and resources for bringing ideas to life."

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
function ToolbarIcon({
  active,
  icons,
}: {
  active: string
  icons: Record<string, ReactNode>
}) {
  return (
    <span className={styles.iconTransition} aria-hidden="true">
      {Object.entries(icons).map(([state, icon]) => (
        <span
          key={state}
          className={styles.iconLayer}
          data-active={state === active}
        >
          {icon}
        </span>
      ))}
    </span>
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

type PreviewPosition = { href: string; left: number; top: number }

function stackPreviewPosition(link: HTMLAnchorElement) {
  const rect = link.getBoundingClientRect()
  const width = Math.min(300, window.innerWidth - 32)
  const height = (width * 9) / 16 + 48
  const sidebarRight = link.closest("aside")?.getBoundingClientRect().right
  const right = (sidebarRight ?? rect.right) + 12
  return {
    left: Math.max(16, Math.min(right, window.innerWidth - width - 16)),
    top: Math.max(
      16,
      Math.min(
        rect.top + (rect.height - height) / 2,
        window.innerHeight - height - 16
      )
    ),
  }
}

function MyStack() {
  const id = useId()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [preview, setPreview] = useState<{
    resource: Resource
    container: Element
    trigger: HTMLAnchorElement
    left: number
    top: number
  } | null>(null)
  const keepPreview = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const closePreview = () => {
    keepPreview()
    closeTimer.current = setTimeout(() => setPreview(null), 150)
  }
  const showPreview = (link: HTMLAnchorElement, resource: Resource) => {
    keepPreview()
    const container = link.closest("[data-theme]")
    if (!container) return
    setPreview({
      resource,
      container,
      trigger: link,
      ...stackPreviewPosition(link),
    })
  }
  useEffect(() => {
    if (!preview) return
    const dismiss = () => setPreview(null)
    const onScroll = () => {
      if (preview.trigger.matches(":focus-visible"))
        setPreview((current) =>
          current
            ? { ...current, ...stackPreviewPosition(current.trigger) }
            : null
        )
      else dismiss()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", dismiss)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", dismiss)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [preview])
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    []
  )
  return (
    <section className={styles.stackSection} aria-label="My stack">
      <h2 className={styles.stackHeading}>My stack</h2>
      <ul className={styles.stackGrid}>
        {stack.map((resource) => (
          <li key={resource.href}>
            <a
              className={styles.stackLink}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              aria-label={resource.name}
              aria-describedby={
                preview?.resource.href === resource.href ? id : undefined
              }
              onPointerEnter={(event) => {
                if (
                  event.pointerType !== "touch" &&
                  window.matchMedia("(hover: hover)").matches
                )
                  showPreview(event.currentTarget, resource)
              }}
              onPointerLeave={closePreview}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  showPreview(event.currentTarget, resource)
              }}
              onBlur={() => setPreview(null)}
              onClick={() => setPreview(null)}
            >
              <span className={styles.stackLogo}>
                <ResourceIcon resource={resource} size={20} />
              </span>
            </a>
          </li>
        ))}
      </ul>
      {preview &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            className={styles.stackPreview}
            style={{ left: preview.left, top: preview.top }}
            onPointerEnter={keepPreview}
            onPointerLeave={closePreview}
          >
            <div className={styles.stackPreviewArtwork}>
              <ResourceArtwork resource={preview.resource} />
            </div>
            <div className={styles.stackPreviewCaption}>
              <strong>{preview.resource.name}</strong>
              <span>
                {new URL(preview.resource.href).hostname.replace(/^www\./, "")}
              </span>
            </div>
          </div>,
          preview.container
        )}
    </section>
  )
}

const CatalogueControls = createContext<{
  grid: boolean
  setSelected: (resource: Resource) => void
} | null>(null)

export function Inspirations({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment()
  const category = segment && isCatalogueId(segment) ? segment : "inspiration"
  const catalogue = catalogues[category]
  const resources = useMemo(
    () =>
      catalogue.flatMap((section) =>
        section.items.map((item) => ({ ...item, section: section.title }))
      ),
    [catalogue]
  )
  const preference = useThemePreference()
  const { changeTheme: setTheme } = useThemeChange()
  const theme = preference === "system" || !preference ? "auto" : preference
  const [view, setView] = usePreference("view", "list")
  const [sound, setSound] = usePreference("sound", "on")
  const pageRef = useRef<HTMLDivElement>(null)
  useItemSounds(pageRef, sound === "on")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<Resource | null>(null)
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
  const changeTheme = () =>
    setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "system")
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
  const soundButton = (
    <button
      type="button"
      className={styles.iconButton}
      aria-label="Interface sounds"
      aria-pressed={sound === "on"}
      title={sound === "on" ? "Mute sounds" : "Enable sounds"}
      data-click-sound="off"
      onClick={() => setSound(sound === "on" ? "off" : "on")}
    >
      <ToolbarIcon
        active={sound}
        icons={{
          on: (
            <HugeiconsIcon icon={VolumeHighIcon} size={16} strokeWidth={1.4} />
          ),
          off: (
            <HugeiconsIcon
              icon={VolumeMute02Icon}
              size={16}
              strokeWidth={1.4}
            />
          ),
        }}
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
      <ToolbarIcon
        active={theme}
        icons={{
          auto: (
            <HugeiconsIcon icon={ComputerIcon} size={16} strokeWidth={1.4} />
          ),
          light: <Icon index={11} />,
          dark: <HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.4} />,
        }}
      />
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
      <ToolbarIcon
        active={grid ? "list" : "grid"}
        icons={{
          list: (
            <HugeiconsIcon icon={ListViewIcon} size={16} strokeWidth={1.4} />
          ),
          grid: <Icon index={10} />,
        }}
      />
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
    <div ref={pageRef} className={styles.page} data-theme={theme}>
      <div className={styles.frame}>
        <header
          className={`${styles.mobileHeader} ${scrolled ? styles.mobileHeaderVisible : ""}`}
        >
          <span className={styles.mobileTitle}>
            <InspirationsOrb className={styles.orb} size={24} />
            My collection
          </span>
          {themeButton}
        </header>
        <div className={styles.columns} id="top">
          <aside className={styles.sidebar}>
            <div className={styles.identity}>
              <InspirationsOrb className={styles.orb} />
              <span className={styles.mobileTheme}>{themeButton}</span>
              <span className={styles.wordmark}>My collection</span>
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
              <MyStack />
            </div>
          </aside>
          <main className={styles.main}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarGroup}>
                <button type="button" onClick={openSearch} aria-label="Search">
                  <Icon index={8} />
                  <kbd>⌘</kbd>
                  <kbd>K</kbd>
                </button>
              </div>
              <div className={styles.toolbarGroup}>
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
                {soundButton}
                {themeButton}
              </div>
            </div>
            <CatalogueControls.Provider value={{ grid, setSelected }}>
              {children}
            </CatalogueControls.Provider>
          </main>
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerIdentity}>
            <a href="https://matthieu.pm">
              Curated by Matthieu{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </a>
          </div>
          <div className={styles.footerActions}>
            <a href="https://www.designeer.xyz/">
              Inspired by Designeer{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </a>
            <a href="#top">
              Back to top{" "}
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </a>
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
        {soundButton}
        {menuOpen && (
          <div id="inspirations-menu" className={styles.mobileMenu}>
            <SidebarNavigation label="Mobile navigation">
              {navLinks}
            </SidebarNavigation>
            <SidebarNavigation label="Jump to section">
              {sectionLinks}
            </SidebarNavigation>
            <MyStack />
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

export function InspirationSections({
  category = "inspiration",
}: {
  category?: CatalogueId
}) {
  const controls = useContext(CatalogueControls)
  if (!controls)
    throw new Error("InspirationSections requires the inspirations layout")
  const { grid, setSelected } = controls
  const catalogue = catalogues[category]
  const [previewPosition, setPreviewPosition] =
    useState<PreviewPosition | null>(null)
  const positionPreview = (row: HTMLDivElement, href: string) => {
    const rect = row.getBoundingClientRect()
    const width = 300
    const height = 174
    const gutter = 16
    const topGutter = Math.max(
      gutter,
      (row.closest("main")?.firstElementChild?.getBoundingClientRect().bottom ??
        0) + 12
    )
    setPreviewPosition({
      href,
      left: Math.min(
        rect.width + 12,
        window.innerWidth - rect.left - width - gutter
      ),
      top:
        Math.max(
          topGutter,
          Math.min(
            rect.top + (rect.height - height) / 2,
            window.innerHeight - height - gutter
          )
        ) - rect.top,
    })
  }
  return (
    <>
      {catalogue.map((section, index) => (
        <section
          id={section.id}
          key={`${category}:${section.id}`}
          className={styles.section}
          style={
            {
              "--section-delay": `${index * 400}ms`,
            } as CSSProperties
          }
          aria-labelledby={`${section.id}-heading`}
        >
          <div className={styles.sectionHeading}>
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
                </div>
              ) : (
                <div
                  key={resource.href}
                  className={styles.row}
                  onMouseEnter={(event) =>
                    positionPreview(event.currentTarget, resource.href)
                  }
                  onFocusCapture={(event) =>
                    positionPreview(event.currentTarget, resource.href)
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
                  <button
                    className={styles.hoverPreview}
                    style={
                      previewPosition?.href === resource.href
                        ? {
                            left: previewPosition.left,
                            top: previewPosition.top,
                          }
                        : undefined
                    }
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
    </>
  )
}
