import { ref } from "vue"
import { defineStore } from "pinia"

export const useToken = defineStore(
  "Token",
  () => {
    let token = ref("")
    let type = ref("")
    let username = ref("")
    let id = ref(null)
    let avatar = ref("")
    const setToken = (val) => {
      token.value = val
    }
    const setType = (val) => {
      type.value = val
    }
    const setUsername = (val) => {
      username.value = val
    }
    const setId = (val) => {
      id.value = val
    }
    const setAvatar = (val) => {
      avatar.value = val
    }

    return {
      token,
      type,
      username,
      id,
      avatar,
      setToken,
      setType,
      setUsername,
      setId,
      setAvatar,
    }
  },
  {
    persist: {
      key: "tokenStore",
      storage: localStorage,
      path: ["name", "type", "token", "id","avatar"],
    },
  }
)
