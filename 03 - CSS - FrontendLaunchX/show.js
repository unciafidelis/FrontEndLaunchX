let showAAB = () => {

  let element = document.getElementById("AABContent");
  let hidden = element.getAttribute("hidden");
  if(hidden){element.removeAttribute("hidden");} 
      else{
        element.setAttribute("hidden", "hidden");
      }
}

let showAS = () => {

  let element = document.getElementById("ASContent");
  
  let hidden = element.getAttribute("hidden");
  
  if(hidden){element.removeAttribute("hidden");}
      else{
        element.setAttribute("hidden", "hidden");
      }
}

let showEHF = () => {

  let element = document.getElementById("EHFContent");
 
  let hidden = element.getAttribute("hidden");

  if(hidden){element.removeAttribute("hidden");}
      else{
        element.setAttribute("hidden", "hidden");
      }
}

let showGES = () => {

  let element = document.getElementById("GESContent");

  let hidden = element.getAttribute("hidden");

  if(hidden){element.removeAttribute("hidden");}
      else{
        element.setAttribute("hidden", "hidden");
      }
}

let showEPA = () => {

  let element = document.getElementById("EPAContent");
  let hidden = element.getAttribute("hidden");

  if(hidden){element.removeAttribute("hidden");}
      else{
        element.setAttribute("hidden", "hidden");
      }
}
     