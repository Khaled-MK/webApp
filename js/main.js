const glob = document.getElementById("global");
const searchBar = document.getElementById("searchBar");

let sourats;
console.log("tt");
window.addEventListener("load", async () => {
   const response = await fetch(`https://api.quran.com/api/v4/chapters`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });
   if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
   }
   const data = await response.json();

   srtDisplay(data.chapters);

   let lecBtns = document.querySelectorAll(".btn");
   lecture(lecBtns);
});

searchBar.addEventListener("input", () => {
   let sowar = document.querySelectorAll(".soura");
   const input = searchBar.value;

   sowar.forEach((soura) => {
      let arTitre = soura.firstChild.firstChild.textContent;
      let frTitre = soura.firstChild.lastChild.textContent.toLocaleLowerCase();

      if (arTitre.includes(input) || frTitre.includes(input.toLocaleLowerCase())) {
         soura.classList.remove("hidden");
      } else {
         soura.classList.add("hidden");
      }
   });
});

function formatTime(seconds) {
   const minutes = Math.floor(seconds / 60);
   const secs = Math.floor(seconds % 60);
   return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function srtDisplay(data) {
   sourats = data;

   data.forEach((soura) => {
      const bigDiv = document.createElement("div");
      const titreDiv = document.createElement("div");
      const versesDiv = document.createElement("div");
      const placeDiv = document.createElement("div");
      const btnDiv = document.createElement("div");
      const arH = document.createElement("h2");
      const frH = document.createElement("h3");
      const vPara = document.createElement("p");
      const vArPara = document.createElement("p");
      const vFrPara = document.createElement("p");
      const arPlacePara = document.createElement("p");
      const frPlacePara = document.createElement("p");
      const lecBtn = document.createElement("button");
      const arNom = document.createTextNode(soura.name_arabic);
      const frNom = document.createTextNode(soura.name_simple);
      const frVerses = document.createTextNode(`Verses`);
      const arVerses = document.createTextNode("الآيات");
      const verses = document.createTextNode(soura.verses_count);

      bigDiv.classList.add("bg-white", "rounded-xl", "shadow-md", "px-3", "pt-6", "pb-2", "gap-y-10", "text-xl", "soura");
      titreDiv.classList.add("my-3", "text-center", "font-semibold");
      arH.classList.add("arTitre", "text-2xl");
      frH.classList.add("frTitre", "text-xl");
      versesDiv.classList.add("flex", "justify-between", "text-lg");
      placeDiv.classList.add("flex", "justify-between", "text-lg");
      btnDiv.classList.add("my-4", "w-full", "flex", "justify-center");
      lecBtn.classList.add("btn", "bn632-hover", "bn25", "flex", "justify-center", "py-1", "px-14", "text-xl", "text-white", "cursor-pointer", "select-none");
      vPara.classList.add("font-bold");

      arH.append(arNom);
      frH.append(frNom);
      vArPara.append(arVerses);
      vFrPara.append(frVerses);
      vPara.append(verses);

      if (soura.revelation_place === "makkah") {
         arPlacePara.append(document.createTextNode(`مكية`));
         frPlacePara.append(document.createTextNode(`Makkia`));
      } else if (soura.revelation_place === "madinah") {
         arPlacePara.append(document.createTextNode(`مدنية`));
         frPlacePara.append(document.createTextNode(`Madania`));
      } else {
         arPlacePara.append(document.createTextNode(`لايوجد`));
         frPlacePara.append(document.createTextNode(`intouvable`));
      }

      lecBtn.append(document.createTextNode("قراءة"));

      btnDiv.append(lecBtn);
      placeDiv.append(arPlacePara, frPlacePara);
      versesDiv.append(vArPara, vPara, vFrPara);
      titreDiv.append(arH, frH);
      bigDiv.append(titreDiv, versesDiv, placeDiv, btnDiv);

      bigDiv.id = soura.id;

      glob.append(bigDiv);
   });
   return sourats;
}

async function lecture(lecBtns) {
   lecBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
         let bigDiv = btn.parentElement.parentElement;
         const lecDiv = document.createElement("div");
         const ctrlDiv = document.createElement("div");
         const backBtn = document.createElement("button");
         const playBtn = document.createElement("button");
         const downBtn = document.createElement("button");
         const fwdBtn = document.createElement("button");
         const stopBtn = document.createElement("button");
         const backi = document.createElement("i");
         const downi = document.createElement("i");
         const playi = document.createElement("i");
         const fwdi = document.createElement("i");
         const stopi = document.createElement("i");
         const audio = document.createElement("audio");
         const timeBar = document.createElement("input");
         const curTimeSpan = document.createElement("span");
         const fullTimeSpan = document.createElement("span");
         const secDiv = document.createElement("div");
         const switchsDiv = document.createElement("div");
         const reapSan = document.createElement("span");
         const label = document.createElement("label");
         const input = document.createElement("input");
         const div = document.createElement("div");
         const ptDiv = document.createElement("div");

         const suitSpan = document.createElement("span");
         const suitLabel = document.createElement("label");
         const suitInput = document.createElement("input");
         const div2 = document.createElement("div");
         const suitPtDiv = document.createElement("div");
         const suitDiv = document.createElement("div");
         const reapDiv = document.createElement("div");
         const reciterDiv = document.createElement("div");
         const reciterUl = document.createElement("ul");
         const fileName = bigDiv.firstChild.lastChild.textContent; // je sais pas pourquoi
         // let frFileName = bigDiv.firstChild.lastChild.textContent;

         const response = await fetch(`https://api.quran.com/api/v4/resources/recitations`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
            },
         });
         if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut : ${response.status}`);
         }
         const data = await response.json();
         const reciters = data.recitations;

         for (let i = 0; i < reciters.length; i++) {
            const li = document.createElement("li");
            let name;

            switch (reciters[i].reciter_name) {
               case "AbdulBaset AbdulSamad":
                  name = document.createTextNode("عبد الباسط عبد الصمد");
                  break;
               case "Abdur-Rahman as-Sudais":
                  name = document.createTextNode("السديس عبد الرحمان");
                  break;
               case "Abu Bakr al-Shatri":
                  name = document.createTextNode("الشاطري ابو بكر");
                  break;
               case "Hani ar-Rifai":
                  name = document.createTextNode("هاني الرفاعي");
                  break;
               case "Mahmoud Khalil Al-Husary":
                  name = document.createTextNode("الحصيري محمود خليل");
                  break;
               case "Mishari Rashid al-`Afasy":
                  name = document.createTextNode("مشاري رشيد العفاسي");
                  break;
               case "Mohamed Siddiq al-Minshawi":
                  name = document.createTextNode("المنشاوي صديق محمد");
                  break;
               case "Sa`ud ash-Shuraym":
                  name = document.createTextNode("سعود الشريم");
                  break;
               case "Mohamed al-Tablawi":
                  name = document.createTextNode("الطلباوي محمد");
                  break;
            }
            li.classList.add("tracks", "reciter", "bg-gradient-to-t", "from-green-600", "to-green-400", "w-[100px]", "px-2", "rounded-full", "overflow-hidden", "text-ellipsis", "whitespace-pre", "text-center");

            li.id = reciters[i].id;

            li.append(name);
            reciterUl.append(li);
         }

         input.type = "checkbox";
         suitInput.type = "checkbox";

         ptDiv.classList.add("toggle-switch-handle");
         suitPtDiv.classList.add("toggle-switch-handle");
         div.classList.add("toggle-switch-background");
         div2.classList.add("toggle-switch-background");
         label.classList.add("toggle-switch", "mt-1");
         suitLabel.classList.add("toggle-switch", "mt-1");
         switchsDiv.classList.add("w-1/2", "flex", "flex-col", "items-end", "justify-end", "px-2", "gap-x-2", "content-start");
         secDiv.classList.add("my-3", "flex", "justify-between");
         bigDiv.classList.add("col-span-2", "gap-y-10");
         bigDiv.firstChild.classList.remove("text-center", "my-3"); //je sais pas pourquoi
         bigDiv.firstChild.classList.add("w-1/2");

         lecDiv.classList.add("my-4", "px-4", "flex", "items-center", "justify-center", "gap-x-3", "text-[16px]");
         ctrlDiv.classList.add("flex", "gap-4", "justify-center");
         backBtn.classList.add("controls", "w-8", "h-8", "bg-green-600", "text-white", "text-[16px]", "rounded-full", "flex", "justify-center", "items-center");
         playBtn.classList.add("controls", "play", "w-8", "h-8", "bg-green-600", "text-white", "text-[16px]", "rounded-full", "flex", "justify-center", "items-center");
         fwdBtn.classList.add("controls", "w-8", "h-8", "bg-green-600", "text-white", "text-[16px]", "rounded-full", "flex", "justify-center", "items-center");
         stopBtn.classList.add("controls", "w-8", "h-8", "bg-green-600", "text-white", "text-[16px]", "rounded-full", "flex", "justify-center", "items-center");
         downBtn.classList.add("controls", "down", "w-8", "h-8", "bg-green-600", "text-white", "text-[16px]", "rounded-full", "flex", "justify-center", "items-center");
         downi.classList.add("fa-solid", "fa-download");
         backi.classList.add("fa", "fa-angles-right");
         playi.classList.add("fa", "fa-play", "rot");
         fwdi.classList.add("fa", "fa-angles-left");
         stopi.classList.add("fa", "fa-stop");
         timeBar.classList.add("time-bar");
         reciterDiv.classList.add("inner", "w-full", "overflow-hidden", "flex", "justify-center");
         reciterUl.classList.add("track", "flex", "mx-auto", "w-full", "gap-x-2", "px-2", "text-sm", "text-white", "py-3");

         timeBar.type = "range";
         timeBar.value = 0;
         curTimeSpan.textContent = "0:00";
         fullTimeSpan.textContent = "0:00";

         reciterDiv.append(reciterUl);
         div2.append(suitPtDiv);
         suitLabel.append(suitInput, div2);
         suitDiv.append(suitSpan, suitLabel);
         reapDiv.append(reapSan, label);
         switchsDiv.append(reapDiv, suitDiv);
         div.append(ptDiv);
         label.append(input, div);
         reapSan.append(document.createTextNode("إعادة"));
         suitSpan.append(document.createTextNode("مواصلة"));
         secDiv.append(bigDiv.firstChild, switchsDiv);
         bigDiv.prepend(secDiv);
         lecDiv.append(curTimeSpan, timeBar, fullTimeSpan, audio);
         downBtn.append(downi);
         backBtn.append(backi);
         playBtn.append(playi);
         fwdBtn.append(fwdi);
         stopBtn.append(stopi);
         ctrlDiv.append(backBtn, playBtn, fwdBtn, stopBtn, downBtn);
         bigDiv.append(lecDiv, ctrlDiv, reciterDiv);

         bigDiv.children[3].remove();
         bigDiv.children[2].remove();
         bigDiv.children[1].remove();

         let avReciters = document.querySelectorAll(".reciter");
         await fetch(`https://api.quran.com/api/v4/chapter_recitations/2/${bigDiv.id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
            },
         })
            .then((response) => {
               if (!response.ok) {
                  throw new Error(`Erreur HTTP! Statut : ${response.status}`);
                  throwError(bigDiv);
               }
               return response.json();
            })
            .then((data) => {
               console.log(data.audio_file.audio_url);
               audio.src = data.audio_file.audio_url;
               audioReload(audio, fullTimeSpan, downBtn);
               playi.classList.add("fa-play");
               playi.classList.remove("fa-pause");
               playi.classList.remove("fa-rotate-left");
               audio.currentTime = 0;
            });

         avReciters.forEach((reciter, index) => {
            let choix = 0;
            if (index === 0) {
               reciter.classList.add("from-green-900", "to-green-700");
               reciter.classList.remove("from-green-600", "to-green-400");
            }
            reciter.addEventListener("click", async () => {
               for (let i = 0; i < avReciters.length; i++) {
                  avReciters[i].classList.remove("from-green-900", "to-green-700");
                  avReciters[i].classList.add("from-green-600", "to-green-400");
               }
               reciter.classList.add("from-green-900", "to-green-700");
               reciter.classList.remove("from-green-600", "to-green-400");

               choix = reciter.id;

               await fetch(`https://api.quran.com/api/v4/chapter_recitations/${choix}/${bigDiv.id}`, {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                  },
               })
                  .then((response) => {
                     if (!response.ok) {
                        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
                     }
                     return response.json();
                  })
                  .then((data) => {
                     console.log(data.audio_file.audio_url);
                     audio.src = data.audio_file.audio_url;
                     audioReload(audio, fullTimeSpan, downBtn);
                     playi.classList.add("fa-play");
                     playi.classList.remove("fa-pause");
                     playi.classList.remove("fa-rotate-left");
                     audio.currentTime = 0;
                  });
            });
         });

         audio.addEventListener("canplay", () => {
            playBtn.classList.add("bg-green-600");
         });
         backBtn.addEventListener("click", () => {
            audio.currentTime = parseFloat(audio.currentTime) - 10;
         });
         fwdBtn.addEventListener("click", async () => {
            audio.currentTime = parseFloat(audio.currentTime) + 10;
         });

         playBtn.addEventListener("click", () => {
            let audios = document.querySelectorAll(".audio");
            let playsbtn = document.querySelectorAll(".fa-pause");

            for (let i = 0; i < audios.length; i++) {
               audios[i].pause();
            }

            if (playi.classList.contains("fa-play") || playi.classList.contains("fa-rotate-left")) {
               playi.classList.add("fa-pause");
               playi.classList.remove("fa-play");
               playi.classList.remove("fa-rotate-left");
               audio.play();
            } else {
               playi.classList.remove("fa-pause");
               playi.classList.remove("fa-rotate-left");
               playi.classList.add("fa-play");
               audio.pause();
            }
            for (let i = 0; i < playsbtn.length; i++) {
               playsbtn[i].classList.add("fa-play");
               playsbtn[i].classList.remove("fa-pause");
            }
         });

         stopBtn.addEventListener("click", () => {
            playi.classList.remove("fa-pause");
            playi.classList.add("fa-rotate-left");
            audio.pause();
            audio.currentTime = 0;
         });

         audio.addEventListener("timeupdate", async () => {
            timeBar.value = (audio.currentTime * 100) / audio.duration;
            curTimeSpan.textContent = formatTime(audio.currentTime);

            if (audio.currentTime === audio.duration && input.checked) {
               audio.currentTime = 0;
               audio.play();
            } else if (audio.currentTime === audio.duration && suitInput.checked) {
               playi.classList.remove("fa-play");
               playi.classList.remove("fa-pause");
               playi.classList.add("fa-rotate-left");
               bigDiv.nextSibling.lastChild.firstChild.click();
               bigDiv.nextSibling.firstChild.lastChild.lastChild.lastChild.click();
               let plays = document.querySelectorAll(".play");
               plays[plays.length - 1].click();
            } else if (audio.currentTime === audio.duration && !input.checked && !suitInput.checked) {
               playi.classList.remove("fa-pause");
               playi.classList.add("fa-rotate-left");
            }
         });

         input.addEventListener("click", () => {
            if (suitInput.checked) {
               suitInput.click();
            }
         });
         suitInput.addEventListener("click", () => {
            if (input.checked) {
               input.click();
            }
         });

         timeBar.addEventListener("change", (e) => {
            audio.currentTime = (timeBar.value * audio.duration) / 100;
         });

         input.addEventListener("change", (e) => {
            if (e.target.checked) {
            }
         });
      });
   });
}

async function audioReload(audio, fullTimeSpan, downBtn) {
   audio.addEventListener("loadedmetadata", async () => {
      audio.classList.add("audio");
      fullTimeSpan.textContent = "";
      audio.currentTime = 0;
      fullTimeSpan.append(document.createTextNode(formatTime(audio.duration)));
   });
}

function throwError(parent) {
   const div = document.createElement("div");
   const p = document.createElement("p");

   p.textContent = "لا يمكن الاتصال بانترنت";
   p.classList.add("errMsg", "text-center", "text-red-600", "text-[16px]", "my-3");

   div.append(p);
   parent.append(div);
}
