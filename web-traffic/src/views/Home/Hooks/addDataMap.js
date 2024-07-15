import { ref } from "vue"

export const addDataMap = () => {
  let gg_layer = ref(null)
  gg_layer.value = new Zondy.Map.Doc("", "guanggu", {
    ip: "localhost",
    port: 6163,
    crossOrigin: "Anonymous",
  })
  return gg_layer
}
