/* Reference layout and original vector artwork captured from https://oklch.fyi/. */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import type { CSSProperties } from "react"
import { BrightnessDemo, ChromaDemo } from "./color-demos"
import { ThemePicker, Feedback, MobileMenu } from "./page-controls"
export function ReferenceContent() {
  return (
    <div className="flex w-full flex-col md:h-dvh">
      <nav className="text-gray-1200 flex w-full items-center justify-center border-gray-400 bg-transparent px-5 sm:border-b">
        <div className="flex h-(--nav-height) w-full items-center justify-between">
          <a aria-label="Home" className="flex items-center" href="/oklch">
            <Image
              className="oklch-logo"
              src="/logos/oklch-icon.webp"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
            />
          </a>
          <div className="hidden items-center gap-2 md:flex">
            <ThemePicker />
            <Feedback />
            <div className="animate-fade-in">
              <a
                className="bg-gray-1200 inline-flex h-8 shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap text-gray-100 transition-[color,background-color,border-color,fill,box-shadow,scale] duration-150 ease-out will-change-transform select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                data-slot="button"
                href="https://oklch.fyi/sign-in"
              >
                {"Sign in"}
              </a>
            </div>
          </div>
          <div className="flex md:hidden">
            <MobileMenu />
          </div>
        </div>
      </nav>
      <div className="flex w-full flex-1 md:overflow-hidden">
        <aside className="no-scrollbar hidden h-full w-56 flex-col overflow-y-auto md:flex">
          <nav className="flex flex-1 flex-col gap-0.5 p-3">
            <a
              className="hover:text-gray-1200 text-gray-1200 flex items-center gap-2 rounded-lg bg-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="/oklch"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.6861 2.83464C13.1618 1.45323 10.8382 1.45323 9.31392 2.83464L4.31392 7.36589C3.47724 8.12413 3 9.20068 3 10.3298V16.9999C3 19.2091 4.79086 20.9999 7 20.9999H8C9.10457 20.9999 10 20.1045 10 18.9999V15.9999C10 14.8954 10.8954 13.9999 12 13.9999C13.1046 13.9999 14 14.8954 14 15.9999V18.9999C14 20.1045 14.8954 20.9999 16 20.9999H17C19.2091 20.9999 21 19.2091 21 16.9999V10.3298C21 9.20069 20.5228 8.12413 19.6861 7.36589L14.6861 2.83464Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Home"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/skill"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 8C2 5.79086 3.79086 4 6 4C6.55228 4 7 4.44772 7 5C7 5.55228 6.55228 6 6 6C4.89543 6 4 6.89543 4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8ZM17 5C17 4.44772 17.4477 4 18 4C20.2091 4 22 5.79086 22 8C22 8.55228 21.5523 9 21 9C20.4477 9 20 8.55228 20 8C20 6.89543 19.1046 6 18 6C17.4477 6 17 5.55228 17 5ZM7 10C7 9.44772 7.44772 9 8 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H8C7.44772 11 7 10.5523 7 10ZM7 14C7 13.4477 7.44772 13 8 13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H8C7.44772 15 7 14.5523 7 14ZM3 15C3.55228 15 4 15.4477 4 16C4 17.1046 4.89543 18 6 18C6.55228 18 7 18.4477 7 19C7 19.5523 6.55228 20 6 20C3.79086 20 2 18.2091 2 16C2 15.4477 2.44772 15 3 15ZM21 15C21.5523 15 22 15.4477 22 16C22 18.2091 20.2091 20 18 20C17.4477 20 17 19.5523 17 19C17 18.4477 17.4477 18 18 18C19.1046 18 20 17.1046 20 16C20 15.4477 20.4477 15 21 15Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Skill"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/create"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16 12.9999C16.5523 12.9999 17 12.5522 17 11.9999C17 11.4476 16.5523 10.9999 16 10.9999L13 11V8.00012C13 7.44784 12.5523 7.00012 12 7.00012C11.4477 7.00012 11 7.44784 11 8.00012V11L7.99997 11.0001C7.44769 11.0001 6.99998 11.4479 7 12.0001C7.00002 12.5524 7.44774 13.0001 8.00003 13.0001L11 13V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V13L16 12.9999Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Create"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/convert"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.7929 2.29289C17.1834 1.90237 17.8166 1.90237 18.2071 2.29289L20.5 4.58579C21.281 5.36683 21.281 6.63316 20.5 7.41421L18.2071 9.70711C17.8166 10.0976 17.1834 10.0976 16.7929 9.70711C16.4024 9.31658 16.4024 8.68342 16.7929 8.29289L18.0858 7H7C5.89543 7 5 7.89543 5 9V11C5 11.5523 4.55228 12 4 12C3.44772 12 3 11.5523 3 11V9C3 6.79086 4.79086 5 7 5H18.0858L16.7929 3.70711C16.4024 3.31658 16.4024 2.68342 16.7929 2.29289Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M21 13C21 12.4477 20.5523 12 20 12C19.4477 12 19 12.4477 19 13V15C19 16.1046 18.1046 17 17 17H5.91406L7.20696 15.7071C7.59748 15.3166 7.59748 14.6834 7.20696 14.2929C6.81643 13.9024 6.18327 13.9024 5.79274 14.2929L3.49985 16.5858C2.7188 17.3668 2.7188 18.6332 3.49985 19.4142L5.79274 21.7071C6.18327 22.0976 6.81643 22.0976 7.20696 21.7071C7.59748 21.3166 7.59748 20.6834 7.20696 20.2929L5.91406 19H17C19.2091 19 21 17.2091 21 15V13Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Convert"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/color-palettes"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C15.7277 2 18.86 4.54954 19.748 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10V18C20 20.2091 18.2091 22 16 22H8C5.79086 22 4 20.2091 4 18V10C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H4.25195C5.14003 4.54954 8.27231 2 12 2ZM12 4C9.38772 4 7.16657 5.66984 6.34277 8H8V13C8 13.5523 8.44772 14 9 14C9.55228 14 10 13.5523 10 13V8H11V11C11 11.5523 11.4477 12 12 12C12.5523 12 13 11.5523 13 11V8H17.6572C16.8334 5.66984 14.6123 4 12 4Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Color Palettes"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/gradients"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9996 2C9.1224 2 6.78994 4.33245 6.78994 7.20968C6.78994 7.96527 6.95023 8.68097 7.23778 9.32663C7.8908 10.7929 9.20071 11.9007 10.7905 12.2785C10.9341 12.0289 11.0926 11.789 11.2646 11.5601C12.549 9.85056 14.5966 8.74194 16.9028 8.74194C16.9287 8.74194 16.9546 8.74208 16.9804 8.74236C17.1291 8.25853 17.2093 7.74408 17.2093 7.20968C17.2093 4.33245 14.8768 2 11.9996 2ZM13.1495 19.4033C14.0981 20.3887 15.429 21 16.9028 21C19.7801 21 22.1125 18.6675 22.1125 15.7903C22.1125 13.1145 20.0944 10.9087 17.4977 10.6141C17.3028 10.592 17.1043 10.5806 16.9028 10.5806C15.429 10.5806 14.0981 11.192 13.1495 12.1774C13.2932 12.4177 13.423 12.6674 13.5379 12.9253C13.9283 13.8019 14.1448 14.772 14.1448 15.7903C14.1448 17.1099 13.7814 18.3464 13.1495 19.4033ZM12.0772 14.2576C12.2259 14.7415 12.3061 15.2559 12.3061 15.7903C12.3061 16.9644 11.9188 18.0454 11.2646 18.9161C10.3126 20.1833 8.79999 21 7.0964 21C4.21917 21 1.88672 18.6675 1.88672 15.7903C1.88672 13.3296 3.59342 11.2664 5.88725 10.7215C6.97703 12.6145 8.92154 13.9547 11.1975 14.2128C11.4611 14.2427 11.7288 14.2581 11.9996 14.2581C12.0255 14.2581 12.0514 14.2579 12.0772 14.2576Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Gradients"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/gamut"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.31851 15.6642C3.32312 17.6558 4.77047 20 6.99765 20H17.0019C19.2291 20 20.6764 17.6558 19.6811 15.6642L14.6789 5.65629C13.5751 3.4479 10.4244 3.4479 9.32065 5.65629L4.31851 15.6642Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Gamut Visualizer"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/bulk-convert"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C16.5523 1.5 17 1.94772 17 2.5V4H18C20.2091 4 22 5.79086 22 8V16C22 18.2091 20.2091 20 18 20H17V21.5C17 22.0523 16.5523 22.5 16 22.5C15.4477 22.5 15 22.0523 15 21.5V2.5C15 1.94772 15.4477 1.5 16 1.5Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 8C2 5.79086 3.79086 4 6 4H13V20H6C3.79086 20 2 18.2091 2 16V8ZM7.70711 8.79289C7.31658 8.40237 6.68342 8.40237 6.29289 8.79289C5.90237 9.18342 5.90237 9.81658 6.29289 10.2071L8.08579 12L6.29289 13.7929C5.90237 14.1834 5.90237 14.8166 6.29289 15.2071C6.68342 15.5976 7.31658 15.5976 7.70711 15.2071L10.2071 12.7071C10.5976 12.3166 10.5976 11.6834 10.2071 11.2929L7.70711 8.79289Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Bulk Convert"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              href="https://oklch.fyi/saved"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2C5.79086 2 4 3.79086 4 6V19.9948C4 21.6146 5.82485 22.5625 7.15006 21.6311L10.8499 19.0306C11.54 18.5456 12.46 18.5456 13.1501 19.0306L16.8499 21.6311C18.1751 22.5625 20 21.6146 20 19.9948V6C20 3.79086 18.2091 2 16 2H8Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Saved"}</span>
            </a>
          </nav>
          <div className="mt-auto flex flex-col gap-0.5 border-t border-gray-400 p-3">
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              rel="noopener noreferrer"
              target="_blank"
              href="https://ko-fi.com/jakubkrehel"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C19.2091 6 21 7.79086 21 10C21 12.2091 19.2091 14 17 14V17C17 19.2091 15.2091 21 13 21H7C4.79086 21 3 19.2091 3 17V4ZM17 12C18.1046 12 19 11.1046 19 10C19 8.89543 18.1046 8 17 8V12Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Buy me a coffee"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              rel="noopener noreferrer"
              target="_blank"
              href="mailto:jakub@kbo.sk"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.34086 6.38914C2.1622 6.8145 2.08371 7.26454 2.0442 7.74818C1.99998 8.28936 1.99999 8.95371 2 9.75867V14.2413C1.99999 15.0463 1.99998 15.7106 2.0442 16.2518C2.09012 16.8139 2.18868 17.3306 2.43598 17.816C2.81947 18.5686 3.43139 19.1805 4.18404 19.564C4.66938 19.8113 5.18608 19.9099 5.74818 19.9558C6.28936 20 6.95371 20 7.75866 20H16.2413C17.0462 20 17.7106 20 18.2518 19.9558C18.8139 19.9099 19.3306 19.8113 19.816 19.564C20.5686 19.1805 21.1805 18.5686 21.564 17.816C21.8113 17.3306 21.9099 16.8139 21.9558 16.2518C22 15.7106 22 15.0463 22 14.2413V9.75868C22 8.95372 22 8.28937 21.9558 7.74818C21.9163 7.26453 21.8378 6.81449 21.6591 6.38912L14.5329 12.2196C13.0595 13.4252 10.9405 13.4252 9.46703 12.2196L2.34086 6.38914Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M20.4224 4.8169C20.233 4.67277 20.0302 4.54512 19.816 4.43598C19.3306 4.18868 18.8139 4.09012 18.2518 4.0442C17.7106 3.99998 17.0463 3.99999 16.2413 4H7.7587C6.95375 3.99999 6.28936 3.99998 5.74818 4.0442C5.18608 4.09012 4.66938 4.18868 4.18404 4.43598C3.96982 4.54512 3.76701 4.67278 3.57762 4.81691L10.7335 10.6717C11.4702 11.2745 12.5297 11.2745 13.2665 10.6717L20.4224 4.8169Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"Contact"}</span>
            </a>
            <a
              className="hover:text-gray-1200 text-gray-1100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-300 active:bg-gray-300"
              rel="noopener noreferrer"
              target="_blank"
              href="https://x.com/jakubkrehel"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5652 3.25H20.5319L14.0505 10.6628L21.6753 20.75H15.7052L11.0291 14.6322L5.67867 20.75H2.71017L9.64264 12.8212L2.32812 3.25H8.44986L12.6766 8.84192L17.5652 3.25ZM16.524 18.9731H18.1679L7.55662 4.93359H5.79256L16.524 18.9731Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>{"X (Twitter)"}</span>
            </a>
          </div>
        </aside>
        <main
          className="bg-gray-background relative flex w-full flex-1 flex-col border-gray-400 md:border-l"
          id="main-content"
        >
          <div className="flex-1 overflow-y-auto p-5 md:p-0">
            <section className="mx-auto flex w-full max-w-7xl items-center justify-center gap-8 py-0 md:p-6 2xl:p-12">
              <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center pt-12 pb-16">
                <div className="flex w-full flex-col items-center gap-6 text-center">
                  <div className="flex items-center [&>*:not(:first-child)]:-ml-8">
                    <div
                      className="bg-preview-bg shadow-custom flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "-16deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(98.5%_0_0)] dark:bg-[oklch(20%_0_0)]"></div>
                    </div>
                    <div
                      className="bg-preview-bg shadow-custom mb-3 flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "-12deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(97%_0_0)] dark:bg-[oklch(25%_0_0)]"></div>
                    </div>
                    <div
                      className="bg-preview-bg shadow-custom mb-5 flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "-4deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(92.2%_0_0)] dark:bg-[oklch(30%_0_0)]"></div>
                    </div>
                    <div
                      className="bg-preview-bg shadow-custom mb-6 flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "0deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(87%_0_0)] dark:bg-[oklch(40%_0_0)]"></div>
                    </div>
                    <div
                      className="bg-preview-bg shadow-custom mb-5 flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "4deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(70.8%_0_0)] dark:bg-[oklch(55%_0_0)]"></div>
                    </div>
                    <div
                      className="bg-preview-bg shadow-custom mb-3 flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "12deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(55.6%_0_0)] dark:bg-[oklch(70%_0_0)]"></div>
                    </div>
                    <div
                      className="bg-preview-bg shadow-custom flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2"
                      style={{ rotate: "16deg" } as CSSProperties}
                    >
                      <div className="outline-subtle size-12 rounded-xl bg-[oklch(43.9%_0_0)] dark:bg-[oklch(80%_0_0)]"></div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center gap-3 text-center">
                    <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-[40px]">
                      {"OKLCH: a clearer way to work with color"}
                    </h1>
                    <p className="text-text-paragraph max-w-2xl text-base sm:text-lg">
                      Get a feel for lightness, chroma, and hue with interactive
                      examples. See how OKLCH helps you build balanced palettes
                      and work with color in CSS.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
                  <a
                    className="bg-gray-1200 inline-flex h-10 w-full shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-[10px] px-4 pr-4 pl-3 text-sm font-medium whitespace-nowrap text-gray-100 transition-[color,background-color,border-color,fill,box-shadow,scale] duration-150 ease-out will-change-transform select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20 sm:w-auto [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    data-slot="button"
                    href="https://oklch.fyi/create"
                  >
                    <svg
                      className="size-5 text-gray-100"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16 12.9999C16.5523 12.9999 17 12.5522 17 11.9999C17 11.4476 16.5523 10.9999 16 10.9999L13 11V8.00012C13 7.44784 12.5523 7.00012 12 7.00012C11.4477 7.00012 11 7.44784 11 8.00012V11L7.99997 11.0001C7.44769 11.0001 6.99998 11.4479 7 12.0001C7.00002 12.5524 7.44774 13.0001 8.00003 13.0001L11 13V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V13L16 12.9999Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    {"Create"}
                  </a>
                  <a
                    className="bg-preview-bg text-gray-1200 shadow-custom hover:shadow-custom-hover inline-flex h-10 w-full shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-[10px] px-4 text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,fill,box-shadow,scale] duration-150 ease-out will-change-transform select-none hover:bg-gray-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20 sm:w-auto [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    data-slot="button"
                    href="https://oklch.fyi/color-palettes"
                  >
                    {"Explore"}
                  </a>
                </div>
                <article className="w-full max-w-173">
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Understanding OKLCH"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    OKLCH describes a color with three values: lightness (L),
                    chroma (C), and hue (H). These values aim to follow how we
                    perceive color, making visual adjustments more predictable.
                    You can use them directly in CSS with{" "}
                    <code className="code-inline">oklch()</code>.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
                      <div className="bg-gray-background flex h-full w-full p-1">
                        <div className="border-preview-border bg-preview-bg flex h-full w-full items-center justify-center overflow-hidden rounded-lg border py-12">
                          <div className="flex gap-4 sm:gap-6">
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 280)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 254.9)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 220)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 180)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 140)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 100)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 60)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 20)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="bg-preview-bg shadow-custom flex h-40 w-10 shrink-0 items-center justify-center rounded-full p-2">
                              <div
                                className="outline-subtle h-full w-full rounded-full"
                                style={
                                  {
                                    backgroundColor: "oklch(0.8 0.193 0)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Different ways to describe color"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    To see what makes OKLCH useful, start with two ideas: how a
                    color is described and which colors a display can reproduce.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    A color model expresses color as a set of values. You may
                    already work with RGB, HSL, LCH, or OKLCH. Each gives you a
                    different set of controls, which shapes how you choose and
                    adjust colors.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
                      <div className="bg-gray-background flex h-full w-full p-1">
                        <div className="border-preview-border bg-preview-bg flex h-full w-full items-center justify-center overflow-hidden rounded-lg border">
                          <div className="flex w-full flex-wrap items-center justify-center gap-2 px-4 py-16">
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"oklch(0.55 0.18 260)"}
                            </span>
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"hsl(220 100% 50%)"}
                            </span>
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"rgb(0, 128, 255)"}
                            </span>
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"lch(60% 60 260)"}
                            </span>
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"lab(50 -10 -50)"}
                            </span>
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"color(xyz 0.18 0.19 0.6)"}
                            </span>
                            <span className="bg-preview-bg shadow-custom font-berkeley-mono text-gray-1200 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                              {"#1E90FF"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Which colors can a display show?"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    A gamut is a range of reproducible colors. Two common
                    examples are sRGB, the familiar baseline for web content,
                    and Display-P3, which reaches more vivid colors on
                    compatible screens.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
                      <div className="bg-gray-background flex h-full w-full p-1">
                        <div className="border-preview-border bg-preview-bg flex h-full w-full items-center justify-center overflow-hidden rounded-lg border py-16">
                          <div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center">
                            <img
                              alt="Gamut"
                              width="1000"
                              height="1000"
                              decoding="async"
                              style={{ color: "transparent" } as CSSProperties}
                              src="/oklch/color-wheel.avif"
                            />
                            <div className="absolute top-14 right-1 flex items-center justify-center gap-2">
                              <span className="flex h-0.5 w-16 items-center justify-center rounded-full bg-gray-600 dark:bg-gray-400"></span>
                              <span className="bg-preview-bg shadow-custom font-berkeley-mono flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                                {"Display-P3"}
                              </span>
                            </div>
                            <div className="absolute right-2 bottom-44 flex items-center justify-center gap-2">
                              <span className="flex h-0.5 w-16 items-center justify-center rounded-full bg-gray-600 dark:bg-gray-400"></span>
                              <span className="bg-preview-bg shadow-custom font-berkeley-mono flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                                {"sRGB"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex w-full items-center justify-center text-center">
                      <a
                        className="hover:text-gray-1200 text-sm text-gray-900 transition-colors duration-150 ease-out"
                        href="https://en.wikipedia.org/wiki/CIE_1931_color_space"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"CIE 1931 xy chromaticity diagram"}
                      </a>
                    </div>
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    A color space specifies more than this range. It also
                    defines details such as its white point and how encoded
                    values relate to light, known as its transfer function.
                  </p>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Reading an OKLCH value"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    OKLCH and LCH both use lightness, chroma, and hue. Their
                    values come from different underlying color spaces. OKLCH is
                    the cylindrical form of{" "}
                    <a
                      className="hover:text-gray-1200 hover:decoration-gray-1200 underline decoration-gray-900 underline-offset-3 transition-colors duration-200 ease-out"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://en.wikipedia.org/wiki/Oklab_color_space"
                    >
                      Oklab
                    </a>
                    .
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Lightness: how light or dark a color appears. Use a number
                    from 0 to 1, or a percentage from 0% to 100%.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Chroma: how colorful a color is. Zero gives you a neutral
                    gray; higher values increase its intensity.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Hue: the color’s position around a circle, expressed as an
                    angle. A full turn is 360 degrees, bringing you back to the
                    starting hue.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div
                      className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl"
                      style={{ height: "240px" } as CSSProperties}
                    >
                      <div className="bg-gray-background flex h-full w-full p-1">
                        <div className="border-preview-border bg-preview-bg flex h-full w-full items-center justify-center overflow-hidden rounded-lg border">
                          <div className="bg-preview-bg font-berkeley-mono shadow-custom mb-8 flex gap-2 rounded-full px-4 py-2 select-none sm:px-6 sm:py-3 dark:bg-gray-100">
                            <span className="text-gray-1200 text-center text-lg font-medium sm:text-4xl">
                              {"oklch"}
                            </span>
                            <span className="text-gray-1200 text-center text-lg font-medium sm:text-4xl">
                              {"("}
                            </span>
                            <div className="flex items-center gap-8">
                              <div className="relative flex flex-col items-center justify-center gap-2">
                                <span className="text-gray-1200 text-center text-lg font-medium sm:text-4xl">
                                  {"0.5"}
                                </span>
                                <div className="absolute -bottom-18 flex flex-col items-center justify-center gap-2">
                                  <span className="flex h-8 w-0.5 items-center justify-center rounded-full bg-gray-900"></span>
                                  <span className="bg-preview-bg shadow-custom mr-16 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none sm:mr-0 dark:bg-gray-100">
                                    {"Lightness"}
                                  </span>
                                </div>
                              </div>
                              <div className="relative flex flex-col items-center justify-center gap-2">
                                <span className="text-gray-1200 text-center text-lg font-medium sm:text-4xl">
                                  {"0.2"}
                                </span>
                                <div className="absolute -bottom-18 flex flex-col items-center justify-center gap-2">
                                  <span className="flex h-8 w-0.5 items-center justify-center rounded-full bg-gray-900"></span>
                                  <span className="bg-preview-bg shadow-custom flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none dark:bg-gray-100">
                                    {"Chroma"}
                                  </span>
                                </div>
                              </div>
                              <div className="relative flex flex-col items-center justify-center gap-2">
                                <span className="text-gray-1200 text-center text-lg font-medium sm:text-4xl">
                                  {"40"}
                                </span>
                                <div className="absolute -bottom-18 flex flex-col items-center justify-center gap-2">
                                  <span className="flex h-8 w-0.5 items-center justify-center rounded-full bg-gray-900"></span>
                                  <span className="bg-preview-bg shadow-custom ml-8 flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none sm:ml-0 dark:bg-gray-100">
                                    {"Hue"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-gray-1200 text-center text-lg font-medium sm:text-4xl">
                              {")"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Balancing colors across a palette"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Imagine a set of buttons in different colors. You want each
                    to carry a similar visual weight, but matching them by eye
                    can take several rounds of adjustment.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    With OKLCH, start with a shared lightness and chroma, then
                    vary the hue. The resulting colors tend to feel more
                    balanced, giving you a useful starting point for a palette.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <BrightnessDemo />
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Try the same approach in HSL. As the comparison shows, equal
                    lightness values do not necessarily look equally light. Some
                    hues stand out much more than others.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    That perceptual consistency is a practical reason to choose
                    OKLCH. It reduces the guesswork involved in building a
                    palette whose colors feel related.
                  </p>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Building a range of shades"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    To build lighter and darker shades of a color, adjust
                    lightness while keeping hue and chroma fixed. Within the
                    available gamut, this helps preserve the color’s character
                    across the range.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div
                      className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl"
                      style={{ height: "240px" } as CSSProperties}
                    >
                      <div className="bg-gray-background flex h-full w-full p-1">
                        <div className="border-preview-border bg-preview-bg flex h-full w-full items-center justify-center overflow-hidden rounded-lg border">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="font-berkeley-mono flex h-10 w-24 items-center justify-center rounded-full border border-gray-400 bg-gray-200 py-1 font-medium select-none sm:hidden">
                              {"OKLCH"}
                            </div>
                            <div className="flex items-center justify-center gap-1 rounded-full border border-gray-400 p-1 shadow-xs">
                              <div className="font-berkeley-mono hidden h-10 w-24 items-center justify-center rounded-full border border-gray-400 bg-gray-200 py-1 font-medium select-none sm:flex">
                                {"OKLCH"}
                              </div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.25 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.35 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.45 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.55 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.65 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.75 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.85 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "oklch(0.92 0.18 260)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                            <div className="font-berkeley-mono flex h-10 w-24 items-center justify-center rounded-full border border-gray-400 bg-gray-200 py-1 font-medium select-none sm:hidden">
                              {"HSL"}
                            </div>
                            <div className="flex items-center justify-center gap-1 rounded-full border border-gray-400 p-1 shadow-xs">
                              <div className="font-berkeley-mono hidden h-10 w-24 items-center justify-center rounded-full border border-gray-400 bg-gray-200 py-1 font-medium select-none sm:flex">
                                {"HSL"}
                              </div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 25%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 35%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 45%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 55%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 65%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 75%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 85%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <div
                                className="outline-subtle relative size-8 rounded-full sm:size-10"
                                style={
                                  {
                                    backgroundColor: "hsl(220 100% 92%)",
                                  } as CSSProperties
                                }
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Compare the two blue scales above. The OKLCH scale keeps a
                    more consistent sense of blue, while the HSL scale shows
                    more variation in how the hue and intensity appear as the
                    shades get lighter or darker.
                  </p>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"How gradients travel between colors"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    A gradient’s intermediate colors depend on the color space
                    used to mix its endpoints. An OKLCH gradient can look quite
                    different from an RGB gradient, where mixing red, green, and
                    blue channels can produce a dull midpoint or uneven
                    lightness.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div
                      className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl p-1"
                      style={{ height: "240px" } as CSSProperties}
                    >
                      <div className="flex h-full w-full items-center justify-center gap-1">
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl">
                          <span className="font-berkeley-mono text-gray-1200 w-full px-2 font-medium uppercase">
                            {"srgb"}
                          </span>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              {
                                background:
                                  "linear-gradient(in srgb, #ff00ff, #00ff00)",
                              } as CSSProperties
                            }
                          ></div>
                        </div>
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl">
                          <span className="font-berkeley-mono text-gray-1200 w-full px-2 font-medium uppercase">
                            {"oklab"}
                          </span>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              {
                                background:
                                  "linear-gradient(in oklab, #ff00ff, #00ff00)",
                              } as CSSProperties
                            }
                          ></div>
                        </div>
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl">
                          <span className="font-berkeley-mono text-gray-1200 w-full px-2 font-medium uppercase">
                            {"oklch"}
                          </span>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              {
                                background:
                                  "linear-gradient(in oklch, #ff00ff, #00ff00)",
                              } as CSSProperties
                            }
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    In OKLCH, interpolation changes lightness, chroma, and hue.
                    The comparison uses identical endpoints, so any difference
                    you see comes from the route between them.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
                      <div className="bg-gray-background flex h-full w-full p-1">
                        <div className="border-preview-border bg-preview-bg flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
                          <div className="flex h-full w-full items-center justify-center px-4 pt-16 pb-8">
                            <div className="relative aspect-square w-full max-w-60 rounded-full border-2 border-dashed border-gray-400">
                              <span className="absolute top-1/2 left-1/2 h-full w-0.5 -translate-x-1/2 -translate-y-1/2 bg-blue-500"></span>
                              <div
                                className="absolute -inset-0.5 rounded-full border-2 border-red-500"
                                style={
                                  {
                                    clipPath:
                                      "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                                  } as CSSProperties
                                }
                              ></div>
                              <span className="bg-preview-bg shadow-custom font-berkeley-mono absolute top-1/2 -right-9 flex w-18 -translate-y-1/2 items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                                {"Yellow"}
                              </span>
                              <span className="bg-preview-bg shadow-custom font-berkeley-mono absolute top-1/2 -left-9 z-(--z-above) flex w-18 -translate-y-1/2 items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                                {"Blue"}
                              </span>
                              <span className="bg-preview-bg shadow-custom font-berkeley-mono absolute -top-4 left-1/2 z-(--z-above) flex w-18 -translate-x-1/2 items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                                {"Green"}
                              </span>
                              <span className="bg-preview-bg shadow-custom font-berkeley-mono absolute right-1/2 -bottom-4 left-1/2 z-(--z-above) flex w-18 -translate-x-1/2 items-center justify-center rounded-full px-3 py-1 text-sm font-medium select-none">
                                {"Red"}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-full items-center justify-center gap-4 py-8">
                            <div className="font-berkeley-mono flex items-center justify-center gap-2">
                              {"OKLCH"}
                              <span className="h-2 w-8 rounded-full bg-red-500"></span>
                            </div>
                            <div className="font-berkeley-mono flex items-center justify-center gap-2">
                              {"OKLAB & SRGB"}
                              <span className="h-2 w-8 rounded-full bg-blue-500"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    That route may pass through hues you did not expect. In
                    OKLCH, hue follows a circle, so moving between two colors
                    can introduce a whole sequence of hues along the way.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    For a different result, try interpolating in Oklab. It takes
                    a straight path through its color coordinates instead of
                    following the hue circle, which can make the transition
                    easier to anticipate.
                  </p>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Going beyond sRGB"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Some screens can reproduce colors beyond the sRGB range.
                    With OKLCH, you can specify these wider-gamut colors too,
                    including those available on Display-P3 screens.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <div
                      className="bg-preview-bg shadow-custom flex w-full flex-col items-center justify-center overflow-hidden rounded-xl"
                      style={{ height: "400px" } as CSSProperties}
                    >
                      <div className="flex h-full w-full items-center justify-center gap-1 p-1">
                        <div className="flex h-full w-full flex-col items-center gap-1 rounded-xl">
                          <span className="font-berkeley-mono text-gray-1200 w-full px-2 font-medium select-none">
                            {"sRGB"}
                          </span>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              { backgroundColor: "#ff0022" } as CSSProperties
                            }
                          ></div>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              { backgroundColor: "#00fc15" } as CSSProperties
                            }
                          ></div>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              { backgroundColor: "#ffe000" } as CSSProperties
                            }
                          ></div>
                        </div>
                        <div className="flex h-full w-full flex-col items-center gap-1 rounded-xl">
                          <span className="font-berkeley-mono text-gray-1200 w-full px-2 font-medium select-none">
                            {"Display-P3"}
                          </span>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              {
                                backgroundColor: "oklch(0.6471 0.296 26.47)",
                              } as CSSProperties
                            }
                          ></div>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              {
                                backgroundColor: "oklch(0.85 0.3601 145.06)",
                              } as CSSProperties
                            }
                          ></div>
                          <div
                            className="outline-subtle relative h-full w-full rounded-lg"
                            style={
                              {
                                backgroundColor: "oklch(0.903 0.216 101)",
                              } as CSSProperties
                            }
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    On a Display-P3 screen, the swatches on the right can look
                    more vivid. On an sRGB screen, the two sets may appear
                    almost the same because the browser has to bring unsupported
                    colors into the display’s range.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    The wider gamut adds room for more colorful shades. Neutral
                    grays do not gain extra intensity in Display-P3.
                  </p>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Finding the chroma limit"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    OKLCH values can describe colors beyond a display’s
                    capabilities. Valid CSS does not guarantee that a color fits
                    inside sRGB or Display-P3.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Consider{" "}
                    <code className="code-inline">oklch(0.7 0.4 40)</code>. Its
                    chroma of 0.4 places it outside both sRGB and Display-P3 at
                    this lightness and hue.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    The browser must bring an unsupported color into the
                    available gamut through clipping or gamut mapping. What you
                    see is a representable substitute.
                  </p>
                  {"\n"}
                  <figure data-rehype-pretty-code-figure="">
                    <pre
                      className="tab-4 bg-preview-bg font-berkeley-mono shadow-custom **:font-berkeley-mono my-8 w-full overflow-x-auto rounded-xl py-4 text-[13px]"
                      tabIndex={0}
                      data-language="css"
                      data-theme="pierre-dark-vibrant pierre-light-vibrant"
                    >
                      <code
                        data-language="css"
                        data-theme="pierre-dark-vibrant pierre-light-vibrant"
                        style={{ display: "grid" } as CSSProperties}
                      >
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"@"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.994741 0.445201 0.573499)",
                                "--shiki-light":
                                  "color(display-p3 0.834880 0.207921 0.387456)",
                              } as CSSProperties
                            }
                          >
                            {"layer"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.980392 0.980392 0.980392)",
                                "--shiki-light":
                                  "color(display-p3 0.039216 0.039216 0.039216)",
                              } as CSSProperties
                            }
                          >
                            {" base "}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"{"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"  :"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                                "--shiki-light":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                              } as CSSProperties
                            }
                          >
                            {"root"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {" {"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                                "--shiki-light":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                              } as CSSProperties
                            }
                          >
                            {"    color"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.615613 0.445256 1.000000)",
                                "--shiki-light":
                                  "color(display-p3 0.391345 0.215644 0.853560)",
                              } as CSSProperties
                            }
                          >
                            {" oklch"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"("}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {"0.7"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0.4"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 40"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {");"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"  }"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"}"}
                          </span>
                        </span>
                      </code>
                    </pre>
                  </figure>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    This adjustment can change the appearance you intended.
                    Checking the gamut helps you spot those changes before
                    relying on a color in your design.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Maximum chroma is the highest chroma that fits within a
                    chosen gamut for a given lightness and hue. Change any of
                    those conditions and the limit changes too.
                  </p>
                  {"\n"}
                  <div className="my-8 flex w-full flex-col items-center">
                    <ChromaDemo />
                    <div className="mt-4 flex w-full items-center justify-center text-center">
                      <span className="text-sm text-gray-900 select-none">
                        {
                          "The solid line is sRGB, the dashed line is Display P3."
                        }
                      </span>
                    </div>
                  </div>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    The colored band runs through the hues at a single
                    lightness. Each line shows a gamut’s chroma limit; values
                    above it need to be mapped or clipped. Adjust lightness to
                    see how those limits shift.
                  </p>
                  {"\n"}
                  <h2 className="text-gray-1200 mt-16 mb-3 flex w-full items-center gap-3 font-[550] sm:mt-20">
                    {"Using OKLCH with CSS fallbacks"}
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gray-400"
                    ></span>
                  </h2>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    OKLCH is defined in{" "}
                    <a
                      className="hover:text-gray-1200 hover:decoration-gray-1200 underline decoration-gray-900 underline-offset-3 transition-colors duration-200 ease-out"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.w3.org/TR/css-color-4/"
                    >
                      CSS Color Module Level 4
                    </a>
                    . For environments that do not recognize the syntax, provide
                    a fallback color.
                  </p>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Start with an sRGB color, then add your OKLCH value inside
                    an <code className="code-inline">@supports</code> rule. This
                    lets the browser select the version it understands.
                  </p>
                  {"\n"}
                  <figure data-rehype-pretty-code-figure="">
                    <pre
                      className="tab-4 bg-preview-bg font-berkeley-mono shadow-custom **:font-berkeley-mono my-8 w-full overflow-x-auto rounded-xl py-4 text-[13px]"
                      tabIndex={0}
                      data-language="css"
                      data-theme="pierre-dark-vibrant pierre-light-vibrant"
                    >
                      <code
                        data-language="css"
                        data-theme="pierre-dark-vibrant pierre-light-vibrant"
                        style={{ display: "grid" } as CSSProperties}
                      >
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"@"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.994741 0.445201 0.573499)",
                                "--shiki-light":
                                  "color(display-p3 0.834880 0.207921 0.387456)",
                              } as CSSProperties
                            }
                          >
                            {"layer"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.980392 0.980392 0.980392)",
                                "--shiki-light":
                                  "color(display-p3 0.039216 0.039216 0.039216)",
                              } as CSSProperties
                            }
                          >
                            {" base "}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"{"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"  :"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                                "--shiki-light":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                              } as CSSProperties
                            }
                          >
                            {"root"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {" {"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.450980 0.450980 0.450980)",
                                "--shiki-light":
                                  "color(display-p3 0.450980 0.450980 0.450980)",
                              } as CSSProperties
                            }
                          >
                            {"    /* sRGB hex */"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.688063 0.418777)",
                                "--shiki-light":
                                  "color(display-p3 0.854172 0.502144 0.209646)",
                              } as CSSProperties
                            }
                          >
                            {"    --color-gray-50"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.868456 0.454295)",
                                "--shiki-light":
                                  "color(display-p3 0.883654 0.721037 0.210874)",
                              } as CSSProperties
                            }
                          >
                            {" #fcfcfc"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {";"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.688063 0.418777)",
                                "--shiki-light":
                                  "color(display-p3 0.854172 0.502144 0.209646)",
                              } as CSSProperties
                            }
                          >
                            {"    --color-gray-100"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.868456 0.454295)",
                                "--shiki-light":
                                  "color(display-p3 0.883654 0.721037 0.210874)",
                              } as CSSProperties
                            }
                          >
                            {" #f9f9f9"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {";"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.688063 0.418777)",
                                "--shiki-light":
                                  "color(display-p3 0.854172 0.502144 0.209646)",
                              } as CSSProperties
                            }
                          >
                            {"    --color-gray-200"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.868456 0.454295)",
                                "--shiki-light":
                                  "color(display-p3 0.883654 0.721037 0.210874)",
                              } as CSSProperties
                            }
                          >
                            {" #f0f0f0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {";"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line=""> </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.980392 0.980392 0.980392)",
                                "--shiki-light":
                                  "color(display-p3 0.039216 0.039216 0.039216)",
                              } as CSSProperties
                            }
                          >
                            {"    @supports ("}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                                "--shiki-light":
                                  "color(display-p3 0.327292 0.790977 0.995660)",
                              } as CSSProperties
                            }
                          >
                            {"color"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.615613 0.445256 1.000000)",
                                "--shiki-light":
                                  "color(display-p3 0.391345 0.215644 0.853560)",
                              } as CSSProperties
                            }
                          >
                            {" oklch"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"("}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {"0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {")"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.980392 0.980392 0.980392)",
                                "--shiki-light":
                                  "color(display-p3 0.039216 0.039216 0.039216)",
                              } as CSSProperties
                            }
                          >
                            {") {"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.450980 0.450980 0.450980)",
                                "--shiki-light":
                                  "color(display-p3 0.450980 0.450980 0.450980)",
                              } as CSSProperties
                            }
                          >
                            {"      /* OKLCH */"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.688063 0.418777)",
                                "--shiki-light":
                                  "color(display-p3 0.854172 0.502144 0.209646)",
                              } as CSSProperties
                            }
                          >
                            {"      --color-gray-50"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.615613 0.445256 1.000000)",
                                "--shiki-light":
                                  "color(display-p3 0.391345 0.215644 0.853560)",
                              } as CSSProperties
                            }
                          >
                            {" oklch"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"("}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {"0.991"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {");"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.688063 0.418777)",
                                "--shiki-light":
                                  "color(display-p3 0.854172 0.502144 0.209646)",
                              } as CSSProperties
                            }
                          >
                            {"      --color-gray-100"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.615613 0.445256 1.000000)",
                                "--shiki-light":
                                  "color(display-p3 0.391345 0.215644 0.853560)",
                              } as CSSProperties
                            }
                          >
                            {" oklch"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"("}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {"0.982"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {");"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 1.000000 0.688063 0.418777)",
                                "--shiki-light":
                                  "color(display-p3 0.854172 0.502144 0.209646)",
                              } as CSSProperties
                            }
                          >
                            {"      --color-gray-200"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {":"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.615613 0.445256 1.000000)",
                                "--shiki-light":
                                  "color(display-p3 0.391345 0.215644 0.853560)",
                              } as CSSProperties
                            }
                          >
                            {" oklch"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"("}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {"0.955"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.452682 0.814110 0.989434)",
                                "--shiki-light":
                                  "color(display-p3 0.246852 0.642335 0.817202)",
                              } as CSSProperties
                            }
                          >
                            {" 0"}
                          </span>
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {");"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"    }"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                                "--shiki-light":
                                  "color(display-p3 0.388235 0.388235 0.388235)",
                              } as CSSProperties
                            }
                          >
                            {"  }"}
                          </span>
                        </span>
                        {"\n"}
                        <span data-line="">
                          <span
                            style={
                              {
                                "--shiki-dark":
                                  "color(display-p3 0.980392 0.980392 0.980392)",
                                "--shiki-light":
                                  "color(display-p3 0.039216 0.039216 0.039216)",
                              } as CSSProperties
                            }
                          >
                            {"}"}
                          </span>
                        </span>
                      </code>
                    </pre>
                  </figure>
                  {"\n"}
                  <p className="text-text-paragraph w-full [&+p]:mt-6">
                    Browsers that pass the feature check apply OKLCH; the others
                    keep the sRGB fallback. The notation itself does not make a
                    color more vivid. An OKLCH color within sRGB looks the same
                    as its equivalent hex value.
                  </p>
                </article>
                <footer className="mt-16 flex w-full max-w-173 items-center justify-end sm:mt-20">
                  <span className="oklch-signature-frame">
                    <Image
                      className="oklch-signature-image"
                      src="/images/signature-matthieu.webp"
                      alt="Matthieu Duchatellier signature"
                      width={220}
                      height={213}
                    />
                  </span>
                </footer>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
