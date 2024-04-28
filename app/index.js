import * as document from "document";
import clock from "clock";
import { battery as deviceBattery } from "power";
import { HeartRateSensor } from "heart-rate";
import { today as todayActivity } from "user-activity";
import { me as appbit } from "appbit";
import { preferences } from "user-settings";
import * as deviceSettings from "./simple/device-settings";
import { ACTIVE_TAB as TABS, PALETTE_COLORS } from "./simple/settings";
import {
  colorElement,
  colorElements,
  getFormattedTime as getFormattedNumber,
  hideElements,
  showElements,
} from "./utils";

// Settings
let settings = {
  background: PALETTE_COLORS.PANTHER.NEUTRAL_TWO,
  lightAccent: PALETTE_COLORS.TIGER.BANANA,
  darkAccent: PALETTE_COLORS.PANTHER.BANANA,
  tintHours: true,
  tintMinutes: false,
};

// Unfortunately there's probably an undocumented image limit so dark active tabs need to use tiger-text
const ICON_PATHS = {
  CLOCK_PANTHER_TEXT: "../resources/icons/clock-panther-text.png",
  CLOCK_TIGER_NEUTRAL: "../resources/icons/clock-tiger-neutral.png",
  CLOCK_TIGER_TEXT: "../resources/icons/clock-tiger-text.png",
  CALENDAR_PANTHER_TEXT: "../resources/icons/calendar-panther-text.png",
  CALENDAR_TIGER_NEUTRAL: "../resources/icons/calendar-tiger-neutral.png",
  CALENDAR_TIGER_TEXT: "../resources/icons/calendar-tiger-text.png",
  HEALTH_PANTHER_TEXT: "../resources/icons/health-panther-text.png",
  HEALTH_TIGER_NEUTRAL: "../resources/icons/health-tiger-neutral.png",
  HEALTH_TIGER_TEXT: "../resources/icons/health-tiger-text.png",
  BATTERY_PANTHER_TEXT: "../resources/icons/battery-panther-text.png",
  BATTERY_PANTHER_CHERRY: "../resources/icons/battery-panther-cherry.png",
  BATTERY_TIGER_NEUTRAL: "../resources/icons/battery-tiger-neutral.png",
  BATTERY_TIGER_TEXT: "../resources/icons/battery-tiger-text.png",
  BATTERY_TIGER_CHERRY: "../resources/icons/battery-tiger-cherry.png",
  SNEAKER_PANTHER_TEXT: "../resources/icons/sneaker-panther-text.png",
  SNEAKER_TIGER_TEXT: "../resources/icons/sneaker-tiger-text.png",
  HEART_PANTHER_TEXT: "../resources/icons/heart-panther-text.png",
  HEART_TIGER_TEXT: "../resources/icons/heart-tiger-text.png",
};

let palette = PALETTE_COLORS.PANTHER;
let accentColor = PALETTE_COLORS.PANTHER.BANANA;
let activeTab = TABS.CLOCK;

// UI Elements
const background = document.getElementById("background");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const clockTab = document.getElementById("clockTab");
const clockTabIcon = document.getElementById("clockTabIcon");
const calendarTab = document.getElementById("calendarTab");
const calendarTabIcon = document.getElementById("calendarTabIcon");
const calendarIcon = document.getElementById("calendarIcon");
const date = document.getElementById("date");
const healthTab = document.getElementById("healthTab");
const healthTabIcon = document.getElementById("healthTabIcon");
const stepsIcon = document.getElementById("stepsIcon");
const steps = document.getElementById("steps");
const heartIcon = document.getElementById("heartIcon");
const heartRate = document.getElementById("heartRate");
const batteryTab = document.getElementById("batteryTab");
const batteryTabIcon = document.getElementById("batteryTabIcon");
const batteryIcon = document.getElementById("batteryIcon");
const battery = document.getElementById("battery");
const switcherButton = document.getElementById("switcherButton");

// =============================================
// Clock Tab
// =============================================
clock.granularity = "seconds";
clock.ontick = (event) => {
  let today = event.date;
  let h = today.getHours();
  let m = today.getMinutes();

  if (preferences.clockDisplay === "12h") {
    h = h % 12 || 12;
  } else {
    h = h;
  }

  hours.text = getFormattedNumber(h);
  minutes.text = getFormattedNumber(m);
  date.text = `${getFormattedNumber(today.getDate())}-${getFormattedNumber(
    today.getMonth() + 1
  )}-${getFormattedNumber(today.getFullYear())}`;

  // =============================
  // Steps
  // =============================
  if (todayActivity && appbit.permissions.granted("access_heart_rate")) {
    steps.text = todayActivity.adjusted.steps;
  } else {
    steps.text = "-----";
  }
};

// ==============================================
// Health Tab
// ==============================================
if (appbit.permissions.granted("access_activity")) {
  const heartRateMonitor = new HeartRateSensor({ frequency: 1 });

  heartRateMonitor.addEventListener("reading", () => {
    heartRate.text = heartRateMonitor.heartRate;
  });

  heartRateMonitor.start();
} else {
  heartRate.text = "-";
}

// ==============================================
// Battery Tab
// ==============================================
deviceBattery.onchange = (_) => {
  battery.text = `${deviceBattery.chargeLevel}%`;
  applySettings();
};

// Switcher Button
switcherButton.addEventListener("click", () => {
  switch (activeTab) {
    case TABS.CLOCK: {
      // Switches to calendar tab
      activeTab = TABS.CALENDAR;
      break;
    }
    case TABS.CALENDAR: {
      // Switches to health tab
      activeTab = TABS.HEALTH;
      break;
    }
    case TABS.HEALTH: {
      // Switches to battery tab
      activeTab = TABS.BATTERY;
      break;
    }
    default: {
      // Switches to hours tab
      activeTab = TABS.CLOCK;
      break;
    }
  }

  applySettings();
});

// Settings
deviceSettings.initialize((data) => {
  if (!data) return;

  settings.background =
    data.background !== undefined ? data.background : PALETTE_COLORS.PANTHER.NEUTRAL_TWO;

  settings.lightAccent =
    data.lightAccent !== undefined ? data.lightAccent : PALETTE_COLORS.TIGER.BANANA;

  settings.darkAccent =
    data.darkAccent !== undefined ? data.darkAccent : PALETTE_COLORS.PANTHER.BANANA;

  settings.tintHours = data.tintHours !== undefined ? data.tintHours : true;

  settings.tintMinutes = data.tintMinutes !== undefined ? data.tintMinutes : false;

  applySettings();
});

function applySettings() {
  hideElements([
    calendarIcon,
    hours,
    minutes,
    date,
    stepsIcon,
    steps,
    heartIcon,
    heartRate,
    batteryIcon,
    battery,
  ]);

  switch (settings.background) {
    case PALETTE_COLORS.TIGER.NEUTRAL_TWO: {
      palette = PALETTE_COLORS.TIGER;
      accentColor = settings.lightAccent;

      calendarIcon.href = ICON_PATHS.CALENDAR_TIGER_TEXT;
      stepsIcon.href = ICON_PATHS.SNEAKER_TIGER_TEXT;
      heartIcon.href = ICON_PATHS.HEART_TIGER_TEXT;

      batteryIcon.href =
        deviceBattery.chargeLevel <= 20
          ? ICON_PATHS.BATTERY_TIGER_CHERRY
          : ICON_PATHS.BATTERY_TIGER_TEXT;

      batteryTabIcon.href =
        deviceBattery.chargeLevel <= 20
          ? ICON_PATHS.BATTERY_TIGER_CHERRY
          : ICON_PATHS.BATTERY_TIGER_TEXT;

      break;
    }
    case PALETTE_COLORS.PANTHER.NEUTRAL_TWO: {
      palette = PALETTE_COLORS.PANTHER;
      accentColor = settings.darkAccent;

      calendarIcon.href = ICON_PATHS.CALENDAR_PANTHER_TEXT;
      stepsIcon.href = ICON_PATHS.SNEAKER_PANTHER_TEXT;
      heartIcon.href = ICON_PATHS.HEART_PANTHER_TEXT;

      batteryIcon.href =
        deviceBattery.chargeLevel <= 20
          ? ICON_PATHS.BATTERY_PANTHER_CHERRY
          : ICON_PATHS.BATTERY_PANTHER_TEXT;

      batteryTabIcon.href =
        deviceBattery.chargeLevel <= 20
          ? ICON_PATHS.BATTERY_PANTHER_CHERRY
          : ICON_PATHS.BATTERY_PANTHER_TEXT;
      break;
    }
    default: {
      palette = PALETTE_COLORS.OLED;
      accentColor = settings.darkAccent;

      calendarIcon.href = ICON_PATHS.CALENDAR_PANTHER_TEXT;
      stepsIcon.href = ICON_PATHS.SNEAKER_PANTHER_TEXT;
      heartIcon.href = ICON_PATHS.HEART_PANTHER_TEXT;

      batteryIcon.href =
        deviceBattery.chargeLevel <= 20
          ? ICON_PATHS.BATTERY_PANTHER_CHERRY
          : ICON_PATHS.BATTERY_PANTHER_TEXT;

      batteryTabIcon.href =
        deviceBattery.chargeLevel <= 20
          ? ICON_PATHS.BATTERY_PANTHER_CHERRY
          : ICON_PATHS.BATTERY_PANTHER_TEXT;
    }
  }


  colorElement(background, settings.background);
  colorElement(clockTab, activeTab === TABS.CLOCK ? accentColor : palette.NEUTRAL_TWO);
  colorElement(hours, settings.tintHours ? accentColor : palette.TEXT);
  colorElement(minutes, settings.tintMinutes ? accentColor : palette.TEXT);
  colorElement(calendarTab, activeTab === TABS.CALENDAR ? accentColor : palette.NEUTRAL_TWO);
  colorElement(healthTab, activeTab === TABS.HEALTH ? accentColor : palette.NEUTRAL_TWO);
  colorElement(batteryTab, activeTab === TABS.BATTERY ? accentColor : palette.NEUTRAL_TWO);

  colorElements([date, battery, steps, heartRate], palette.TEXT);
  colorElement(battery, deviceBattery.chargeLevel <= 20 ? palette.CHERRY : palette.TEXT);

  clockTabIcon.href =
    palette === PALETTE_COLORS.TIGER ? ICON_PATHS.CLOCK_TIGER_TEXT : ICON_PATHS.CLOCK_PANTHER_TEXT;

  calendarTabIcon.href =
    palette === PALETTE_COLORS.TIGER
      ? ICON_PATHS.CALENDAR_TIGER_TEXT
      : ICON_PATHS.CALENDAR_PANTHER_TEXT;

  healthTabIcon.href =
    palette === PALETTE_COLORS.TIGER
      ? ICON_PATHS.HEALTH_TIGER_TEXT
      : ICON_PATHS.HEALTH_PANTHER_TEXT;

  batteryTabIcon.href =
    palette === PALETTE_COLORS.TIGER
      ? ICON_PATHS.BATTERY_TIGER_TEXT
      : ICON_PATHS.BATTERY_PANTHER_TEXT;

  if (deviceBattery.chargeLevel <= 20) {
    batteryTabIcon.href =
      palette === PALETTE_COLORS.TIGER
        ? ICON_PATHS.BATTERY_TIGER_CHERRY
        : ICON_PATHS.BATTERY_PANTHER_CHERRY;
  }

  switch (activeTab) {
    case TABS.CLOCK: {
      showElements([hours, minutes]);

      clockTabIcon.href =
        palette === PALETTE_COLORS.TIGER
          ? ICON_PATHS.CLOCK_TIGER_NEUTRAL
          : ICON_PATHS.CLOCK_TIGER_TEXT;
      break;
    }
    case TABS.CALENDAR: {
      showElements([calendarIcon, date]);

      calendarTabIcon.href =
        palette === PALETTE_COLORS.TIGER
          ? ICON_PATHS.CALENDAR_TIGER_NEUTRAL
          : ICON_PATHS.CALENDAR_TIGER_TEXT;

      break;
    }
    case TABS.HEALTH: {
      showElements([stepsIcon, steps, heartIcon, heartRate]);

      healthTabIcon.href =
        palette === PALETTE_COLORS.TIGER
          ? ICON_PATHS.HEALTH_TIGER_NEUTRAL
          : ICON_PATHS.HEALTH_TIGER_TEXT;

      break;
    }
    default: {
      showElements([batteryIcon, battery]);

      batteryTabIcon.href =
        palette === PALETTE_COLORS.TIGER
          ? ICON_PATHS.BATTERY_TIGER_NEUTRAL
          : ICON_PATHS.BATTERY_TIGER_TEXT;
    }
  }
}
