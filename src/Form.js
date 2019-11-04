import React from 'react';
import PropTypes from 'prop-types';
import CourseSelect from './CourseSelect';


class Form extends React.Component {
  static displayName = "08-field-component-form";

  state = {
    fields: {
      name: '',
      email: '',
      course: null,
      department: null
    },
    fieldErrors: {},
    people: [],
    _loading: false,
    _saveStatus: 'Ready'
  };

  componentDidMount() {
    this.setState({_loading: true});
    apiClient.loadPeople().then(people => {
      this.setState({loading: false, people: people});
    });
  }

  onFormSubmit = (evt) => {

    const person = this.state.fields;

    evt.preventDefault();

    if (this.validate()) return;

    const people = [...this.state.people, person];

    this.setState({_saveStatus: 'SAVING'});

    apiClient
      .savePeople(people)
      .then(() => {
        this.setState({
          people: people,
          fields: {
            name: '',
            email: '',
            course: null,
            department: null
          },
           _saveStatus: 'SUCCESS'
          })
      })
      .catch(error => {
        console.error(error);
        this.setState({state: 'ERROR'})
      })
    
  };

  onInputChange = ({ name, value, error }) => {
    
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    
    fields[name] = value;
    fieldErrors[name] = error;

    this.setState({ fields, fieldErrors, _saveStatus: 'READY' });
  };

  validate = () => {
    const person = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter((k) => {
      return fieldErrors[k];
    });
    
    
    if (!person.name || !person.email ||  errMessages.length || !person.course || !person.course) {
      return true;
    }


    return false;
  };

  render() {

    /*if (this.state._loading) {
      return <img alt='loading' src='/img/loading.gif' />;
    }*/
    
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>

          <Field
            placeholder='Name'
            name='name'
            value={this.state.fields.name}
            onChange={this.onInputChange}
            validate={(val) => (val ? false : 'Name Required')}
          />

          <br />

          <Field
            placeholder='Email'
            name='email'
            value={this.state.fields.email}
            onChange={this.onInputChange}
            validate={(val) => (val ? false : 'Invalid Email')}
          />

          <br />

          <CourseSelect
            department={this.state.fields.department}
            course={this.state.fields.course}
            onChange={this.onInputChange}
          />

          <br />

          {{
            SAVING: <input value='Saving...' type='submit' disabled />,
            SUCCESS: <input value='Saved!' type='submit' disabled />,
            ERROR: <input
              value='Save Failed - Retry?'
              type='submit'
              disabled={this.validate()}
            />,
            READY: <input
              value='Submit'
              type='submit'
              disabled={this.validate()}
            />,
          }[this.state._saveStatus]}

        </form>

        <div>
          <h3>People</h3>
          <ul>
            { this.state.people.map(({ name, email, department, course }, i) =>
              <li key={i}>{[ name, email, department, course ].join(' - ')}</li>
            ) }
          </ul>
        </div>
      </div>
    );
  }
};


class Field extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    validate: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    value: this.props.value,
    error: false,
  };

  componentWillReceiveProps(update) {
    
    this.setState({ value: update.value });
  }

  onChange = (evt) => {

    const name = this.props.name;
    const value = evt.target.value;
    const error = this.props.validate ? this.props.validate(value) : false;

    this.setState({ value, error });
    
    this.props.onChange({ name, value, error });
  };

  render() {
    return (
      <div>
        <input
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.onChange}
        />
        <span style={{ color: 'red' }}>{ this.state.error }</span>
      </div>
    );
  }
};

const apiClient = {
  loadPeople: function () {
    return {
      then: function (cb) {
        setTimeout(() => {
          cb(JSON.parse(localStorage.people || '[]'));
        }, 1000);
      },
    };
  },

  savePeople: function (people) {
    const success = !!(this.count++ % 2);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!success) return reject({ success });

        localStorage.people = JSON.stringify(people);
        return resolve({ success });
      }, 1000);
    });
  },

  count: 1,
};


export default Form;