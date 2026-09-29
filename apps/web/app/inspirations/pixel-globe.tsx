import Image from "next/image"
import styles from "./inspirations.module.css"

export function Globe({ small = false }: { small?: boolean }) {
  return (
    <Image
      src="/inspirations/globe.png"
      alt=""
      width={100}
      height={100}
      priority
      className={`${styles.globe} ${small ? styles.smallGlobe : ""}`}
    />
  )
}
