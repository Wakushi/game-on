export default class Form {
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
        input.addEventListener("blur", (e) => {
          this.#checkFieldValidity(e.target.name)
          this.#checkFormValidity()
        })
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
