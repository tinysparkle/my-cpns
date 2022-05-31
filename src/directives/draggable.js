const draggable = {
  inserted: function (el) {
    el.style.cursor = 'move';
    el.style.position = 'absolute';
    el.onmousedown = function (e) {
      let disx = e.clientX - el.offsetLeft
      let disy = e.clientY - el.offsetTop
      document.onmousemove = function (e) {
        const clientX = e.clientX;
        const clientY = e.clientY;

        el.style.left = clientX - disx + 'px';
        el.style.top = clientY - disy + 'px';
      }
      
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    }
  },
}
export default draggable
