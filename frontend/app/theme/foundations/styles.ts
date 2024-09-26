const styles = {
  global: () => ({
    body: {
      bg: "neutral.0",
    },

  }),
} as const

export type styles = typeof styles

export default styles
