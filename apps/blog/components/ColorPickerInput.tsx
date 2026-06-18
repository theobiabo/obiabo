import {useCallback, type InputHTMLAttributes} from 'react'
import {set, unset, type StringInputProps} from 'sanity'

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i

export function ColorPickerInput(props: StringInputProps) {
  const {elementProps, onChange, value} = props
  const pickerValue = HEX_COLOR_RE.test(value ?? '') ? value : '#000000'
  const {value: _value, onChange: _onChange, style: _style, ...inputProps} =
    elementProps as InputHTMLAttributes<HTMLInputElement>

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange],
  )

  return (
    <div className="color-picker-input">
      <input
        aria-label={`${elementProps.id} picker`}
        className="color-picker-input__swatch"
        disabled={elementProps.readOnly}
        type="color"
        value={pickerValue}
        onChange={(event) => handleChange(event.currentTarget.value)}
      />
      <input
        {...inputProps}
        className="color-picker-input__text"
        type="text"
        value={value ?? ''}
        placeholder="#c8ccda"
        onChange={(event) => handleChange(event.currentTarget.value)}
      />
      <style>{`
        .color-picker-input {
          align-items: center;
          display: flex;
          gap: 10px;
        }

        .color-picker-input__swatch {
          background: transparent;
          border: 0;
          height: 38px;
          padding: 0;
          width: 48px;
        }

        .color-picker-input__text {
          background: var(--card-bg-color);
          border: 1px solid var(--card-border-color);
          border-radius: 3px;
          color: inherit;
          flex: 1;
          font: inherit;
          min-height: 38px;
          padding: 0 10px;
        }
      `}</style>
    </div>
  )
}
