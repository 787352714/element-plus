import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimePicker from '../src/time-picker'

const _mount = (template: string, data, otherObj?) => mount({
  components: {
    'el-time-picker': TimePicker,
  },
  template,
  data,
  ...otherObj,
}, {
  global: {
    provide: {
      elForm: {},
      elFormItem: {},
    },
  },
})


describe('TimePicker', () => {
  it('create', async () => {
    const wrapper = _mount(`<el-time-picker
    :placeholder="placeholder"
    :readonly="readonly"
  />`, () => ({ placeholder: 'test_',
      readonly: true }))
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('test_')
    // todo readonly
    // expect(input.attributes('readonly')).toBeTruthy()
  })

  it('set format && default value && set AM/PM spinner', async () => {
    const wrapper = _mount(`<el-time-picker
        :format="format"
        v-model="value"
      />`, () => ({ format: 'hh-mm:ss A',
      value: new Date(2016, 9, 10, 18, 40) }))

    const input = wrapper.find('input').element
    expect(input.value).toBe('06-40:00 PM') // format
    input.blur()
    input.focus()
    await nextTick()
    const list = wrapper.findAll('.el-time-spinner__list')
    const hoursEl = list[0]
    const items = hoursEl.element.querySelectorAll('.el-time-spinner__item')
    expect(items[0].textContent).toBe('12 AM') // am pm
    expect(items[1].textContent).toBe('01 AM')
    expect(items[12].textContent).toBe('12 PM')
    expect(items[15].textContent).toBe('03 PM')
    const times = wrapper.findAll('.active')
    expect(times[0].element.textContent).toBe('06 PM')
    expect(times[1].element.textContent).toBe('40') // default value
    expect(times[2].element.textContent).toBe('00')
  })

  it('select time', async () => {
    const wrapper = _mount(`<el-time-picker
        v-model="value"
      />`, () => ({ value: '' }))
    const input = wrapper.find('input').element
    input.blur()
    input.focus()
    await nextTick()
    const list = wrapper.element.querySelectorAll('.el-time-spinner__list')
    const hoursEl = list[0]
    const minutesEl = list[1]
    const secondsEl = list[2]
    const hourEl = hoursEl.querySelectorAll('.el-time-spinner__item')[4] as any
    const minuteEl = minutesEl.querySelectorAll('.el-time-spinner__item')[36]  as any
    const secondEl = secondsEl.querySelectorAll('.el-time-spinner__item')[20]  as any
    // click hour, minute, second one at a time.
    hourEl.click()
    await nextTick()
    minuteEl.click()
    await nextTick()
    secondEl.click()
    await nextTick()
    const vm = wrapper.vm as any
    const date = vm.value
    expect(hourEl.classList.contains('active')).toBeTruthy()
    expect(minuteEl.classList.contains('active')).toBeTruthy()
    expect(secondEl.classList.contains('active')).toBeTruthy()
    expect(date.getHours()).toBe(4)
    expect(date.getMinutes()).toBe(36)
    expect(date.getSeconds()).toBe(20)
  })

  it('click confirm / cancel button', async () => {
    const wrapper = _mount(`<el-time-picker
        v-model="value"
      />`, () => ({ value: '' }))
    const input = wrapper.find('input').element
    input.blur()
    input.focus()
    await nextTick();
    (wrapper.element.querySelector('.el-time-panel__btn.cancel') as any).click()
    const vm = wrapper.vm as any
    expect(vm.value).toBe('')
    input.blur()
    input.focus()
    await nextTick();
    (wrapper.element.querySelector('.el-time-panel__btn.confirm') as any).click()
    expect(vm.value instanceof Date).toBeTruthy()
  })

  it('set format', async () => {
    const wrapper = _mount(`<el-time-picker
        v-model="value"
        format='HH:mm'
      />`, () => ({ value: '' }))
    const input = wrapper.find('input').element
    input.blur()
    input.focus()
    await nextTick()
    const secondsDom = wrapper.element.querySelectorAll('.el-time-spinner__wrapper')[2] as any
    expect(secondsDom.style.display).toBe('none')
  })
})