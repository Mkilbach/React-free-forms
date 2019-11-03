export function checkIfOptionalEmpty() {
    const { value } = this.state;
    const { required } = this.props;

    if(!required && (value === '' || value === undefined || value === null || value === false)) return true
    return false
}

export function checkInputRequiredValidity() {
    const { value } = this.state;
    const { required, requirederrortext } = this.props;
    
    if (required && !value) {
        this.setState({ errorText: requirederrortext || 'input is required' });
        return false;
    } else {
        return true;
    }
}

export function checkInputLengthValidity() {
    const { value } = this.state;
    const { min, type, minErrorText } = this.props;

    if ((!type || type === 'text' || type === 'password')
        && typeof value === 'string'
        && min
        && !(value.length === 0 || value.length >= min)
    ) {
        this.setState({ errorText: minErrorText || 'input value is too short' })
        return false;
    } else {
        return true;
    }
}

export function checkInputRuleValidity() {
    const { value } = this.state;
    const { rule, customRegex, min } = this.props;
    let result = false;
    let regex;

    if (customRegex) {
        regex = new RegExp(customRegex, 'g');
        result = regex.test(String(value).toLowerCase());
    } else if (!rule) {
        result = true;
    } else {
        switch (rule) {
            case 'text':
                regex = /.*[^ ].*/;
                result = regex.test(String(value).toLowerCase());
                break;

            case 'number':
                regex = /^[0-9]*$/;
                result = regex.test(String(value).toLowerCase());
                break;

            case 'email':
                regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                result = regex.test(String(value).toLowerCase());
                break;

            case 'zip-code':
                regex = /[\d -]+/;
                result = regex.test(String(value).toLowerCase());
                break;

            case 'phone':
                regex = /1?-?\.?\(?\d{3}[-).\s]?\d{3}[-.\s]?\d{3}/;
                result = regex.test(String(value).toLowerCase());
                break;

            case 'password':
                const regexString = '(?=^.{' + (min || 6) + ',}$)(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).*$';
                regex = new RegExp(regexString);
                result = regex.test(String(value));
                break;

            case 'select':
            case 'radio':
            case 'checkbox':
                result = value ? true : false;
                break;

            default:
                break;
        }
    }

    !result && this.setState({ errorText: this.props.errorText || 'input is invalid' });

    return result;
}