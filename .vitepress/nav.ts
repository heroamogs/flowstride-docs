export const nav = [
  { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
  { text: 'Manual testing', link: '/manual-workspace/manual-testing', activeMatch: '/manual-workspace/' },
  { text: 'Language', link: '/flow-language/getting-started/variables', activeMatch: '/flow-language/' },
  { text: 'CI & games', items: [
    { text: 'Native CI', link: '/guide/native-ci-games' },
    { text: 'Browser games', link: '/games/getting-started' },
    { text: 'Reports & evidence', link: '/reporting/artifacts' }
  ] },
  { text: 'Cloud', link: '/cloud/authentication', activeMatch: '/cloud/' }
];
