const Menu = {
    currentPage: location.pathname,
    menuItems: document.querySelectorAll('header .links a')
}

for (item of Menu.menuItems) {
    if (Menu.currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

const Fields = {
    addIngredient() {
        const ingredients = document.querySelector('#ingredients')
        const fieldContainer = document.querySelectorAll('.ingredient')

        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

        if (newField.children[0].value == '') return false

        newField.children[0].value = ''
        ingredients.appendChild(newField)
    },
    addPreparation() {
        const preparations = document.querySelector('#preparations')
        const fieldContainer = document.querySelectorAll('.preparation')

        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

        if (newField.children[0].value == '') return false

        newField.children[0].value = ''
        preparations.appendChild(newField)
    }
}

const PhotosUpload = {
    input: '',
    photosPreview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    removedFiles: document.querySelector('input[name="removed_files"]'),
    handleFileInput(e) {
        const { files: fileList } = event.target
        PhotosUpload.input = e.target

        if (PhotosUpload.hasLimit(e)) return

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.photosPreview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(e) {
        const { uploadLimit, input, photosPreview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} imagens 📷`)

            e.preventDefault()
            return true
        }

        const photosDiv = []
        photosPreview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo') {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} imagens 📷`)

            e.preventDefault()
            return true
        }

        return false
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.classList.add('chef-avatar')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'delete'

        return button
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    removePhoto(e) {
        const photoDiv = e.target.parentNode
        const photosArray = Array.from(PhotosUpload.photosPreview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(e) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            if (PhotosUpload.removedFiles) PhotosUpload.removedFiles.value += `${photoDiv.id},`
        }

        console.log(PhotosUpload.removedFiles)
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.photos .highlight'),
    previews: document.querySelectorAll('.photos .gallery-photos img'),
    setImage(e) {
        const image = e.target

        ImageGallery.previews.forEach(preview => preview.classList.remove('image-active'))
        image.classList.add('image-active')

        ImageGallery.highlight.src = image.src
        Lightbox.image.src = image.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox'),
    image: document.querySelector('.lightbox img'),
    closeButton: document.querySelector('.lightbox a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = '-100%'
        Lightbox.target.style.bottom = 'initial'
        Lightbox.closeButton.style.top = '-80px'
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) error = 'Formato de email inválido!'

        return {
            error,
            value
        }
    },
    displayError(input, error) {
        input.classList.add('input-error')
        input.placeholder = error

        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')

        input.classList.remove('input-error')
        input.placeholder = 'Digite o email'

        if (errorDiv)
            errorDiv.remove()
    }
}