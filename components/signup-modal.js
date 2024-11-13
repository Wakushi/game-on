import App from "../app.js"
import SignUpFormElement from "./signup-form.js"

export default class SignUpModalElement {
  constructor() {
    this.modal = document.querySelector(".bground")
    this.modalBtn = document.querySelectorAll(".modal-btn")
    this.clodeModalBtn = this.modal.querySelector(".close")
    this.#bindEvents()
  }

  #bindEvents() {
    this.modalBtn.forEach((btn) =>
      btn.addEventListener("click", () => this.#launchModal())
    )
    this.clodeModalBtn.addEventListener("click", () => this.#closeModal())
    document.addEventListener("formSubmit", (e) => this.#onFormSubmit(e))
  }

  #launchModal() {
    this.modal.style.display = "block"

    App.toggleScroll()

    if (!this.signUpForm) {
      this.signUpForm = new SignUpFormElement()
    }
  }

  // This method handle the closing of the modal
  #closeModal() {
    this.confirmationElement?.remove()
    this.modal.style.display = "none"

    App.toggleScroll()
  }

  // When the form is submitted, a custom “formSubmit" event is dispatched and
  // it triggers this method to create a confirmation screen with the user's name
  #onFormSubmit(e) {
    this.confirmationElement = document.createElement("div")
    this.confirmationElement.classList.add("confirmation")
    this.confirmationElement.innerHTML = `
          <p>Merci pour votre inscription ${e.detail.firstName} !</p>
          <button class="confirmation-close">Fermer</button>
      `

    this.modal
      .querySelector(".modal-body")
      .appendChild(this.confirmationElement)

    this.confirmationElement
      .querySelector(".confirmation-close")
      .addEventListener("click", () => this.#closeModal())
  }
}
