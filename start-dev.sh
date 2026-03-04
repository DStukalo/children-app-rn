#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

SDK_DIR=""
[ -n "$ANDROID_HOME" ] && SDK_DIR="$ANDROID_HOME"
[ -z "$SDK_DIR" ] && [ -n "$ANDROID_SDK_ROOT" ] && SDK_DIR="$ANDROID_SDK_ROOT"
[ -z "$SDK_DIR" ] && [ -d "$HOME/Android/Sdk" ] && SDK_DIR="$HOME/Android/Sdk"

if [ -z "$SDK_DIR" ]; then
  echo "ANDROID_HOME / ANDROID_SDK_ROOT не заданы и $HOME/Android/Sdk не найден"
  exit 1
fi

if [ ! -f android/local.properties ] || ! grep -q "sdk.dir" android/local.properties; then
  echo "sdk.dir=$SDK_DIR" > android/local.properties
fi

EMULATOR="$SDK_DIR/emulator/emulator"
ADB="$SDK_DIR/platform-tools/adb"

if [ ! -x "$EMULATOR" ] || [ ! -x "$ADB" ]; then
  echo "Emulator или adb не найден в $SDK_DIR"
  exit 1
fi

booted() {
  "$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' | grep -q 1
}

if ! "$ADB" devices | grep -qE 'emulator-|device$'; then
  AVD=$("$EMULATOR" -list-avds 2>/dev/null | head -n1)
  if [ -z "$AVD" ]; then
    echo "Нет доступных AVD. Создай эмулятор в Android Studio."
    exit 1
  fi
  echo "Запуск эмулятора: $AVD"
  "$EMULATOR" -avd "$AVD" -no-snapshot-load &
  EMPID=$!
  echo "Ожидание загрузки эмулятора..."
  while ! booted; do sleep 2; done
  echo "Эмулятор загружен."
fi

if ! pgrep -f "react-native start" >/dev/null 2>&1; then
  echo "Запуск Metro..."
  npm start &
  METROPID=$!
  sleep 5
fi

echo "Запуск приложения..."
npx react-native run-android
