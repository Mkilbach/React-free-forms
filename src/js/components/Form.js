import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from './Input'
import FormRecaptcha from './FormRecaptcha'

import setStateAsync from '../functions/setStateAsync'

import '../../styles/styles.scss'

export default class Form extends Component {

    // PROP TYPES
    static propTypes = {
        onSubmit: PropTypes.func,
        onFailure: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        requiredErrorText: PropTypes.string,
        className: PropTypes.string,
        id: PropTypes.string,
        disabled: PropTypes.bool,
        recaptcha: PropTypes.string,
        recaptchaInfoRef: PropTypes.shape({ current: PropTypes.any })
    }

    // BINDING IMPORTED FUNCTIONS
    setStateAsync = setStateAsync.bind(this);

    // CREATING REF FOR RECAPTCHA COMPONENT
    recaptchaRef = React.createRef();

    // STATE
    state = {
        validateForm: false,
        inputRefs: [],
        children: this.props.children
    }

    async componentDidMount() {
        await this.setClonedChildren();
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.children !== this.props.children) {
            await this.setClonedChildren();
        }
    }

    handleSubmit = async e => {
        e.preventDefault();

        const { onSubmit, onFailure, recaptcha } = this.props;

        // TURN ON WHOLE FORM VALIDATION
        await this.setStateAsync({ validateForm: true });

        // DEEP SEARCH FOR CURRENT INPUTS
        await this.setClonedChildren();

        // FORM VALIDATION
        if (this.checkInputsValidity()) {
            if (recaptcha) this.runRecaptcha();
            else if (onSubmit) onSubmit(this.createResultObj());
        } else {
            onFailure && onFailure();
        }
    }

    createResultObj = (baseObj = {}) => {
        const { inputRefs } = this.state;
        const result = baseObj;

        inputRefs.forEach(el => {
            const { state, props } = el.current;

            if (!props.disabled && props.name && state.value) {
                // CREATE NEW KEY IN RESULT OBJ IF GROUP DOESN'T EXIST YET
                if (props.group && !result[props.group]) result[props.group] = {};
                // ASSIGN INPUT VALUE
                props.group ? result[props.group][props.name] = state.value : result[props.name] = state.value;
            }
        })

        return result
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    checkInputsValidity = () => {
        const { inputRefs } = this.state;
        let isFormValid = true;

        inputRefs && inputRefs.length && inputRefs.forEach(input => {
            if (input && input.current && input.current.state && !input.current.state.valid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    convertToArray = obj => {
        return Array.isArray(obj) ? obj : [obj];
    }

    runRecaptcha = () => {
        if (!this.recaptchaRef.current.getValue()) this.recaptchaRef.current.execute();
        else console.error('no recaptcha ref');
    }

    onRecaptchaResponse = code => {
        const { onSubmit } = this.props;
        if (onSubmit) {
            code && onSubmit(this.createResultObj({ recaptchaCode: code }));
            this.recaptchaRef.current.reset();
        }
    }

    // DEEP CLONE OF ALL COMPONENT CHILDREN TO ASSIGN A REF AND ADDITIONAL PROPS TO ALL INPUT COMPONENTS WITHIN
    cloneChildrenWithNewProps = async (children, additionalProps = null, key = '') => {
        const clonedChildren = [];
        let childNumber = 0;

        if (children) {
            children = this.convertToArray(children);

            for (const child of children) {
                if (React.isValidElement(child) && child.type === Input) {
                    const { inputRefs } = this.state;
                    const grandChildren = child.props && child.props.children ? child.props.children : null;

                    const newProps = { ...child.props, ...additionalProps };

                    // ASSIGN KEY TO A NEW CHILD
                    newProps.key = key ? `${key}-${childNumber}` : childNumber;

                    // CHECK IF CURRENT CHILD IS AN INPUT COMPONENT TO GIVE IT A REF
                    if (child.type === Input) {
                        const inputRef = React.createRef();
                        newProps.ref = inputRef;
                        await this.setStateAsync({ inputRefs: [...inputRefs, inputRef] });
                    }

                    // RECCURENCY FOR DEEP SEARCH
                    if (grandChildren) {
                        newProps.children = await this.cloneChildrenWithNewProps(grandChildren, additionalProps, newProps.key);
                    }

                    clonedChildren.push(React.cloneElement(child, newProps));
                } else {
                    clonedChildren.push(child);
                }

                childNumber++;
            };
        }

        return clonedChildren;
    }

    setClonedChildren = async () => {
        const { validateForm } = this.state;
        const { requiredErrorText, children } = this.props;
        await this.setStateAsync({ inputRefs: [] });
        this.setState({ children: await this.cloneChildrenWithNewProps(children, { validateform: validateForm.toString(), requirederrortext: requiredErrorText }) });
    }

    render() {
        const { id, className, recaptcha, onBlur, onFocus, recaptchaInfoRef } = this.props;

        return (
            <form onSubmit={this.handleSubmit} onBlur={onBlur} onFocus={onFocus} id={id} className={className} onKeyDown={this.handleKeyDown}>
                {this.state.children}
                {recaptcha
                    ? <FormRecaptcha
                        sitekey={recaptcha}
                        onResponse={this.onRecaptchaResponse}
                        recaptchaRef={this.recaptchaRef}
                        recaptchaInfoRef={recaptchaInfoRef} />
                    : null
                }
            </form>
        )
    }
}
