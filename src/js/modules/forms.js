import checkNumInputs from './checkNumInputs';

const forms = (state) => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          windows = document.querySelectorAll('[data-modal]');

    checkNumInputs('input[name="user_phone"]'); 
    
    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! В ближайшее время с вами свяжутся',
        failure: 'Что-то пошло не так...'
    };

    const postData = async (url, data) => {
        document.querySelector('.status').textContent = message.loading;
        let result = await fetch(url, {
            method: "POST",
            body: data
        });

        return await result.text();
    };

    const clearInputs = () => {
        inputs.forEach(input => {
            input.value = '';
        });
    };

    const clearState = () => {
        for (let prop of Object.keys(state)) {
            delete state[prop];
        }
    };

    const hideModal = () => {
        windows.forEach(item => {
            item.style.display = 'none';
        });
    };

    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);

            const formData = new FormData(item);
            if (item.getAttribute('data-calc') === 'end') {
                for (let key in state) {
                    formData.append(key, state[key]);
                }
            }

            postData('assets/server.php', formData)
                .then(result => {
                    console.log(result);
                    statusMessage.textContent = message.success;
                })
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                        hideModal();
                    }, 3000);
                    clearState();
                });
        });
    });
};

export default forms;