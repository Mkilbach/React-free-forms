# REACT FREE FORMS 🌊🔥🔥🔥
React component that will make your forms quick and simple

## Overview
React free forms is a React library that will help you implement form into your project easy and quick way. It has no DOM structure restrictions so you can create any form you like.

### Suppoted input types:
 - text
 - number
 - password
 - select
 - radio
 - checkbox
 - email
 - tel

## Instalation
TBA

## How to use

First you have to import `Form` and `Input` Components.
```
import { Form, Input } from 'react-free-forms'
```

In all cases `Form` component should be wrapping all `Input` components you would like to be validated together. Basic structure looks like this:
```
<Form>
    <Input />
</Form>
```

### `Form` component
Gathers all `Input` components and validates them by given rules. All props it can receive are optional.

| Prop Name                 | Prop Type     | Description               |
| ------------------------- | ------------- | ------------------------- |
| onSubmit                  | Function      | Triggers upon successfully validated form with a result as a first argument |
| onFailure                 | Function      | Triggers upon failed validation while submitting a form |
| onFocus                   | Function      | Triggers when any form input is focused |
| onBlur                    | Function      | Triggers when any form input is blurred |
| requiredErrorText         | String        | Passed as an error text for any required input that has no value |
| className                 | String        | Additional class for `<form>` tag rendered within this component
| id                        | String        | Additional id for `<form>` tag rendered within this component |
| disabled                  | Boolean       | Determines whether whole form should be disabled |
| recaptcha                 | String        | Receives ReCaptcha sitekey as its value. If present it will protect form submitting with ReCaptcha service and pass a ReCaptcha token in its result |
| recaptchaInfoRef          | Ref           | This element will have its content replaced with obligatory information about recaptcha protection |

### `Input` component
Renders `<input>` tag and decides about validation rules. Should be inserted inside `<Form></Form>` component.
Only two props are required, others are optional.

| Prop Name         | Prop Type     | Description               |
| ----------------- | ------------- | ------------------------- |
| required          | Boolean       | **Required** - tells whether input value is required |
| name              | String        | **Required** - it will be a key of that input value in result object |
| id                | String        | Custom id for `<input>` tag |
| type              | String        | [Supported types](#Suppoted-input-types) |
| rule              | String        | [Input Rules](#Input-rules) |
| inputOptions      | Array         | Triggers when any form input is focused |
| inputClass        | String        | Custom class for `<input>` tag |
| errorClass        | String        | Custom class for tag holding error |
| labelClass        | String        | Custom class for `<label>` tag |
| placeholder       | String        | Placeholder for input |
| max               | Number        | Maximum value length (only for string values) |
| min               | Number        | Minimum value length (only for string values) |
| readonly          | Boolean       | Readonly attribute |
| disabled          | Boolean       | Disable attribute |
| onBlur            | Function      | Triggers when input is focused blurred |
| onFocus           | Function      | Triggers when input is focused focused |
| onBeforeChange    | Function      | Triggers when input value is about to be changed |
| onAfterChange     | Function      | Triggers when input value has been changed |
| title             | String        | Title block value above the input |
| errorText         | String        | Custom error text when validation has failed |
| group             | String        | Assigns this input value into given group inside result object |
| minErrorText      | String        | Custom error text when value is too short |
| requirederrortext | String        | Custom error text for submitted required input with no value |
| customRegex       | String        | Custom regex for validating input value |
| defaultValue      | String/Number | Input initial value |

## Input rules
Rules define the way input should be validated. Most rules are self explanatory. For custom rule use `customRegex` prop.
 - text - any string
 - number - any number
 - select - any truhy
 - radio - any truhy
 - checkbox - checked
 - email
 - zip-code
 - phone
 - email
 - password - default password rule checks for:
    - a digit
    - a lowercase letter
    - an uppercase letter
    - at least 6 characters in total

## Examples

### Basic input example:
```
    <Form onSubmit={this.submitForm}>
        <Input name='text' required={true} />
    </Form>
```

Will render:

```
    <form>
        <label class="rff-inputComponent error" style="position: relative;">
            <input name="text" class="rff-inputComponent__input" value="">
            <p class="rff-inputComponent__error">input is required</p>
        </label>
    </form>
```

### Radio and Select:
These types requires `inputOptions` prop that receives an array ([or custom prop.children structure](#Custom-Input-children-structure-😻)).

```
    <Form onSubmit={this.submitForm}>
        <Input name='radio' required={true} type='radio' inputOptions={[['test1', 'value1'], 'test2']} />
    </Form>
```

Will render:
```
<form>
    <label class="rff-inputComponent rff-inputComponent--radio" style="position: relative;">
        <div value="">
            <label>
                <input name="radio" type="radio" class="rff-inputComponent__input" value="value1">
                <span>test1</span>
            </label>
            <label>
                <input name="radio" type="radio" class="rff-inputComponent__input" value="test2">
                <span>test2</span>
            </label>
        </div>
    </label>
</form>
```

## Custom Input children structure 😻
You are free to create your own structure inside Input component.
When using `Input` component as a wrapper you can include only one `<input>`/`<select>` tag inside (or one set of radio inputs)

```
<Form onSubmit={this.submitForm}>
    <Input required={true} name='select' defaultValue='test2'>
        <select defaultValue='test2'>
            <option value='test'>test</option>
            <option value='test2'>test2</option>
        </select>
    </Input>
    <Input required={false} name='text'>
        <p>Input can even be wrapped another div</p>
        <div>
            <input type="text" />
        </div>
    </Input>
    <button type='submit'>submit</button>
</Form>
```

