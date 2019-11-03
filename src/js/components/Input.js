import React, { Component } from 'react'
import PropTypes from 'prop-types'

import setStateAsync from '../functions/setStateAsync'
import { checkInputRuleValidity, checkInputRequiredValidity, checkInputLengthValidity, checkIfOptionalEmpty } from '../functions/checkInputValidity'
import { generateInputField, generateSelectField, generateRadiosField, generatePasswordField } from '../functions/generateField'
import { checkPasswordStrength } from '../functions/checkPasswordStrength'

export default class Input extends Component {

    // PROP TYPES
    static propTypes = {
        required: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        rule: PropTypes.string,
        inputOptions: PropTypes.array,
        inputClass: PropTypes.string,
        errorClass: PropTypes.string,
        labelClass: PropTypes.string,
        placeholder: PropTypes.string,
        max: PropTypes.number,
        min: PropTypes.number,
        readonly: PropTypes.bool,
        disabled: PropTypes.bool,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onBeforeChange: PropTypes.func,
        onAfterChange: PropTypes.func,
        title: PropTypes.string,
        errorText: PropTypes.string,
        group: PropTypes.string,
        minErrorText: PropTypes.string,
        requirederrortext: PropTypes.string,
        customRegex: PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }

    // BINDING IMPORTED FUNCTIONS
    setStateAsync = setStateAsync.bind(this);
    generateInputField = generateInputField.bind(this);
    generateSelectField = generateSelectField.bind(this);
    generateRadiosField = generateRadiosField.bind(this);
    generatePasswordField = generatePasswordField.bind(this);
    checkInputRequiredValidity = checkInputRequiredValidity.bind(this);
    checkInputLengthValidity = checkInputLengthValidity.bind(this);
    checkInputRuleValidity = checkInputRuleValidity.bind(this);
    checkPasswordStrength = checkPasswordStrength.bind(this);
    checkIfOptionalEmpty = checkIfOptionalEmpty.bind(this);

    // STATE
    state = {
        valid: false,
        value: this.props.defaultValue || '',
        validate: this.props.validateform === 'true' ? true : false,
        errorText: '',
        showPassword: false
    }

    componentDidMount() {
        this.validateInput();
    }

    componentDidUpdate(prevProps) {
        const { validateform } = this.props;
        if (prevProps.validateform !== validateform) {
            this.setState({ validate: validateform === 'true' ? true : false });
        }
    }

    onBlur = event => {
        const { validate } = this.state;
        const { onBlur } = this.props;
        const e = { ...event };
        if (!validate) this.setState({ validate: true });
        onBlur && onBlur(e);
    }

    onFocus = event => {
        const { onFocus } = this.props;
        const e = { ...event };
        onFocus && onFocus(e);
    }

    /*
        SET NEW VALUE AND IMMIDIATELY VALIDATE IT USING NEW STATE
    */
    setNewValue = async event => {
        const { onBeforeChange, onAfterChange } = this.props;
        const e = { ...event };
        const target = e.target;
        let newValue = null;

        // RETRIEVE INPUT VALUE BASED ON ITS TYPE
        if (target.type === 'checkbox') newValue = target.checked;
        else newValue = target.value;

        onBeforeChange && await onBeforeChange(e);
        await this.setStateAsync({ value: newValue });
        await this.validateInput();
        onAfterChange && await onAfterChange(e);
    }

    validateInput = async () => {
        const { disabled, type } = this.props;
        let valid = true;

        // CHECK ALL VALIDITY CONDITIONS
        if (!disabled && !this.checkIfOptionalEmpty()) {
            valid = this.checkInputRequiredValidity();
            valid && (valid = this.checkInputLengthValidity());
            valid && (valid = this.checkInputRuleValidity());
        }

        if (type === 'password') this.checkPasswordStrength();

        valid && this.setState({ errorText: '' });
        await this.setStateAsync({ valid });
    }

    // CREATE INPUT FIELD BASED ON PASSED TYPE
    generateField = () => {
        const { type } = this.props;

        switch (type) {
            case 'select': return this.generateSelectField(this.commonInputProps());
            case 'password': return this.generatePasswordField(this.commonInputProps());
            case 'radio': return this.generateRadiosField(this.commonInputProps());
            case 'number': case 'checkbox': default: return this.generateInputField(this.commonInputProps());
        }
    }

    commonInputProps = () => {
        const { name, id, disabled, readOnly, type, inputClass, max, min } = this.props;

        return {
            id,
            name,
            disabled,
            readOnly,
            type,
            maxLength: max,
            minLength: min,
            className: 'rff-inputComponent__input' + (inputClass ? ' ' + inputClass : ''),
            onChange: this.setNewValue,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
        }
    }

    render() {
        const { children, title, type, labelClass, disabled, errorClass, id } = this.props;
        const { validate, valid, errorText } = this.state;

        if (children && children.length) {
            return (
                <div onChange={this.setNewValue} onBlur={this.onBlur} onFocus={this.onFocus}>
                    {children}
                    {validate && !valid && errorText && <p className={'rff-inputComponent__error' + (errorClass ? ' ' + errorClass : '')}>{errorText}</p>}
                </div>
            )
        } else {
            return (
                <label htmlFor={id} style={{ position: "relative" }} className={'rff-inputComponent' + (labelClass ? ' ' + labelClass : '') + (validate ? ((!disabled && valid) ? ' success' : ' error') : '') + (type ? ' rff-inputComponent--' + type : '')}>
                    {title && type !== 'checkbox' && <p className={'rff-inputComponent__title'}>{title}</p>}
                    {this.generateField()}
                    {title && type === 'checkbox' && <><span className='rff-inputComponent__custom-checkbox'></span><span className={'rff-inputComponent__title'}> {title}</span></>}
                    {validate && !valid && !disabled && errorText && <p className={'rff-inputComponent__error' + (errorClass ? ' ' + errorClass : '')}>{errorText}</p>}
                </label>
            )
        }
    }
}
