class SignUpModalElement {
  constructor() {
    this.modal = document.querySelector(".bground")
    this.modalBtn = document.querySelectorAll(".modal-btn")
    this.clodeModalBtn = this.modal.querySelector(".close")
    this.#bindEvents()
  }

  #bindEvents() {
    this.modalBtn.forEach((btn) =>
      btn.addEventListener("click", () => this.launchModal())
    )
    this.clodeModalBtn.addEventListener("click", () => this.closeModal())
  }

  launchModal() {
    this.modal.style.display = "block"
    App.toggleScroll()
    if (!this.signUpForm) {
      this.signUpForm = new SignUpFormElement()
    }
  }

  closeModal() {
    this.confirmationElement?.remove()
    this.modal.style.display = "none"
    App.toggleScroll()
  }

  onFormSubmit(e) {
    this.confirmationElement = document.createElement("div")
    this.confirmationElement.classList.add("confirmation")
    this.confirmationElement.innerHTML = `
      <div class="confirmation">
        <p>Merci pour votre inscription ${e.detail.firstName} !</p>
        <button class="confirmation-close">Fermer</button>
      </div>
    `
    this.modal
      .querySelector(".modal-body")
      .appendChild(this.confirmationElement)
    this.confirmationElement
      .querySelector(".confirmation-close")
      .addEventListener("click", () => this.closeModal())
  }
}

class SignUpFormElement {
  constructor() {
    this.form = new Form(".signin-form")
  }
}

class Form {
  constructor(formHook) {
    this.form = document.querySelector(formHook)
    this.#registerInputs()
    this.#registerFields()
    this.#bindEvents()
  }

  #registerInputs() {
    this.inputs = this.form.querySelectorAll("input")
  }

  #registerFields() {
    this.fields = []
    this.inputs.forEach((input) => {
      if (
        !this.fields.find((field) => field.name === input.name) &&
        input.name
      ) {
        this.fields.push({
          name: input.name,
          type: input.type,
          required: input.name !== "newsletter",
          value: null,
          error: null,
          parentNode: input.closest(".formData"),
        })
      }
    })
  }

  #bindEvents() {
    this.form.addEventListener("submit", (e) => this.#onSubmit(e))
    this.inputs.forEach((input) => {
      input.addEventListener("input", (e) => this.#onChange(e))
      if (input.type !== "radio" && input.type !== "checkbox") {
        input.addEventListener("blur", (e) =>
          this.#checkFieldValidity(e.target.name)
        )
      }
    })
  }

  #onChange(e) {
    const { name, value, checked } = e.target
    this.#saveValue(name, e.target.type === "checkbox" ? checked : value)
    this.#checkFormValidity()
  }

  #saveValue(field, newValue) {
    this.fields.map((registeredField) => {
      if (registeredField.name === field) {
        registeredField.value = newValue
      }
    })
  }

  #checkFieldValidity(fieldName) {
    const field = this.fields.find((f) => f.name === fieldName)
    if (!field) return
    switch (field.type) {
      case "text":
        field.error =
          field.value?.length < 2
            ? "Le champs doit contenir au moins 2 caractères."
            : null
        break
      case "email":
        field.error = !field.value?.match(
          /^[a-zA-Z0-9.#-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        )
          ? "L'email n'est pas valide"
          : null
        break
      case "number":
        field.error = !field.value ? "Veuillez choisir un nombre" : null
        break
      case "date":
        field.error = !field.value ? "Veuillez choisir une date" : null
        break
      default:
        break
    }
    if (field.error) {
      field.parentNode.dataset.error = field.error
      field.parentNode.dataset.errorVisible = true
    } else {
      field.parentNode.dataset.error = ""
      field.parentNode.dataset.errorVisible = false
    }
  }

  #checkFormValidity() {
    let isValid = true
    this.fields.forEach((field) => {
      if (field.required && (field.error || !field.value)) {
        isValid = false
      }
    })
    this.#toggleSubmitButton(!isValid)
  }

  #toggleSubmitButton(disabled) {
    this.form.querySelector("button[type='submit']").disabled = disabled
  }

  #onSubmit(e) {
    e.preventDefault()
    const formData = {}
    this.fields.forEach((field) => {
      formData[field.name] = field.value
    })
    this.form.reset()
    this.#toggleSubmitButton(true)
    this.#emitFormSubmit(formData)
  }

  #emitFormSubmit(formData) {
    const event = new CustomEvent("formSubmit", { detail: formData })
    document.dispatchEvent(event)
  }
}

class Header {
  constructor() {
    this.header = document.querySelector("header")
    this.#bindEvents()
  }

  #bindEvents() {
    this.header
      .querySelector(".hamburger")
      .addEventListener("click", () => this.#toggleNav())
    this.header
      .querySelector(".close")
      .addEventListener("click", () => this.#toggleNav())
  }

  #toggleNav() {
    this.header.querySelector(".main-navbar").classList.toggle("active")
  }
}

class App {
  static init() {
    const signupModal = new SignUpModalElement()
    document.addEventListener("formSubmit", (e) => signupModal.onFormSubmit(e))
    new Header()
  }

  static toggleScroll() {
    document.body.classList.toggle("no-scroll")
  }
}

App.init()
