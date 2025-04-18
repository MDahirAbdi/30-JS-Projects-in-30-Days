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
});