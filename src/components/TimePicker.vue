<template>
    <div class="zm-time-picker">
        <input
            ref="inputRef"
            id="zm-input-0208"
            type="text"
            class="input"
            :class="{ 'focus': isFocus, 'disabled': disabled }"
            readonly
            :placeholder="placeholder"
            :value="displayValue"
            :disabled="disabled"
            @input="$emit('input', $event.target.value)"
            @focus="handleFocus"
            @blur="handleBlur"
            @mouseenter="hanleMouseenter"
            @mouseleave="showCloseIcon = false">
        
        <!-- 输入框内前缀图标 -->
        <span
            slot="prefix"
            class="input-prefix">
            <i class="el-icon-time"></i>
        </span>

        <!-- 一键清空图标 -->
        <span
            v-if="clearable"
            @mouseenter="hanleMouseenter"
            @mouseleave="showCloseIcon = false"
            @click="hanldeCloseIconClick"
            slot="suffix"
            class="input-suffix">
            <i v-if="showCloseIcon" class="el-icon-circle-close"></i>
        </span>

        <!-- 选择面板 -->
        <div
            v-if="showPanel"
            @click="panelClick"
            id="zm-panel-0208"
            class="time-panel">
            <div class="time-panel-content">
                <!-- 小时列表 -->
                <ul
                    ref="housListRef"
                    @scroll.stop="bindHoursScroll"
                    class="time-spinner-list">
                    <li
                        @mousedown="choseHour(index, $event)"
                        class="time-spinner-list-item"
                        :class="{ 'active': index === hoursActiveIndex }"
                        v-for="(h, index) in getHoursList"
                        :key="index">
                        {{ h > 9 ? h : '0' + h }}
                    </li>
                </ul>

                <!-- 分钟列表 -->
                <ul
                    ref="minutesListRef"
                    @scroll.stop="bindMinutesScroll"
                    class="time-spinner-list">
                    <li
                        @mousedown="choseMinute(index, $event)"
                        class="time-spinner-list-item"
                        :class="{ 'active': index === minutesActiveIndex }"
                        v-for="(m, index) in getMinutesList"
                        :key="index">
                        {{ m > 9 ? m : '0' + m }}
                    </li>
                </ul>

                <!-- 当前选中范围标记 -->
                <div class="active-flag"></div>
            </div>

            <!-- 底部按钮 -->
            <div class="time-panel-footer">
                <div
                    @mousedown="cancelBtnClick"
                    class="cancel-btn">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TimePicker',
        props: {
            value: String | Number, // v-model 日期对象 | 时间戳
            placeholder: {
                type: String,
                default: ''
            },
            defaultValue: { // 默认显示时间
                default() {
                    return Date.now()
                }
            },
            minutesStep: { // 设置分钟跨度
               validator: function (value) {
                    return typeof value === 'number' && value > 0
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            document.addEventListener('click', this.hidePanel)
        },
        beforeDestroy() {
            document.removeEventListener('click', this.hidePanel)
        },
        data() {
            return {
                showCloseIcon: false,
                showPanel: false,
                timer: null,
                hoursActiveIndex: 0,
                minutesActiveIndex: 0,
                isFocus: false,
                oldVal: null // 记录value, 用于cancel还原
            }
        },
        computed: {
            valueIsEmpty() {
                const val = this.value
                if (val) {
                    return false
                }
                return true
            },
            // 输入框内展示的值
            displayValue() {
                const val = this.value
                if (val) {
                    const date = new Date(val)
                    let hours = date.getHours()
                    let minutes = date.getMinutes()

                    hours = hours > 9 ? hours : '0' + hours
                    minutes = minutes > 9 ? minutes : '0' + minutes

                    return hours + ':' + minutes
                }
                return ''
            },
            // 分钟列表
            getMinutesList() {
                const res = []
                for (let i = 0; i < 60; i ++ ) {
                    if (this.minutesStep ) {
                        if (i % this.minutesStep === 0) res.push(i)
                    } else {
                        res.push(i)
                    }
                }
                return res
            },
            // 小时列表
            getHoursList() {
                const res = []
                for (let i = 0; i < 24; i ++ ) {
                    res.push(i)
                }
                return res
            }
        },
        methods: {
            // 更新面板中时间所在位置
            updatePosition() {
                const hoursMenuEl = this.$refs.housListRef
                const minutesMenuEl = this.$refs.minutesListRef

                const value = this.value || this.defaultValue

                const date = new Date(value)

                const h = date.getHours()
                const m = date.getMinutes()

                this.hoursActiveIndex = this.getHoursList.indexOf(h)
                this.minutesActiveIndex = this.getMinutesList.indexOf(m)

                hoursMenuEl.scrollTo({
                    top: this.hoursActiveIndex * 32,
                })

                minutesMenuEl.scrollTo({
                    top: this.minutesActiveIndex * 32,
                })
            },
            // 隐藏面板
            hidePanel(e) {
                const id = e.target.id || ''
                const targetIdList = ['zm-input-0208', 'zm-panel-0208']

                if (targetIdList.indexOf(id) === -1) {
                    this.showPanel = false
                    this.isFocus = false
                }
            },
            panelClick(e) {
                e.stopPropagation() // 阻止冒泡 点击面板不消失
                this.$refs.inputRef.focus() // 点击面板时，input输入框默认失焦，手动聚焦，保证下一次点击触发input的blur事件
            },
            handleFocus(e) {
                this.showPanel = true
                this.isFocus = true

                // value为空，聚焦显示默认时间
                if (!this.value) {
                    this.$emit('input', this.defaultValue)
                }

                // 记录当前值
                this.oldVal = this.value

                this.$nextTick(() => {
                    this.updatePosition()
                })
            },
            handleBlur(e) {
                // this.showPanel = false
                this.isFocus = false

                // 值无变动，不触发事件
                if (this.value === this.oldVal) return

                this.$emit('change')
            },
            hanleMouseenter() {
                // 有值才显示一键清空icon
                if (!this.valueIsEmpty) {
                    this.showCloseIcon = true
                }
            },
            hanldeCloseIconClick() {
                this.showCloseIcon = false
                this.$emit('input', '')
            },
            // 选择小时
            choseHour(index, e) {
                const parent = e.target.parentElement

                // 滚动到中心点
                parent.scrollTo({
                    top: index * 32,
                    behavior: 'smooth'
                })

                const h = this.getHoursList[index]
                const date = new Date(this.value).setHours(h)
                this.$emit('input', date)
            },
            choseMinute(index, e) {
                const parent = e.target.parentElement
                parent.scrollTo({
                    top: index * 32,
                    behavior: 'smooth'
                })
                const m = this.getMinutesList[index]
                const date = new Date(this.value).setMinutes(m)
                this.$emit('input', date)
            },
            // 监听小时列表滚动
            bindHoursScroll(e) {
                this.bindScroll(e.target, 'hours')
            },
            // 监听分钟列表滚动
            bindMinutesScroll(e) {
                this.bindScroll(e.target, 'minutes')
            },
            bindScroll(el, type) {
                // 每一个li写死的高度为32px 判断（scrollTop/32）得到的 index 就是几个li的高度
                const scrollTop = el.scrollTop;
                const index = Math.round(scrollTop / 32)

                if (this.timer) {
                    clearTimeout(this.timer)
                }

                this.timer = setTimeout(() => {
                    el.scrollTo({
                        top: index * 32,
                        behavior: 'smooth'
                    })

                    if (type === 'hours') {
                        this.hoursActiveIndex = index

                        const h = this.getHoursList[index]
                        const date = new Date(this.value).setHours(h)
                        this.$emit('input', date)
                    }

                    if (type === 'minutes') {
                        this.minutesActiveIndex = index

                        const m = this.getMinutesList[index]
                        const date = new Date(this.value).setMinutes(m)
                        this.$emit('input', date)
                    }
                }, 200)
            },
            cancelBtnClick() {
                this.showPanel = false
                this.isFocus = false
                this.$emit('input', this.oldVal)
            }
        }
    }
</script>

<style lang="less" scoped>
.zm-time-picker {
    position: relative;
    display: inline-block;
    .input {
        box-sizing: border-box;
        width: 100%;
        height: 34px;
        padding: 0 30px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        color: #606266;
        font-weight: inherit;
        font-size: 14px;
        transition: border-color .2s;
        outline: none;
    }

    .input::placeholder {
        opacity: 0.5;
    }

    .input:hover {
        border-color: #C0C4CC;
    }

    .input:focus {
        border-color: #409EFF;
    }

    .focus {
        border-color: #409EFF;
    }

    .disabled {
        background: #f5f7fa;
        color: #C0C4CC;
        opacity: 1;
    }

    .input-prefix, .input-suffix {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #C0C4CC;
        height: 100%;
        width: 25px;
        font-size: 14px;
        // line-height: 34px;
        text-align: center;
    }

    .input-prefix {
        position: absolute;
        top: 0;
        left: 5px;
    }

    .input-suffix {
        position: absolute;
        top: 0;
        right: 5px;
        cursor: pointer;
    }

    .time-panel {
        position: absolute;
        top: 40px;
        width: 180px;
        border: 1px solid #e4e7ed;
        border-radius: 2px;
        box-shadow: 0 0 10px #ddd;
        user-select: none;
        background: #fff;
        z-index: 999;

        .time-panel-content {
            position: relative;
            display: flex;
            height: 180px;

            .active-flag {
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translate(-50%);
                height: 31px;
                width: 120px;
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                pointer-events: none;
            }

            .time-spinner-list {
                height: 100%;
                width: 50%;
                padding: 0;
                margin: 0;
                list-style: none;
                overflow-y: auto;

                .time-spinner-list-item {
                    height: 32px;
                    font-size: 12px;
                    color: #606266;
                    text-align: center;
                    font-weight: 400;
                    line-height: 32px;

                    &:hover {
                        background-color: #F5F7FA;
                    }

                    &.active {
                        color: #222222;
                        font-weight: bold;
                    }

                    &.active:hover {
                        background-color: #ffffff;
                    }
                }

                &::before {
                    content: '';
                    display: block;
                    height: 80px;
                }

                &::after {
                    content: '';
                    display: block;
                    height: 80px;
                }

                &::-webkit-scrollbar {
                    width: 6px;
                    opacity: 0;
                    background: #fff;
                }

                &::-webkit-scrollbar-thumb {
                    opacity: 0;
                }

                &:hover::-webkit-scrollbar {
                    opacity: 1;
                }

                &:hover::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 2px;
                    opacity: 1;
                }

            }
        }

        .time-panel-footer {
            box-sizing: border-box;
            border-top: 1px solid #e4e4e4;
            padding: 4px;
            height: 36px;
            line-height: 25px;
            text-align: right;
            font-size: 12px;
            color: #303133;
            font-weight: 400;

            .cancel-btn {
                padding: 0 5px;
                margin: 0 5px;
                cursor: pointer;
            }
        }
    }
}
</style>
