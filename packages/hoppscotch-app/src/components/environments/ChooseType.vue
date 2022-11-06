<template>
  <div>
    <SmartTabs
      :id="'environments_tab'"
      v-model="selectedEnvironmentTab"
      render-inactive-tabs
    >
      <SmartTab
        :id="'my-environments'"
        :label="`${t('environment.my_environments')}`"
      />
    </SmartTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { GetMyTeamsQuery } from "~/helpers/backend/graphql"
import { onLoggedIn } from "@composables/auth"
import { currentUserInfo$ } from "~/helpers/teams/BackendUserInfo"
import TeamListAdapter from "~/helpers/teams/TeamListAdapter"
import { useReadonlyStream } from "@composables/stream"
import { useLocalState } from "~/newstore/localstate"
import { useI18n } from "@composables/i18n"

const t = useI18n()

type TeamData = GetMyTeamsQuery["myTeams"][number]

type SelectedTeam = TeamData | undefined

type EnvironmentTabs = "my-environments" | "team-environments"

const selectedEnvironmentTab = ref<EnvironmentTabs>("my-environments")

defineProps<{
  environmentType: {
    type: "my-environments" | "team-environments"
    selectedTeam: SelectedTeam
  }
}>()

const emit = defineEmits<{
  (e: "update-environment-type", tabID: EnvironmentTabs): void
  (e: "update-selected-team", team: SelectedTeam): void
}>()

const currentUser = useReadonlyStream(currentUserInfo$, null)

const adapter = new TeamListAdapter(true)
const myTeams = useReadonlyStream(adapter.teamList$, null)
const REMEMBERED_TEAM_ID = useLocalState("REMEMBERED_TEAM_ID")
let teamListFetched = false

watch(myTeams, (teams) => {
  if (teams && !teamListFetched) {
    teamListFetched = true
    if (REMEMBERED_TEAM_ID.value && currentUser.value) {
      const team = teams.find((t) => t.id === REMEMBERED_TEAM_ID.value)
      if (team) updateSelectedTeam(team)
    }
  }
})

watch(
  () => currentUser.value,
  (user) => {
    if (!user) {
      selectedEnvironmentTab.value = "my-environments"
    }
  }
)

onLoggedIn(() => {
  adapter.initialize()
})

const updateEnvironmentType = (tabID: EnvironmentTabs) => {
  emit("update-environment-type", tabID)
}

watch(selectedEnvironmentTab, (newValue: EnvironmentTabs) => {
  updateEnvironmentType(newValue)
})
</script>
