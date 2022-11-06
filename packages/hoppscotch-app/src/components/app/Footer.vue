<template>
  <div>
    <div class="flex justify-between bg-primary">
      <div class="flex">
        <ButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          :title="EXPAND_NAVIGATION ? t('hide.sidebar') : t('show.sidebar')"
          :icon="IconSidebar"
          class="transform"
          :class="{ '-rotate-180': !EXPAND_NAVIGATION }"
          @click="EXPAND_NAVIGATION = !EXPAND_NAVIGATION"
        />
        <ButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          :title="`${ZEN_MODE ? t('action.turn_off') : t('action.turn_on')} ${t(
            'layout.zen_mode'
          )}`"
          :icon="ZEN_MODE ? IconMinimize : IconMaximize"
          :class="{
            '!text-accent !focus-visible:text-accentDark !hover:text-accentDark':
              ZEN_MODE,
          }"
          @click="ZEN_MODE = !ZEN_MODE"
        />
      </div>
      <div class="flex">
        <tippy
          interactive
          trigger="click"
          theme="popover"
          :on-shown="() => tippyActions!.focus()"
        >
          <template #content="{ hide }">
            <div
              ref="tippyActions"
              class="flex flex-col focus:outline-none"
              tabindex="0"
              @keyup.d="documentation.$el.click()"
              @keyup.escape="hide()"
            >
              <SmartItem
                :icon="IconUserPlus"
                :label="`${t('app.invite')}`"
                @click="
                  () => {
                    showShare = true
                    hide()
                  }
                "
              />
              <SmartItem
                :icon="IconLock"
                :label="`${t('app.terms_and_privacy')}`"
                to="https://docs.hoppscotch.io/privacy"
                blank
                @click="hide()"
              />
              <div
                class="flex px-4 py-2 opacity-50"
                @dblclick="
                  () => {
                    showDeveloperOptionModal()
                    hide()
                  }
                "
              >
                {{ `${t("app.name")} v${version}` }}
              </div>
            </div>
          </template>
        </tippy>
        <ButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          :title="COLUMN_LAYOUT ? t('layout.row') : t('layout.column')"
          :icon="IconColumns"
          class="transform"
          :class="{ 'rotate-90': !COLUMN_LAYOUT }"
          @click="COLUMN_LAYOUT = !COLUMN_LAYOUT"
        />
        <span
          class="transition transform"
          :class="{
            'rotate-180': SIDEBAR_ON_LEFT,
          }"
        >
          <ButtonSecondary
            v-tippy="{ theme: 'tooltip' }"
            :title="SIDEBAR ? t('hide.sidebar') : t('show.sidebar')"
            :icon="IconSidebarOpen"
            class="transform"
            :class="{ 'rotate-180': !SIDEBAR }"
            @click="SIDEBAR = !SIDEBAR"
          />
        </span>
      </div>
    </div>
    <AppShortcuts :show="showShortcuts" @close="showShortcuts = false" />
    <AppShare :show="showShare" @hide-modal="showShare = false" />
    <AppDeveloperOptions
      :show="showDeveloperOptions"
      @hide-modal="showDeveloperOptions = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import IconSidebar from "~icons/lucide/sidebar"
import IconMinimize from "~icons/lucide/minimize"
import IconMaximize from "~icons/lucide/maximize"
import IconColumns from "~icons/lucide/columns"
import IconSidebarOpen from "~icons/lucide/sidebar-open"
import IconUserPlus from "~icons/lucide/user-plus"
import IconLock from "~icons/lucide/lock"
import { useSetting } from "@composables/settings"
import { useI18n } from "@composables/i18n"
import { useReadonlyStream } from "@composables/stream"
import { currentUser$ } from "~/helpers/fb/auth"
import { TippyComponent } from "vue-tippy"
import SmartItem from "@components/smart/Item.vue"

const t = useI18n()
const showDeveloperOptions = ref(false)
const EXPAND_NAVIGATION = useSetting("EXPAND_NAVIGATION")
const SIDEBAR = useSetting("SIDEBAR")
const ZEN_MODE = useSetting("ZEN_MODE")
const COLUMN_LAYOUT = useSetting("COLUMN_LAYOUT")
const SIDEBAR_ON_LEFT = useSetting("SIDEBAR_ON_LEFT")

const currentUser = useReadonlyStream(currentUser$, null)

watch(
  () => ZEN_MODE.value,
  () => {
    EXPAND_NAVIGATION.value = !ZEN_MODE.value
  }
)

const showDeveloperOptionModal = () => {
  if (currentUser.value) {
    showDeveloperOptions.value = true
  }
}

// Template refs
const tippyActions = ref<TippyComponent | null>(null)
const documentation = ref<typeof SmartItem | null>(null)
</script>
