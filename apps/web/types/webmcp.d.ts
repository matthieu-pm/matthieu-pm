import "react"

/* eslint-disable @typescript-eslint/no-unused-vars -- Type parameters must match React's merged interfaces. */
declare module "react" {
  interface FormHTMLAttributes<T> {
    toolname?: string
    tooldescription?: string
  }
  interface InputHTMLAttributes<T> {
    toolparamdescription?: string
  }
  interface TextareaHTMLAttributes<T> {
    toolparamdescription?: string
  }
}
