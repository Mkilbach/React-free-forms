import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ReCAPTCHA from "react-google-recaptcha";

export default class FormRecaptcha extends Component {
    static propTypes = {
        sitekey: PropTypes.string,
        recaptchaInfoRef: PropTypes.shape({ current: PropTypes.any })
    }

    componentDidMount() {
        const { recaptchaRef } = this.props;
        recaptchaRef.current.reset();
    }

    createExternalRecaptchaInfo = () => {
        if (this.props.recaptchaInfoRef && this.props.recaptchaInfoRef.current) {
            this.props.recaptchaInfoRef.current.innerHTML =
                `<p>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy"target="blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="blank">Terms of Service</a> apply.</p>`;
        }
    }

    render() {
        const { sitekey, recaptchaRef, onResponse } = this.props;

        return (
            <>
                <div style={{ display: 'none' }}>
                    <ReCAPTCHA
                        sitekey={sitekey}
                        onChange={onResponse}
                        size='invisible'
                        ref={recaptchaRef}
                    />
                </div>
                {this.props.recaptchaInfoRef === undefined
                    ? (
                        <p className="rff-recaptcha-info">
                            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target='blank'>Privacy Policy</a> and <a href="https://policies.google.com/terms" target='blank'>Terms of Service</a> apply.
                        </p>
                    ) : (
                        this.createExternalRecaptchaInfo()
                    )
                }
            </>
        )
    }
}
