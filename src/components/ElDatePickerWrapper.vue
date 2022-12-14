<template>
    <div class="date-wrapper">
        <el-date-picker
            ref="datePickerRef"
            v-model="dateValue"
            clearable
            @input.native="handleInput"
            @blur="handleBlur"
            format="dd/MM/yyyy"
            type="date"
        />
        <div v-if="showPlaceholder || !dateValue" class="placeholeder">{{ placeholeder }}</div>
    </div>
</template>
<script>
    export default {
        name: 'ElDatePickerWrapper',
        props: {
            value: '',
            // el-date-picker props
        },
        data() {
            return {
                placeholeder: 'dd/mm/yyyy',
                showPlaceholder: false
            }
        },
        computed: {
            dateValue: {
                get () {
                    return this.value
                },
                set (val) {
                    if (!val) {
                        this.placeholeder = 'dd/mm/yyyy'
                    }
                    this.$emit('input', val)
                }
            }
        },
        methods: {
            handleInput(e) {
                const value = e.target.value.replace(/\//g, '');
                const length  = value.length

                const d1 = value[0],
                      d2 = value[1],
                      m1 = value[2],
                      m2 = value[3],
                      y1 = value[4],
                      y2 = value[5],
                      y3 = value[6],
                      y4 = value[7];

                if (length === 1) {
                    if ([1, 2 ,3].indexOf(+value) === -1) {
                        e.target.value = ''
                        return
                    }
                }

                if (length === 2) {
                    switch(d1) {
                        case '0':
                            if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(d2) === -1) {
                                e.target.value = d1
                            }
                            break
                        case '1' || '2':
                            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(d2) === -1) {
                                e.target.value = d1
                            }
                            break;
                        case '3':
                            if (['0', '1'].indexOf(d2) === -1) {
                                e.target.value = d1
                            }
                            break
                    }
                }

                if (length === 3) {
                    if (['0', '1'].indexOf(m1) === -1) {
                        e.target.value = d1 + d2
                    }
                }

                const d1d2 = Number(d1 + d2)
                if (length === 4) {
                    if (m1 === '0') {
                        switch(d1d2) {
                            case 30:
                                if (['1', '3', '4', '5', '6', '7', '8', '9'].indexOf(m2) === -1) {
                                    e.target.value = d1 + d2 + m1
                                }
                                break;
                            case 31:
                                if (['1', '3', '5', '7', '8'].indexOf(m2) === -1) {
                                    e.target.value = d1 + d2 + m1
                                }
                                break;
                        }
                        if (d1d2 < 30) {
                            if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(m2) === -1) {
                                e.target.value = d1 + d2 + m1
                            }
                        }
                    } else { // m1 = 1
                        if (d1d2 === 31) {
                            if (['0', '2'].indexOf(m2) === -1) {
                                e.target.value = d1 + d2 + m1
                            }
                        } else if (d1d2 <= 30) {
                            if (['0', '1', '2'].indexOf(m2) === -1) {
                                e.target.value = d1 + d2 + m1
                            }
                        }
                    }
                }

                if (length === 5) {
                    if (['1', '2'].indexOf(y1) === -1) {
                        e.target.value = d1 + d2 + m1 + m2
                    }
                }

                if (length === 8) {
                    const year = Number(y1 + y2 + y3 + y4)
                    switch(d1d2) {
                        case 28: // 仅可输入平年
                            if (year % 4 === 0) {
                                e.target.value = d1 + d2 + m1 + m2 + y1 + y2 + y3
                            }
                            break;
                        case 29: // 仅可输入闰年
                            if (year % 4 !== 0) {
                                e.target.value = d1 + d2 + m1 + m2 + y1 + y2 + y3
                            }
                            break;
                    }
                }




                this.formatPlaceholder(e) // 处理placeholder
            },

            formatPlaceholder(e) {
                this.showPlaceholder = true
                const PLACEHOLDER_STR = 'dd/mm/yyyy'
                const value = e.target.value.replace(/\//g, '');
                const length = value.length;

                if (length === 8) {
                    this.$refs.datePickerRef.blur()
                    this.showPlaceholder = false
                }

                if (length > 8) {
                    e.target.value = this.placeholeder;
                    return
                }

                if (length <= 2) {
                    this.placeholeder = value + PLACEHOLDER_STR.slice(length)
                    e.target.value = value
                } else if (length > 2 && length < 5) {
                    this.placeholeder = value.slice(0, 2) + '/' + value.slice(2) + PLACEHOLDER_STR.slice(length + 1)
                    e.target.value = value.slice(0, 2) + '/' + value.slice(2)
                } else if (length >= 5) {
                    this.placeholeder = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4) + PLACEHOLDER_STR.slice(length + 2)
                    e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4)
                }
            },

            handleBlur() {
                this.showPlaceholder = false
                this.placeholeder = 'dd/mm/yyyy'
            }
        }
    }

    // el-date-picker 二次封装，空间优化
    // 1. 支持placeholder长存
    // 2. 支持日期输入判断，限制
</script>
<style scoped>
    .date-wrapper {
        position: relative;
    }

    .el-input {
        width: 220px;
        height: 34px;
        font-size: 12px;
        color: #222;
    }
    
    .placeholeder {
        position: absolute;
        left: 31px;
        bottom: 0px;
        height: 34px;
        line-height: 34px;
        pointer-events: none;
        opacity: .5;
        font-size: 12px;
    }
</style>

