.PHONY: info dev start build lint expo-android expo-ios web clean install android

# Автовизначення package manager
PACKAGE_MANAGER := $(shell \
	if [ -f yarn.lock ]; then echo yarn; \
	elif [ -f pnpm-lock.yaml ]; then echo pnpm; \
	else echo npm; fi \
)

# Визначення типу проєкту: expo чи next
IS_EXPO := $(shell grep -q '"expo"' package.json && echo true || echo false)
IS_NEXT := $(shell grep -q '"next"' package.json && echo true || echo false)

# Показати обрану конфігурацію
info:
	@echo "Using package manager: $(PACKAGE_MANAGER)"
	@echo "Expo project: $(IS_EXPO)"
	@echo "Next.js project: $(IS_NEXT)"

# Запуск dev-серверу
dev:
ifeq ($(IS_EXPO),true)
	@echo "Starting Expo dev server..."
	$(PACKAGE_MANAGER) run start
else ifeq ($(IS_NEXT),true)
	@echo "Starting Next.js dev server..."
	$(PACKAGE_MANAGER) run dev
else
	@echo "Unknown project type (neither Expo nor Next.js)"
endif

# Продакшн старт (Next.js)
start:
ifeq ($(IS_NEXT),true)
	@echo "Starting Next.js in production mode..."
	$(PACKAGE_MANAGER) run build && $(PACKAGE_MANAGER) run start
else
	@echo "Start command only available for Next.js projects"
endif

# Збірка
build:
ifeq ($(IS_EXPO),true)
	@echo "Expo build not defined here (handled by EAS CLI or Expo CLI)"
else ifeq ($(IS_NEXT),true)
	@echo "Building Next.js app..."
	$(PACKAGE_MANAGER) run build
else
	@echo "Unknown project type"
endif

# Лінтинг
lint:
	$(PACKAGE_MANAGER) run lint

# Expo: запустити на Android
expo-android:
ifeq ($(IS_EXPO),true)
	$(PACKAGE_MANAGER) run android
else
	@echo "Android target only available for Expo projects"
endif

# Expo: запустити на iOS
expo-ios:
ifeq ($(IS_EXPO),true)
	$(PACKAGE_MANAGER) run ios
else
	@echo "iOS target only available for Expo projects"
endif

# Expo: запуск у веб-браузері
web:
ifeq ($(IS_EXPO),true)
	$(PACKAGE_MANAGER) run web
else
	@echo "Web target only available for Expo projects"
endif

# Очистка
clean:
	@echo "Cleaning build artifacts..."
	rm -rf .expo .expo-shared .next dist build ios/build android/app/build

# Встановлення залежностей
install:
	$(PACKAGE_MANAGER) install

# React Native: запуск на Android із автоматичним вибором пристрою
android:
ifeq ($(IS_EXPO),true)
	@echo "Use 'make expo-android' for Expo projects"
else
	@echo "Detecting connected Android device..."
	DEVICE_ID=$$(adb devices | grep 'device$$' | awk 'NR==1{print $$1}') && \
	if [ -z "$$DEVICE_ID" ]; then \
		echo "❌ No Android device or emulator detected."; \
	else \
		echo "✅ Using device ID: $$DEVICE_ID"; \
		npx react-native run-android --deviceId $$DEVICE_ID; \
	fi
endif
