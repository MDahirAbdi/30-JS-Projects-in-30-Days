document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordField = document.getElementById('password');
    const lengthSlider = document.getElementById('length');
    const lengthNumber = document.getElementById('length-number');
    const lengthValue = document.getElementById('length-value');

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      };
    
      passwordField.value = '';

      generateBtn.addEventListener('click', () => {
        createPassword();
        regenerateBtn.style.display = 'inline-flex';
      });

      regenerateBtn.addEventListener('click', createPassword);
      copyBtn.addEventListener('click', copyPassword);
    
      lengthSlider.addEventListener('input', function () {
        lengthNumber.value = this.value;
        lengthValue.textContent = this.value;
      });

        
    function createPassword() {
        const length = parseInt(lengthSlider.value);
        const options = {
          uppercase: document.getElementById('uppercase').checked,
          lowercase: document.getElementById('lowercase').checked,
          numbers: document.getElementById('numbers').checked,
          special: document.getElementById('special').checked,
        };
    
        let charPool = ''; //character pool"
        let guaranteedChars = [];
    
        for (const [type, enabled] of Object.entries(options)) {
          if (enabled && charSets[type]) {
            charPool += charSets[type];
            guaranteedChars.push(getSecureRandomChar(charSets[type]));
          }
        }
    
        if (!charPool) {
          showModal('Please select at least one character type');
          return;
        }
    
        if (guaranteedChars.length > length) {
          showModal('Password length too short for selected character types');
          return;
        }
    
        let passwordChars = [...guaranteedChars];
        for (let i = guaranteedChars.length; i < length; i++) {
          passwordChars.push(getSecureRandomChar(charPool));
        }
    
        const password = shuffle(passwordChars).join('');
        passwordField.value = password;
        updateStrengthIndicator(password);
      }

      function getSecureRandomChar(str) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        return str[randomValues[0] % str.length];
      }
    
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      function copyPassword() {
        const pwd = passwordField.value;
        if (!pwd) return;
        navigator.clipboard.writeText(pwd)
          .then(() => showModal('Password copied to clipboard!'))
          .catch(() => showModal('Failed to copy password'));
      }

      function showModal(message) {
        const modal = document.getElementById('modal');
        modal.querySelector('.modal-content').textContent = message;
        modal.classList.add('show');
        setTimeout(() => modal.classList.remove('show'), 2000);
      }

      function updateStrengthIndicator(password) {
        const strengthText = document.getElementById('strength-text');
        const strengthFill = document.querySelector('.strength-fill');
        const entropyBits = document.getElementById('entropy-bits');
    
        const length = password.length;
    
        const poolSize = Object.entries(charSets).reduce((acc, [type, chars]) => {
          const regex = new RegExp(`[${chars.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}]`);
          if (regex.test(password)) {
            acc += chars.length;
          }
          return acc;
        }, 0);
    
        const entropy = length * Math.log2(poolSize || 1);
        entropyBits.textContent = `~${Math.round(entropy)} bits`;
    
        let strength, color;
        if (entropy > 80) {
          strength = 'Very Strong';
          color = '#00b894';
        } else if (entropy > 60) {
          strength = 'Strong';
          color = '#4CAF50';
        } else if (entropy > 40) {
          strength = 'Good';
          color = '#8BC34A';
        } else if (entropy > 20) {
          strength = 'Fair';
          color = '#FFC107';
        } else {
          strength = 'Weak';
          color = '#F44336';
        }
    
        strengthText.firstChild.textContent = strength;
        strengthText.style.color = color;
        strengthFill.style.width = `${Math.min(entropy, 100)}%`;
        strengthFill.style.backgroundColor = color;
      }
    
});