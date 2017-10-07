import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

class GraphForm extends Component {
    render() {

        const { handleSubmit } = this.props;
        return (
            <form className="form-inline">
                <Field label="Frequency [Hz]" className="form-control" name="Frequency" component={renderComponent} type="number" />
                <Field label="Amplitude [V]" className="form-control" name="Amplitude" component={renderComponent} type="number" />
                <Field label="Phase shift [°]" className="form-control" name="PhaseShift" component={renderComponent} type="number" />
                <Field label="Unzoom" className="form-control" name="Scale" component={renderComponent} type="number" />
            </form>)
    }
}

function renderComponent({ input, label, type, meta: { touched, error, warning } }) {
    console.log(error)
    return (
        <div className={ error == null ? "form-group" : "form-group has-error"}>
            <label>{label}</label>
            <div>
                <input className="form-control" {...input} type={type}  />
                <span className="help-block">&nbsp;{error}</span>
            </div>
        </div>
    )
}


const validate = ({ Frequency, Amplitude, PhaseShift, Scale }) => {
    console.log(Frequency);
    const errors = {};
    if (Scale <= 0) errors.Scale = "Scale can not be that low.";
    if (Frequency <= 0) errors.Frequency = "Frequency can not be that low.";
    if (Amplitude <= 0) errors.Amplitude = "Amplitude can not be that low.";
    return errors;
}

export default reduxForm({ form: "simple", validate: validate, initialValues: { Frequency: 1, Amplitude: 1, PhaseShift: 0, Scale: 1 } })(connect()(GraphForm));