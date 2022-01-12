export default [
  {
    label: 'appearance',
    children: [
      {
        component: 'theme-selector',
        label: 'themeLabel',
        description: 'themeDescription',
        path: 'appearance.theme'
      },
      {
        component: 'font-selector',
        label: 'appFontTitle',
        description: 'appFontDescription',
        path: 'appearance.font',
      },
    ]
  },
  {
    label: 'control',
    children: [
      {
        component: 'select',
        label: 'verseNumberClickEventTitle',
        description: 'verseNumberClickEventDescription',
        enum: ['openTranslationsComparator', 'openCrossreferencesSearcher'],
        path: 'control.verseNumberClickEvent'
      }
    ]
  },
]
