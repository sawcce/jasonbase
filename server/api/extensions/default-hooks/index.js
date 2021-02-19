module.exports = ({color})=>{
  console.log(`${color.BgRed} WARNING ${color.BgBlack} seems like you haven't added any hooks yet!`)
  console.log(`it means that every requests you do will be rejected`)
  console.log(`If you are putting your hooks in another place / extension, you can remove this one`)
}