<template>
  <ul class="ulClass">
    <li>{{ '全部' }} ({{ valueLength }})</li>
    <li
      v-for="(item, index) in value"
      :key="index"
      :draggable="item.draggable"
      class="drag-item"
      :class="{'insert-top-line': dropIndex === index, 'insert-bottom-line': dropIndex === valueLength && dropIndex === index + 1, 'not-draggable': !item.draggable}"
      @dragleave.stop.prevent="onDragLeave(index, item, $event)"
      @dragover.stop.prevent="onDragOver(index, item, $event)"
      @dragstart="onDragStart(index, item, $event)"
      @dragend.stop.prevent="onDragEnd(index, item, $event)">
      <slot :row="item" />
    </li>
  </ul>
</template>
<script>
export default {
  name: 'DragList',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      dropIndex: -1, // 投放位置的索引
      startIndex: -1 // 开始拖拽位置的索引
    }
  },
  computed: {
    valueLength() {
      return this.value.length;
    }
  },
  methods: {
    onDragStart(index, item, e) {
      this.startIndex = index;
    },
    onDragOver(index, item, e) {
      this.dropIndex = index;
      // 在第一个元素上禁止拖拽
      // 标记过不可移动的元素禁止禁止拖拽, 左固定的前一项没有禁止拖拽就还是可以拖拽
      if (index === 0 || !this.value[index].draggable && !(this.value[index - 1] && this.value[index - 1].draggable)) {
        this.dropIndex = this.startIndex;
      }
    },
    onDragLeave(index, item, e) {
        if (index === this.valueLength - 1) {
          // 在最后一个不可移动的元素上禁止拖拽
          if (!this.value[this.valueLength - 1].draggable) this.dropIndex = this.startIndex;
          else this.dropIndex = this.valueLength
        }
    },
    onDragEnd(index, item, e) {
        if (this.dropIndex !== index) {
          this.value.splice(this.dropIndex, 0, this.value[index]);
          this.value.splice(this.dropIndex > index ? index : index + 1, 1);
          this.changeIndex(index);
          this.$emit('dragEnd', this.value)
        }
        this.dropIndex = -1
    },
    changeIndex(index) {
      if (this.dropIndex > index) {
        const tempIndex = this.value[this.dropIndex - 1].index;
        for (let i = (this.dropIndex - 1); i > index; i--) {
            this.value[i].index = this.value[i - 1].index;
        }
        this.value[index].index = tempIndex;
      } else {
        const tempIndex = this.value[this.dropIndex].index;
        for (let i = this.dropIndex; i < index; i++) {
            this.value[i].index = this.value[i + 1].index;
        }
        this.value[index].index = tempIndex;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.drag-item {
  cursor: move;
}
.insert-top-line {
  border-top: 1px solid #1989FA !important;
}
.insert-bottom-line {       // 拖动到最后一条时样式
  border-bottom: 1px solid #1989FA !important;
}
.not-draggable {
  background-color: #f5f5f5;
  cursor: not-allowed;
  user-select:none;
}
// 拖拽列表
.ulClass {
  padding: 0;
  height: 465px;
  border-radius: 4px;
  li {
    display: flex;
    align-items: center;
    width: 307px;
    height: 48px;
    border: 1px solid #e7e7e7;
    border-top: none;
    color: #777;
    &:first-child {
      background-color: #f5f5f5;
      color: #222;
      font-size: 15px;
      border-top: 1px solid #e7e7e7;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
