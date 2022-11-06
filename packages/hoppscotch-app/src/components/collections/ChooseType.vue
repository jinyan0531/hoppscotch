<template>
  <div>
    <SmartTabs
      :id="'collections_tab'"
      v-model="selectedCollectionTab"
      render-inactive-tabs
    >
      <SmartTab
        :id="'my-collections'"
        :label="`${t('collection.my_collections')}`"
      />
    </SmartTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { GetMyTeamsQuery, Team } from "~/helpers/backend/graphql"
import { currentUserInfo$ } from "~/helpers/teams/BackendUserInfo"
import TeamListAdapter from "~/helpers/teams/TeamListAdapter"
import { useReadonlyStream } from "@composables/stream"
import { onLoggedIn } from "@composables/auth"
import { useI18n } from "@composables/i18n"

type TeamData = GetMyTeamsQuery["myTeams"][number]

type CollectionTabs = "my-collections" | "team-collections"

const t = useI18n()

// Template refs
const selectedCollectionTab = ref<CollectionTabs>("my-collections")

defineProps<{
  collectionsType: {
    type: "my-collections" | "team-collections"
    selectedTeam: Team | undefined
  }
}>()

const emit = defineEmits<{
  (e: "update-collection-type", tabID: string): void
  (e: "update-selected-team", team: TeamData | undefined): void
}>()

const currentUser = useReadonlyStream(currentUserInfo$, null)

const adapter = new TeamListAdapter(true)

onLoggedIn(() => {
  adapter.initialize()
})

watch(
  () => currentUser.value,
  (user) => {
    if (!user) {
      selectedCollectionTab.value = "my-collections"
    }
  }
)

const updateCollectionsType = (tabID: string) => {
  emit("update-collection-type", tabID)
}

watch(selectedCollectionTab, (newValue: string) => {
  updateCollectionsType(newValue)
})
</script>
