import type { ThemeRegistration } from "shiki";

/** Site-aligned syntax colors — light */
export const profileLight: ThemeRegistration = {
  name: "profile-light",
  type: "light",
  colors: {
    "editor.background": "#f5f5f7",
    "editor.foreground": "#1d1d1f",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#86868b" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.quoted.single",
        "string.quoted.double",
        "string.regexp",
      ],
      settings: { foreground: "#0066cc" },
    },
    {
      scope: ["constant.numeric", "constant.language"],
      settings: { foreground: "#bf4800" },
    },
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.logical",
      ],
      settings: { foreground: "#0071e3" },
    },
    {
      scope: [
        "entity.name.function",
        "entity.name.function.member",
        "support.function",
        "support.function.builtin",
        "meta.function-call",
        "meta.function-call.generic",
        "meta.member.access",
        "variable.function",
        "variable.other.property",
        "variable.other.object.property",
      ],
      settings: { foreground: "#9a7500" },
    },
    {
      scope: [
        "entity.name.tag",
        "entity.name.tag.localname",
        "meta.tag",
        "punctuation.definition.tag",
      ],
      settings: { foreground: "#0071e3" },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "entity.other.attribute-name.localname",
        "entity.other.attribute-name.namespace",
      ],
      settings: { foreground: "#5856d6" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: "#1d1d1f" },
    },
    {
      scope: ["entity.name.type", "support.type", "support.class"],
      settings: { foreground: "#0071e3" },
    },
    {
      scope: ["punctuation", "meta.brace", "punctuation.separator"],
      settings: { foreground: "#6e6e73" },
    },
    {
      scope: ["constant.character", "constant.other"],
      settings: { foreground: "#248a3d" },
    },
  ],
};

/** Site-aligned syntax colors — dark */
export const profileDark: ThemeRegistration = {
  name: "profile-dark",
  type: "dark",
  colors: {
    "editor.background": "#2c2c2e",
    "editor.foreground": "#f5f5f7",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#86868b" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.quoted.single",
        "string.quoted.double",
        "string.regexp",
      ],
      settings: { foreground: "#2997ff" },
    },
    {
      scope: ["constant.numeric", "constant.language"],
      settings: { foreground: "#ff9f0a" },
    },
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.logical",
      ],
      settings: { foreground: "#0a84ff" },
    },
    {
      scope: [
        "entity.name.function",
        "entity.name.function.member",
        "support.function",
        "support.function.builtin",
        "meta.function-call",
        "meta.function-call.generic",
        "meta.member.access",
        "variable.function",
        "variable.other.property",
        "variable.other.object.property",
      ],
      settings: { foreground: "#ffd60a" },
    },
    {
      scope: [
        "entity.name.tag",
        "entity.name.tag.localname",
        "meta.tag",
        "punctuation.definition.tag",
      ],
      settings: { foreground: "#0a84ff" },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "entity.other.attribute-name.localname",
        "entity.other.attribute-name.namespace",
      ],
      settings: { foreground: "#bf5af2" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: "#f5f5f7" },
    },
    {
      scope: ["entity.name.type", "support.type", "support.class"],
      settings: { foreground: "#64b5ff" },
    },
    {
      scope: ["punctuation", "meta.brace", "punctuation.separator"],
      settings: { foreground: "#a1a1a6" },
    },
    {
      scope: ["constant.character", "constant.other"],
      settings: { foreground: "#34c759" },
    },
  ],
};

export const profileThemes = [profileLight, profileDark] as const;

export const profileThemeNames = {
  light: "profile-light",
  dark: "profile-dark",
} as const;
