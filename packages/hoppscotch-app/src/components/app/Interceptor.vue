<template>
  <div class="flex flex-col space-y-2">
    <div class="flex flex-col px-4 pt-2">
      <h2 class="inline-flex pb-1 font-semibold text-secondaryDark">
        {{ t("settings.interceptor") }}
      </h2>
      <p class="inline-flex text-tiny">
        {{ t("settings.interceptor_description") }}
      </p>
    </div>
    <SmartRadioGroup v-model="interceptorSelection" :radios="interceptors" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { applySetting } from "~/newstore/settings"
import { useSetting } from "@composables/settings"
import { useI18n } from "@composables/i18n"
const t = useI18n()
const PROXY_ENABLED = useSetting("PROXY_ENABLED")
const interceptors = computed(() => [
  { value: "BROWSER_ENABLED" as const, label: t("state.none") },
  { value: "PROXY_ENABLED" as const, label: t("settings.proxy") },
])

type InterceptorMode = typeof interceptors["value"][number]["value"]

const interceptorSelection = computed<InterceptorMode>({
  get() {
    if (PROXY_ENABLED.value) return "PROXY_ENABLED"
    return "BROWSER_ENABLED"
  },
  set(val) {
    if (val === "PROXY_ENABLED") {
      applySetting("PROXY_ENABLED", true)
    }
    if (val === "BROWSER_ENABLED") {
      applySetting("PROXY_ENABLED", false)
    }
  },
})
</script>
