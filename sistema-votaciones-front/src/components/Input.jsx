import React from 'react';
import PropTypes from 'prop-types';

export const Input = ({
    field,
    label,
    value,
    onChangeHandler,
    type,
    showErrorMessage,
    validationMessage,
    onBlurHandler,
    textarea,
    maxLength = null,
    icon: Icon,
    disabled = false 
}) => {
    const handleValueChange = (e) => {
        onChangeHandler(e.target.value, field);
    };

    const handleOnBlur = (e) => {
        onBlurHandler(e.target.value, field);
    };

    return (
        <div className="input-wrapper" style={{ position: 'relative'}}>
            {label && (
                <div className="auth-form-label" style={{ marginBottom: '0'}}>
                    {label}
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative'}}>
                {Icon && (
                    <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', height: '100%' }}>
                        <Icon style={{ marginLeft: '10px', height: '68%', width: '24px' }} />
                    </div>
                )}
                {textarea ? (
                    <textarea
                        value={value}
                        onChange={handleValueChange}
                        onBlur={handleOnBlur}
                        rows={5}
                        style={{ paddingLeft: Icon ? '40px' : '10px', flex: 1, maxWidth: '400px'}}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={handleValueChange}
                        onBlur={handleOnBlur}
                        style={{ paddingLeft: Icon ? '40px' : '10px', flex: 1}}
                        maxLength={maxLength}
                        disabled={disabled}
                    />
                )}
            </div>
            <span className="auth-form-validation-message" style={{ color: 'red', fontSize: '10px'}}>
                {showErrorMessage && validationMessage}
            </span>
        </div>
    );
};

Input.propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    showErrorMessage: PropTypes.bool.isRequired,
    validationMessage: PropTypes.string,
    onBlurHandler: PropTypes.func.isRequired,
    textarea: PropTypes.bool,
    maxLength: PropTypes.number,
    icon: PropTypes.elementType,
    disabled: PropTypes.bool
};
