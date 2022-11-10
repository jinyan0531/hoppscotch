<template>
  <div>
    <div class="container space-y-8 divide-y divide-dividerLight">
      <div class="md:grid md:gap-4 md:grid-cols-3">
        <div class="p-8 md:col-span-1">
          <h3 class="heading">
            {{ t("settings.theme") }}
          </h3>
          <p class="my-1 text-secondaryLight">
            {{ t("settings.theme_description") }}
          </p>
        </div>
        <div class="p-8 space-y-8 md:col-span-2">
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.background") }}
            </h4>
            <div class="my-1 text-secondaryLight">
              {{ t(getColorModeName(colorMode.preference)) }}
              <span v-if="colorMode.preference === 'system'">
                ({{ t(getColorModeName(colorMode.value)) }})
              </span>
            </div>
            <div class="mt-4">
              <SmartColorModePicker />
            </div>
          </section>
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.accent_color") }}
            </h4>
            <div class="my-1 text-secondaryLight">
              {{ ACCENT_COLOR.charAt(0).toUpperCase() + ACCENT_COLOR.slice(1) }}
            </div>
            <div class="mt-4">
              <SmartAccentModePicker />
            </div>
          </section>
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.font_size") }}
            </h4>
            <div class="mt-4">
              <SmartFontSizePicker />
            </div>
          </section>
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.language") }}
            </h4>
            <div class="mt-4">
              <SmartChangeLanguage />
            </div>
          </section>
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.experiments") }}
            </h4>
            <div class="my-1 text-secondaryLight">
              {{ t("settings.experiments_notice") }}
            </div>
            <div class="py-4 space-y-4">
              <div class="flex items-center">
                <SmartToggle
                  :on="EXPAND_NAVIGATION"
                  @change="toggleSetting('EXPAND_NAVIGATION')"
                >
                  {{ t("settings.expand_navigation") }}
                </SmartToggle>
              </div>
              <div class="flex items-center">
                <SmartToggle
                  :on="SIDEBAR_ON_LEFT"
                  @change="toggleSetting('SIDEBAR_ON_LEFT')"
                >
                  {{ t("settings.sidebar_on_left") }}
                </SmartToggle>
              </div>
              <div class="flex items-center">
                <SmartToggle :on="ZEN_MODE" @change="toggleSetting('ZEN_MODE')">
                  {{ t("layout.zen_mode") }}
                </SmartToggle>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="md:grid md:gap-4 md:grid-cols-3">
        <div class="p-8 md:col-span-1">
          <h3 class="heading">
            {{ t("settings.interceptor") }}
          </h3>
          <p class="my-1 text-secondaryLight">
            {{ t("settings.interceptor_description") }}
          </p>
        </div>
        <div class="p-8 space-y-8 md:col-span-2">
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.proxy") }}
            </h4>
            <div class="py-4 space-y-4">
              <div class="flex items-center">
                <SmartToggle
                  :on="PROXY_ENABLED"
                  @change="toggleInterceptor('proxy')"
                >
                  {{ t("settings.proxy_use_toggle") }}
                </SmartToggle>
              </div>
            </div>
            <div class="flex items-center py-4 space-x-2">
              <div class="relative flex flex-col flex-1">
                <input
                  id="url"
                  v-model="PROXY_URL"
                  class="input floating-input"
                  placeholder=" "
                  type="url"
                  autocomplete="off"
                  :disabled="!PROXY_ENABLED"
                />
                <label for="url">
                  {{ t("settings.proxy_url") }}
                </label>
              </div>
              <ButtonSecondary
                v-tippy="{ theme: 'tooltip' }"
                :title="t('settings.reset_default')"
                :icon="clearIcon"
                outline
                class="rounded"
                @click="resetProxy"
              />
            </div>
          </section>
        </div>
      </div>
      <div class="md:grid md:gap-4 md:grid-cols-3">
        <div class="p-8 md:col-span-1">
          <h3 class="heading">
            {{ t("settings.center") }}
          </h3>
          <p class="my-1 text-secondaryLight">
            {{ t("settings.center_description") }}
          </p>
        </div>
        <div class="p-8 space-y-8 md:col-span-2">
          <section>
            <h4 class="font-semibold text-secondaryDark">
              {{ t("settings.data_center") }}
            </h4>
            <div class="py-4 space-y-4">
              <div class="flex items-center">
                <SmartToggle :on="DEFAULT_CENTER" @change="centerInterceptor()">
                  {{ t("settings.center_default") }}
                </SmartToggle>
              </div>
            </div>
            <div class="flex items-center py-4 space-x-2">
              <div class="relative flex flex-col flex-1">
                <input
                  id="url"
                  v-model="CENTER_URL"
                  class="input floating-input"
                  placeholder=" "
                  type="url"
                  autocomplete="off"
                  :disabled="!DEFAULT_CENTER"
                />
                <label for="url">
                  {{ t("settings.center_url") }}
                </label>
              </div>
              <ButtonSecondary
                v-tippy="{ theme: 'tooltip' }"
                :title="t('settings.reset_default')"
                :icon="clearIcon"
                outline
                class="rounded"
                @click="resetCenter"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
    <SmartConfirmModal
      :show="confirmRemove"
      :title="`${t('confirm.remove_telemetry')} ${t(
        'settings.telemetry_helps_us'
      )}`"
      @hide-modal="confirmRemove = false"
      @resolve="
        () => {
          toggleSetting('TELEMETRY_ENABLED')
          confirmRemove = false
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import IconRotateCCW from "~icons/lucide/rotate-ccw"
import IconCheck from "~icons/lucide/check"
import { ref, computed, watch } from "vue"
import { refAutoReset } from "@vueuse/core"
import { applySetting, toggleSetting } from "~/newstore/settings"
import { useSetting } from "@composables/settings"
import { useToast } from "@composables/toast"
import { useI18n } from "@composables/i18n"
import { useColorMode } from "@composables/theming"
import { usePageHead } from "@composables/head"

const t = useI18n()
const toast = useToast()
const colorMode = useColorMode()

usePageHead({
  title: computed(() => t("navigation.settings")),
})

const ACCENT_COLOR = useSetting("THEME_COLOR")
const PROXY_ENABLED = useSetting("PROXY_ENABLED")
const DEFAULT_CENTER = useSetting("DEFAULT_CENTER")
const PROXY_URL = useSetting("PROXY_URL")
const CENTER_URL = useSetting("CENTER_URL")
const EXTENSIONS_ENABLED = useSetting("EXTENSIONS_ENABLED")
const EXPAND_NAVIGATION = useSetting("EXPAND_NAVIGATION")
const SIDEBAR_ON_LEFT = useSetting("SIDEBAR_ON_LEFT")
const ZEN_MODE = useSetting("ZEN_MODE")

const clearIcon = refAutoReset<typeof IconRotateCCW | typeof IconCheck>(
  IconRotateCCW,
  1000
)

const confirmRemove = ref(false)

const proxySettings = computed(() => ({
  url: PROXY_URL.value,
}))

const centerSettings = computed(() => ({
  url: CENTER_URL.value,
}))

watch(ZEN_MODE, (mode) => {
  applySetting("EXPAND_NAVIGATION", !mode)
})

watch(centerSettings, ({ url }) => {
  applySetting("CENTER_URL", url)
})

watch(
  proxySettings,
  ({ url }) => {
    applySetting("PROXY_URL", url)
  },
  { deep: true }
)

// Extensions and proxy should not be enabled at the same time
const toggleInterceptor = (interceptor: "extension" | "proxy") => {
  if (interceptor === "extension") {
    EXTENSIONS_ENABLED.value = !EXTENSIONS_ENABLED.value

    if (EXTENSIONS_ENABLED.value) {
      PROXY_ENABLED.value = false
    }
  } else {
    PROXY_ENABLED.value = !PROXY_ENABLED.value

    if (PROXY_ENABLED.value) {
      EXTENSIONS_ENABLED.value = false
    }
  }
}

const centerInterceptor = () => {
  DEFAULT_CENTER.value = !DEFAULT_CENTER.value
}

const resetProxy = () => {
  applySetting("PROXY_URL", `https://proxy.tuolong56.com/`)
  clearIcon.value = IconCheck
  toast.success(`${t("state.cleared")}`)
}

const resetCenter = () => {
  applySetting("CENTER_URL", `https://kp.tuolong56.com/`)
  clearIcon.value = IconCheck
  toast.success(`${t("state.cleared")}`)
}

const getColorModeName = (colorMode: string) => {
  switch (colorMode) {
    case "system":
      return "settings.system_mode"
    case "light":
      return "settings.light_mode"
    case "dark":
      return "settings.dark_mode"
    case "black":
      return "settings.black_mode"
    default:
      return "settings.system_mode"
  }
}
</script>
