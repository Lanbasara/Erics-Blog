const app = document.getElementById("app");
let div = document.createElement("div");
div.innerHTML = "<div>Hahahahah</div><div>This is Sub2 App content</div>";
app.append(div);
window.addEventListener("hashchange", (e) => {
  console.log("hashchange", e);
});

window.vanillaJs = {
  unmount: function () {
    console.log("vanillaJs unmout");
    app.innerHTML = "";
  },
};
