document.addEventListener("DOMContentLoaded", function() {
    class FormSubmit {
        constructor(settings) {
            this.settings = settings;
            this.form = document.querySelector(settings.form);
            this.formButton = document.querySelector(settings.button);
            if (this.form) {
                this.url = this.form.getAttribute("action");
            }
            this.sendForm = this.sendForm.bind(this);
        }

        displayPopup(message) {
            alert(message); // Exibe o pop-up com a mensagem personalizada
        }

        displaySucess() {
            console.log("Success: Mensagem enviada com sucesso!"); // Log para depuração
            this.displayPopup("A sua mensagem foi enviada com sucesso!");
            this.resetButton(); // Restaurar o texto do botão
            this.clearFormFields(); // Limpar os campos do formulário
        }

        displayError() {
            console.log("Error: Ocorreu um erro ao enviar sua mensagem."); // Log para depuração
            this.displayPopup("Não foi possível enviar sua mensagem.");
            this.resetButton(); // Restaurar o texto do botão
        }

        getFormObject() {
            const formObject = {};
            const fields = this.form.querySelectorAll("[name]");
            fields.forEach((field) => {
                formObject[field.getAttribute("name")] = field.value;
            });
            return formObject;
        }

        onSubmission(event) {
            event.preventDefault();
            event.target.disabled = true;
            event.target.innerText = "Enviando...";
        }

        resetButton() {
            this.formButton.disabled = false;
            this.formButton.innerText = "Enviar";
        }

        clearFormFields() {
            this.form.reset(); // Limpa todos os campos do formulário
        }

        async sendForm(event) {
            try {
                this.onSubmission(event);
                const response = await fetch(this.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(this.getFormObject()),
                });
                const result = await response.json();
                console.log("API Response:", result); // Log para depuração
                if (result.success === "true") {
                    this.displaySucess();
                } else {
                    this.displayError();
                }
            } catch (error) {
                this.displayError();
                console.error("Error:", error); // Log para depuração
            }
        }

        init() {
            if (this.form) this.formButton.addEventListener("click", this.sendForm);
            return this;
        }
    }

    const formSubmit = new FormSubmit({
        form: "[data-form]",
        button: "[data-button]",
        sucess: "Mensagem enviada com sucesso!",
        error: "Não foi possível enviar sua mensagem."
    });

    formSubmit.init();
});
