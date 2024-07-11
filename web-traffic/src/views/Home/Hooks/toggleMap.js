export const toggleMap = (map, flag) => {
  const layers = map.getLayers().getArray()
  // console.log(layers)
  layers[0].setVisible(flag)
  layers[1].setVisible(!flag)
}
