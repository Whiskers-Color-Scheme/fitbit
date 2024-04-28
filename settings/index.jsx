const bgColors = [{ color: "#FFF9F0" }, { color: "#0E0600" }, { color: "#000" }];

const lightAccentColors = [
  { color: "#A87B0A" },
  { color: "#5284BE" },
  { color: "#B43A2A" },
  { color: "#7D0E70" },
  { color: "#6A9534" },
  { color: "#C15D01" },
];

const darkAccentColors = [
  { color: "#FFE072" },
  { color: "#A5CEFF" },
  { color: "#FF8C7C" },
  { color: "#FFAAF5" },
  { color: "#B1E380" },
  { color: "#FFB26C" },
];

registerSettingsPage(({ settings }) => (
  <Page>
    <Section title="Background">
      <ColorSelect settingsKey="background" colors={bgColors} />
    </Section>
    <Section title="Light Accent">
      <ColorSelect settingsKey="lightAccent" colors={lightAccentColors} />
    </Section>
    <Section title="Dark Accent">
      <ColorSelect settingsKey="darkAccent" colors={darkAccentColors} />
    </Section>
    <Section title="Other Settings">
      <Toggle settingsKey="tintHours" label="Tint Hours" />
      <Toggle settingsKey="tintMinutes" label="Tint Minutes" />
    </Section>
  </Page>
));
