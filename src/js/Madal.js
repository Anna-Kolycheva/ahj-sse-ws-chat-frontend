export default class Modal {
  showModal() {
    this.createModal();
    document.body.appendChild(this.modal);

    this.buttonСontinue = this.modal.querySelector('.form__button');
    this.buttonСontinue.addEventListener('click', this.onSaveName);
  }

  onSaveName(event) {
    event.preventDefault();
    let { modal } = this.modal;

    const formText = modal.querySelector('.form__text');
    this.name = formText.value;

    if (this.name === '') {
      formText.style.background = '#dba1a1';
      setTimeout(() => {
        formText.style.background = '#fdfdfd';
      }, 800);
      return;
    }

    this.onStart();
    document.body.removeChild(modal);
    modal = null;
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    if (!this.warning) {
      this.warning = '';
    } else {
      setTimeout(() => {
        this.modal.querySelector('.warning').classList.add('hidden');
      }, 2000);
    }

    this.modal.innerHTML = `
      <div class="modal__wrapper">
        <div class="modal__content">
          <h3 class="modal__title">Выберите псевдоним</h3>
          <form class="form">
              <textarea type="text" class="form__text " required></textarea>
              <button class="form__button button button-continue">продолжить</button>
              <div class='warning'>${this.warning}</div>
          </form> 
        </div>
      </div>
      `;
    this.warning = '';
  }
}
