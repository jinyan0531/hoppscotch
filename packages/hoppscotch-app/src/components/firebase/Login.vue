<template>
  <SmartModal
    v-if="show"
    dialog
    :title="`${t('auth.login_to_hoppscotch')}`"
    styles="sm:max-w-md"
    @close="hideModal"
  >
    <template #body>
      <div v-if="mode === 'sign-in'" class="flex flex-col space-y-2">
        <SmartItem
          :icon="IconEmail"
          :label="`${t('auth.continue_with_email')}`"
          @click="mode = 'email'"
        />
        <SmartItem
          :icon="IconLogin"
          :label="`${t('auth.continue_with_user')}`"
          @click="mode = 'user'"
        />
      </div>
      <form
        v-if="mode === 'email'"
        class="flex flex-col space-y-2"
        @submit.prevent="signInWithEmail"
      >
        <div class="flex flex-col">
          <input
            id="email"
            v-model="form.email"
            v-focus
            class="input floating-input"
            placeholder=" "
            type="email"
            name="email"
            autocomplete="off"
            required
            spellcheck="false"
            autofocus
          />
          <label for="email">
            {{ t("auth.email") }}
          </label>
        </div>
        <ButtonPrimary
          :loading="signingInWithEmail"
          type="submit"
          :label="`${t('auth.send_magic_link')}`"
        />
      </form>
      <form
        v-if="mode === 'user'"
        class="flex flex-col space-y-2"
        @submit.prevent="signInWithUser"
      >
        <div class="flex flex-col">
          <input
            id="user_id"
            v-model="form.user_id"
            v-focus
            class="input floating-input"
            placeholder=" "
            type="text"
            name="user_id"
            autocomplete="off"
            required
            spellcheck="false"
            autofocus
          />
          <label for="user_id">
            {{ t("auth.user_id") }}
          </label>
        </div>
        <div class="flex flex-col">
          <input
            id="password"
            v-model="form.password"
            v-focus
            class="input floating-input"
            placeholder=" "
            type="password"
            name="password"
            autocomplete="off"
            required
            spellcheck="false"
            autofocus
          />
          <label for="password">
            {{ t("auth.password") }}
          </label>
        </div>
        <ButtonPrimary
          :loading="signingInWithUser"
          type="submit"
          :label="`${t('auth.send_login')}`"
        />
      </form>
      <div v-if="mode === 'email-sent'" class="flex flex-col px-4">
        <div class="flex flex-col items-center justify-center max-w-md">
          <icon-lucide-inbox class="w-6 h-6 text-accent" />
          <h3 class="my-2 text-lg text-center">
            {{ t("auth.we_sent_magic_link") }}
          </h3>
          <p class="text-center">
            {{
              t("auth.we_sent_magic_link_description", { email: form.email })
            }}
          </p>
        </div>
      </div>
      <div v-if="mode === 'user-sent'" class="flex flex-col px-4">
        <div class="flex flex-col items-center justify-center max-w-md">
          <icon-lucide-inbox class="w-6 h-6 text-accent" />
          <h3 class="my-2 text-lg text-center">
            {{ t("auth.we_sent_magic_link") }}
          </h3>
          <p class="text-center">
            {{
              t("auth.we_sent_user_link_description", { user_id: form.user_id })
            }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="mode === 'sign-in'" class="text-secondaryLight text-tiny">
        By signing in, you are agreeing to our
        <SmartAnchor
          class="link"
          to="https://docs.hoppscotch.io/terms"
          blank
          label="Terms of Service"
        />
        and
        <SmartAnchor
          class="link"
          to="https://docs.hoppscotch.io/privacy"
          blank
          label="Privacy Policy"
        />
      </div>
      <div v-if="mode === 'email'">
        <ButtonSecondary
          :label="t('auth.all_sign_in_options')"
          :icon="IconArrowLeft"
          class="!p-0"
          @click="mode = 'sign-in'"
        />
      </div>
      <div v-if="mode === 'user'">
        <ButtonSecondary
          :label="t('auth.all_sign_in_options')"
          :icon="IconArrowLeft"
          class="!p-0"
          @click="mode = 'sign-in'"
        />
      </div>
      <div
        v-if="mode === 'email-sent'"
        class="flex justify-between flex-1 text-secondaryLight"
      >
        <SmartAnchor
          class="link"
          :label="t('auth.re_enter_email')"
          :icon="IconArrowLeft"
          @click="mode = 'email'"
        />
      </div>
      <div
        v-if="mode === 'user-sent'"
        class="flex justify-between flex-1 text-secondaryLight"
      >
        <SmartAnchor
          class="link"
          :label="t('auth.re_enter_user_id')"
          :icon="IconArrowLeft"
          @click="mode = 'user'"
        />
      </div>
    </template>
  </SmartModal>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { currentUser$, signInWithEmail } from "~/helpers/fb/auth"
import IconEmail from "~icons/auth/email"
import IconLogin from "~icons/auth/denglu"
import IconArrowLeft from "~icons/lucide/arrow-left"
import { setLocalConfig } from "~/newstore/localpersistence"
import { request } from "~/helpers/utils/RequestUtils"
import { AxiosRequestConfig } from "axios"
import { useStreamSubscriber } from "@composables/stream"
import { useToast } from "@composables/toast"
import { useI18n } from "@composables/i18n"

export default defineComponent({
  props: {
    show: Boolean,
  },
  emits: ["hide-modal"],
  setup() {
    const { subscribeToStream } = useStreamSubscriber()

    return {
      subscribeToStream,
      t: useI18n(),
      toast: useToast(),
      IconEmail,
      IconArrowLeft,
      IconLogin,
    }
  },
  data() {
    return {
      form: {
        email: "",
        user_id: "",
        password: "",
      },
      signingInWithGoogle: false,
      signingInWithGitHub: false,
      signingInWithMicrosoft: false,
      signingInWithEmail: false,
      signingInWithUser: false,
      mode: "sign-in",
    }
  },
  mounted() {
    this.subscribeToStream(currentUser$, (user) => {
      if (user) this.hideModal()
    })
  },
  methods: {
    showLoginSuccess() {
      this.toast.success(`${this.t("auth.login_success")}`)
    },
    async signInWithEmail() {
      this.signingInWithEmail = true

      const actionCodeSettings = {
        url: `${import.meta.env.VITE_BASE_URL}/enter`,
        handleCodeInApp: true,
      }
      await signInWithEmail(this.form.email, actionCodeSettings)
        .then(() => {
          this.mode = "email-sent"
          setLocalConfig("emailForSignIn", this.form.email)
        })
        .catch((e) => {
          console.error(e)
          this.toast.error(e.message)
          this.signingInWithEmail = false
        })
        .finally(() => {
          this.signingInWithEmail = false
        })
    },
    async signInWithUser() {
      this.signingInWithUser = true
      const loginConfig = {
        url: "/esb2-api/authorize/authLogin",
        params: { subject_id: "T1092", secret: "QD6i6FG5qwSplr6rSkgKMA==1" },
      } as AxiosRequestConfig
      request(loginConfig, false)
        .then((res) => {
          const msg = JSON.parse(res.serviceRspData)
          if (msg.errorCode !== 0) {
            alert(msg.msg)
            this.signingInWithUser = false
          } else {
            this.mode = "user-sent"
            console.info(JSON.parse(res.serviceRspData))
          }
        })
        .catch((e) => {
          console.info(e)
          this.signingInWithUser = false
        })
        .finally(() => {
          console.info("完成")
          this.signingInWithUser = false
        })
    },
    hideModal() {
      this.mode = "sign-in"
      this.toast.clear()
      this.$emit("hide-modal")
    },
  },
})
</script>
