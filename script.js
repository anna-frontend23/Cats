const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");

let user =localStorage.getItem("User");
if (!user) {
    user = prompt("Введите Ваше имя");
    localStorage.setItem("User", user);
}

popupBlock.querySelector(".popup__close").addEventListener("click", function() {
    popupBlock.classList.remove("active");
});

document.querySelector("#add").addEventListener("click", function(e) {
    e.preventDefault();
    popupBlock.classList.add("active");
});

const addForm = document.forms.addForm;

const createCard = function(cat, parent) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("div");
    img.className = "card-pic";
    if (cat.img_link) {
        img.style.backgroundImage = `url(${cat.img_link})`
    } else {
        img.style.backgroundImage = "url(img/cat.jpeg)";
        img.style.backgroundSize = "contain";
    }

    const name = document.createElement("h3");
    name.innerText = cat.name;

    const del = document.createElement("button");
    del.innerText = "Delete";
    del.id = cat.id;
    del.addEventListener("click", function(e) {
        let id = e.target.id;
        deleteCat(id, card);
    });

    card.append(img, name, del);
    parent.append(card);
}

fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show`)
.then(response => response.json())
.then(data => {
    if (data.message === "ok") {
        console.log(data.data[0]);
        data.data.forEach(function(el){
            createCard(el, container);
        })
    }
})

const addCat = function(cat) {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "ok") {
            createCard(cat, container);
            addForm.reset();
            popupBlock.classList.remove("active");
        }
    })
}

const deleteCat = function(id, tag) {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "ok") {
            tag.remove();
        }
    })
}

addForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let body = {};
    for (let i = 0; i < addForm.elements.length; i++) {
        let el = addForm.elements[i];
       
        if (el.name) {
            body[el.name] = el.name === "favourite" ? el.checked : el.value
        }
    }
    
    addCat(body);
});