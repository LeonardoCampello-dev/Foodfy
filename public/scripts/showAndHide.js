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