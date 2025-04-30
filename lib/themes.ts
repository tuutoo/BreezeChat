export const THEMES = [
    {
      name: "默认",
      value: "default",
    },
    {
      name: "中性",
      value: "neutral",
    },
    {
      name: "石头",
      value: "stone",
    },
    {
      name: "锌",
      value: "zinc",
    },
    {
      name: "灰色",
      value: "gray",
    },
    {
      name: "石板灰",
      value: "slate",
    },
    {
      name: "缩放",
      value: "scaled",
    },
  ]
  export type Theme = (typeof THEMES)[number]