const lnglat = [114.37253500670849, 30.48954963684082]
export const FlyTo = ({ view }) => {
  view.animate({
    center: lnglat,
    zoom: 13.5,
    duration: 1500,
  })
}
