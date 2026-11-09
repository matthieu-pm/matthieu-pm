import { nextJsConfig } from "@workspace/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    rules: {
      // Experimental WebMCP form attributes are not in eslint-plugin-react yet.
      "react/no-unknown-property": [
        "warn",
        {
          ignore: ["toolname", "tooldescription", "toolparamdescription"],
        },
      ],
    },
  },
]
