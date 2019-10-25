function sideNavToggle(nav,className){
  console.log(nav);
  console.log("Menu is toggled");
  console.log(getComputedStyle(nav).width);
  let widthIsZero = getComputedStyle(nav).width === "0px";
  console.log(widthIsZero);
  if(widthIsZero){
    nav.classList.remove(className);

  }else{
    nav.classList.add(className);
  }
}
