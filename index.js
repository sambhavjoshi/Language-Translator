let dropdowns = document.querySelectorAll(".dropdown-container");
let inputDrop = document.querySelector("#input-select");
let outputDrop = document.querySelector("#output-select");

function assignDrop(dropdown,options){
    dropdown.querySelector("ul").innerHTML = "";
    options.forEach((option) => {
        let li = document.createElement("li");
        li.innerHTML = option.name + "(" + option.native + ")";
        li.dataset.value = option.code;
        li.classList.add("option");
        dropdown.querySelector("ul").appendChild(li);
    });
}

assignDrop(inputDrop,languages);
assignDrop(outputDrop,languages);

dropdowns.forEach((dropdown) => {
 dropdown.addEventListener("click", (e)=>{
   dropdown.classList.toggle("active");
 });

 dropdown.querySelectorAll(".option").forEach((e)=>{
    e.addEventListener("click",(a)=>{
     dropdown.querySelectorAll(".option").forEach((item)=>{
            item.classList.remove("active");
     });
     e.classList.add("active");
     let selected = dropdown.querySelector(".selected");
     selected.innerHTML = e.innerHTML;
     selected.dataset.value = e.dataset.value;
     translateText();
    });
 });

});

document.addEventListener("click",(e)=>{
  dropdowns.forEach((dropdown) =>{
  if(!dropdown.contains(e.target)) dropdown.classList.remove("active");
  });
});



// translate ke liye function
const inputtextElem = document.querySelector("#input-text");
const outputtextElem = document.querySelector("#output-text");
const inputLanguage = inputDrop.querySelector(".selected");
const outputLanguage = outputDrop.querySelector(".selected");
const swapBtn = document.querySelector(".swap-position");

function translateText(){
    const inputText = inputtextElem.value;
 //   let outputText = outputtextElem.value;
    let inputL = inputLanguage.dataset.value;
    let outputL = outputLanguage.dataset.value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputL}&tl=${outputL}&dt=t&q=${encodeURI(
      inputText
    )}`;
    fetch(url).then(response => response.json()).then( json=>{
        outputtextElem.value = json[0].map((item)=>item[0]).join("");
    });
}

inputtextElem.addEventListener("input",(e)=>{
  if(inputtextElem.value.length > 10000) inputtextElem.value = inputtextElem.value.slice(0,10000);
  translateText();
})

swapBtn.addEventListener("click",(e)=>{
   let tempL = inputLanguage.innerHTML;
   inputLanguage.innerHTML = outputLanguage.innerHTML;
   outputLanguage.innerHTML = tempL;

   let tempdat = inputLanguage.dataset.value;
   inputLanguage.dataset.value = outputLanguage.dataset.value;
   outputLanguage.dataset.value = tempdat;

   let temptext = inputtextElem.value;
   inputtextElem.value = outputtextElem.value;
   outputtextElem.value = temptext;
   translateText();
});



const uploadDoc = document.querySelector("#upload-document");
const uploadTitle = document.querySelector("#input-title");

uploadDoc.addEventListener("click",(e)=>{
  const file = e.target.files[0];
  if((file.type === "application/pdf" )||(file.type === "application/msword") || (file.type === "text/plain")){
       const reader = new FileReader();
       reader.readAsText(file);
       reader.onload = (e) => {
        inputtextElem.value = e.target.result;
        translateText();
       }
  }
  else{
    alert("enter valid document");
  }
})


const downloadDoc = document.querySelector("#download-document");
//const downloadTitle = document.querySelector("#dowload-output");

downloadDoc.addEventListener("click",(e)=>{
  const outText = outputtextElem.value;
  const outLan = outputLanguage.dataset.value;
  if(outText){
    const tex = new Blob([outText],{type: "text/plain"});
    const url = URL.createObjectURL(tex);
    const a  = document.createElement("a");
    a.download = `translated-to-${outLan}.txt`;
    a.href = url;
    a.click();
  }
  else alert("type toh krlo pehle"); 
});

const inputtotal = document.querySelector("#input-chars");
inputtextElem.addEventListener("input",(e)=>{
  inputtotal.innerText = e.target.value.length;
})

const darkmode = document.querySelector("#dk-mode");
darkmode.addEventListener("change",(e)=>{
  document.body.classList.toggle("dark");
}) 