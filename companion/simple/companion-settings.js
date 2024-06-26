import * as messaging from "messaging";
import { settingsStorage } from "settings";

export function initialize() {

  messaging.peerSocket.addEventListener("open", (_) => {

    if (settingsStorage.getItem("tintHours") === null) {
      setDefaultSetting("tintHours", true)
    }

    if (settingsStorage.getItem("tintMinutes") === null) {
      setDefaultSetting("tintMinutes", false)
    }

    if (settingsStorage.getItem("showBatteryWarning") === null) {
      setDefaultSetting("showBatteryWarning", true)
    }
  });

  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

function setDefaultSetting(key, value) {
  settingsStorage.setItem(key, JSON.stringify(value));
  sendValue(key, value)
}