var modal = document.querySelector(".modal");
var closeButton = modal.querySelector(".modal__close");
var inputFocus = modal.querySelector(".modal__label--left .modal__input");
var openButton = document.querySelector(".contacts__button");
var modalForm = modal.querySelector(".modal__form");

openButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    modal.classList.remove("modal--hidden");
    inputFocus.focus();
});

closeButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    modal.classList.add("modal--hidden");
    openButton.focus();
});

modalForm.addEventListener("submit", function (evt) {
    modal.classList.add("modal--hidden");
    openButton.focus();
});
