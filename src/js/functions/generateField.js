import React from 'react'

import eye from '../../assets/eye.svg'

export function generateInputField(commonProps) {
    const { value } = this.state;
    const { placeholder } = this.props;

    return (
        <input
            {...commonProps}
            checked={value ? true : false}
            placeholder={placeholder}
            value={value || ''}
        />
    )
}

export function generateSelectField(commonProps) {
    const { value } = this.state;
    const { placeholder, inputOptions } = this.props;

    return (
        <select
            {...commonProps}
            value={value || ''}
        >
            <option readOnly hidden>{placeholder}</option>
            {Array.isArray(inputOptions) && inputOptions.map((el, i) => {
                const optionName = Array.isArray(el) ? el[0] : el;
                const optionValue = Array.isArray(el) ? el[1] : el;
                return <option key={i} value={optionValue}>{optionName}</option>
            })}
        </select>
    )
}

export function generateRadiosField(commonProps) {
    const { value } = this.state;
    const { id, inputOptions } = this.props;

    return (
        <div onChange={this.setNewValue} value={value}>
            {Array.isArray(inputOptions) && inputOptions.map((el, i) => {
                const optionName = Array.isArray(el) ? el[0] : el;
                const optionValue = Array.isArray(el) ? el[1] : el;
                return (
                    <label htmlFor={id && (id + '_' + i)} key={i}>
                        <input
                            {...commonProps}
                            id={id && (id + '_' + i)}
                            value={optionValue}
                            defaultChecked={value === optionValue}
                        />
                        <span>{optionName}</span>
                    </label>
                )
            })}
        </div>
    )
}

export function generatePasswordField(commonProps) {
    const { id, placeholder, customRegex, rule } = this.props;
    const { showPassword, passwordStrength } = this.state;

    return (
        <div style={{ position: 'relative' }}>
            <input
                {...commonProps}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
            />
            <img
                id={id + '_eye'}
                alt={'eye'}
                src={eye}
                className='rff-inputComponent__passwordIcon'
                style={{
                    maxHeight: '20px',
                    maxWidth: '30px',
                    position: 'absolute',
                    top: '50%',
                    right: '5px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                }}
                onClick={() => this.setState({ showPassword: !showPassword })}
            />
            {(customRegex || rule === 'password')
                ? (
                    < div
                        id={id + '_strength'}
                        style={{
                            position: 'absolute',
                            left: '0',
                            top: 'calc(100% - 1px)',
                            height: '4px',
                            width: passwordStrength + '%',
                            minWidth: '5%',
                            background: 'hsl(' + (String(1.1 * passwordStrength)) + ', 90%, 45%)',
                            transition: 'width .2s'
                        }}
                    ></div>
                )
                : null
            }

        </div >
    )
}