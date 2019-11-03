export function checkPasswordStrength() {
    const { min, customRegex, rule } = this.props;
    const { value } = this.state;
    const minLength = min || 6;
    const string = value ? String(value) : '';
    const passLength = value ? string.length : 0;
    let passwordStrength = null;

    if(customRegex) {
        const customRegexPass = new RegExp(customRegex, 'g').test(string);
        
        passwordStrength = (passLength >= minLength ? 75 : ((75 / minLength) * passLength)) + (customRegexPass ? 25 : 0)
    } else if (rule === 'password') {
        const hasUppercase = /(?=.*[A-Z])/.test(string);
        const hasLowercase = /(?=.*[a-z])/.test(string);
        const hasDigit = /\d/.test(string);

        passwordStrength = (passLength >= minLength ? 50 : ((50 / minLength) * passLength)) + (hasLowercase ? 10 : 0) + (hasUppercase ? 20 : 0) + (hasDigit ? 20 : 0);
    }

    this.setState({ passwordStrength });
}