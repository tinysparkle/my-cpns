<template>
  <div class="slider-3d">
      <div
          v-for="(item, index) in sliders"
          :key="index"
          :class="item.className">
          <img
              @mouseleave="mouseleave"
              @mouseenter="mouseenter"
              :src="item.img"
              alt="">
      </div>
  </div>
</template>

<script>

export default {
  name: 'Slider3D',
  data() {
    return {
      sliders: [
        {
          className: 'slider-item first',
          img: require('@/assets/img/1.png')
        },
        {
          className: 'slider-item second left',
          img: require('@/assets/img/2.png')
        },
        {
          className: 'slider-item second right',
          img: require('@/assets/img/3.png')
        }
      ],
      timer: null
    }
  },
  mounted() {
    this.initSlider();
  },
  methods: {
    initSlider() {
        this.render()
    },
    render() {
      const classNames = this.sliders.map(item => item.className);

      this.timer = setInterval(() => {
          classNames.unshift(classNames.pop())
          this.sliders.forEach((item, index) => {
              item.className = classNames[index]
          })
      }, 1000);
    },
    mouseenter(e) {
        clearInterval(this.timer)
    },
    mouseleave(e) {
        this.render()
    }
  }
}
</script>

<style lang="less" scoped>
.slider-3d {
  position: relative;
  height: 100vh;
  .slider-item {
    position: absolute;
    width: 500px;
    height: 300px;
    box-shadow: 10px 20px 10px #333;
    transition: all 0.6s ease;
    &:hover {
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 100%;
    }
    &.first {
      z-index: 3;
      left: 200px;
      opacity: 1;
    }
    &.second {
      z-index: 2;
      &.left {
        transform: scale(0.6);
        left: 0px;
        opacity: 0.5;
      }
      &.right {
        transform: scale(0.6);
        left: 400px;
        opacity: 0.5;
      }
    }
  }
}
</style>