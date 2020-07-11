const currentPage = location.pathname

const menuItems = document.querySelectorAll("header .links a") 

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

const cards = document.querySelectorAll(".card")

for (let card of cards) {
    card.addEventListener("click", function () {
        const recipeId = card.getAttribute("id")

        window.location.href = `recipes/${recipeId}`
    })
}

const recipeInformation = document.querySelectorAll('.recipe-information')

for (let section of recipeInformation) {
    const visible = section.querySelector('.visible') 
    const showAndHide = section.querySelector('.show-and-hide')

    showAndHide.addEventListener('click', () => {
        if (visible.classList.contains('visible')) {
            visible.classList.add('invisible')
            visible.classList.remove('visible')
            showAndHide.textContent = "Mostrar"
        } else {
            visible.classList.remove('invisible')
            visible.classList.add('visible')
            showAndHide.textContent = "Esconder"
        }
    })
}