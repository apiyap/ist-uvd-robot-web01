class ImageEditor {
    /**
     * Canvas操作
     * @param {Object} opt 
     * @param {string} opt.imageSrc イメージのURL
     * @param {string} opt.canvasId canvasタグのid（デフォルト: image-for-edit)
     * @param {Number} opt.canvasSize canvasのサイズ(デフォルト: 128px)
     * @param {Number} opt.scaleStep 拡大縮小の倍率(デフォルト: 0.25)
     */
    constructor(opt = {}) {
      this.src = opt.imageSrc || 'https://ja.wikipedia.org/static/images/project-logos/jawiki.png';
      this.id = opt.canvasId || 'image-for-edit';
      this.size = opt.canvasSize || 128;
      this.scaleStep = opt.scaleStep || 0.25;
  
      this.scale = 1;
      this.dragInfo = {
        isDragging: false,
        startX: 0,
        startY: 0,
        diffX: 0,
        diffY: 0,
        canvasX: 0,
        canvasY: 0
      };
    }
  
    /**
     * canvasを挿入する
     * @param {HTMLElement} el canvasを挿入する親要素
     * @return {void}
     */
    insertTo(el) {
      const container = document.createElement('div');
      el.appendChild(container);
  
      // slider
      const zoomSlider = document.createElement('input');
      zoomSlider.type = 'range';
      zoomSlider.min = 0.01;
      zoomSlider.max = 2;
      zoomSlider.value = 1;
      zoomSlider.step = 'any';
      zoomSlider.addEventListener('input', this.zoom.bind(this));
      container.appendChild(zoomSlider);
  
      // canvas
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
  
      this.canvas.id = this.id;
      this.canvas.width = this.canvas.height = this.size;
  
      this.img = new Image();
      this.img.crossOrigin = 'anonymous'; // 「Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.」というエラーになるため
      this.img.src = this.src;
      this.img.onload = () => {
        this.ctx.drawImage(this.img, 0, 0);
      };
      this.img.onerror = e => {
        [...el.children].forEach(a => a.remove());
        alert('画像読み込み失敗');
      };
  
      // mouse event
      this.canvas.addEventListener('mousedown', this.dragStart.bind(this));
      this.canvas.addEventListener('mousemove', this.drag.bind(this));
      this.canvas.addEventListener('mouseup', this.dragEnd.bind(this));
  
      el.appendChild(this.canvas);
    }
  
    /**
     * 再描画する
     * @private
     * @return {void}
     */
    _redraw() {
      // canvasをクリア
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // リサイズ
      this.ctx.scale(this.scale, this.scale);
      // 再描画
      this.ctx.drawImage(this.img, this.dragInfo.diffX, this.dragInfo.diffY);
      // 変形マトリクスを元に戻す
      this.ctx.scale(1 / this.scale, 1 / this.scale);
    }
  
    /**
     * 拡大/縮小する
     * @param {Event} event イベント
     * @return {void}
     */
    zoom(event) {
      this.scale = event.target.value;
      this._redraw();
    }
  
    /**
     * 拡大（ズームイン）する
     * @return {void}
     */
    zoomIn() {
      this.scale += this.scaleStep;
      this._redraw();
    }
    /**
     * 縮小（ズームアウト）する
     * @return {void}
     */
    zoomOut() {
      this.scale -= this.scaleStep;
      this._redraw();
    }
  
    /**
     * ドラッグ開始
     * @param {MouseEvent} event マウスイベント
     * @return {void}
     */
    dragStart(event) {
      this.dragInfo.isDragging = true;
      this.dragInfo.startX = event.clientX;
      this.dragInfo.startY = event.clientY;
    }
    /**
     * ドラッグで画像を移動する
     * @param {MouseEvent} event マウスイベント
     * @return {void}
     */
    drag(event) {
      if (this.dragInfo.isDragging) {
        // 開始位置 + 差分 / スケール （画像の大きさによる移動距離の補正のためスケールで割る）
        this.dragInfo.diffX = this.dragInfo.canvasX + (event.clientX - this.dragInfo.startX) / this.scale;
        this.dragInfo.diffY = this.dragInfo.canvasY + (event.clientY - this.dragInfo.startY) / this.scale;
  
        this._redraw();
      }
    }
    /**
     * ドラッグ終了
     * @param {MouseEvent} event マウスイベント
     * @return {void}
     */
    dragEnd(event) {
      this.dragInfo.isDragging = false;
      // mousedown時のカクつきをなくすため
      this.dragInfo.canvasX = this.dragInfo.diffX;
      this.dragInfo.canvasY = this.dragInfo.diffY;
    }
  
    /**
     * canvasを出力する
     * @return {Canvas}
     */
    getCanvas() {
      return this.canvas;
    }
  
    /**
     * imgを出力する
     * @return {Image}
     */
    getImage() {
      const img = new Image();
      const data = this.canvas.toDataURL('image/png');
      img.src = data;
  
      return img;
    }
  }
  
  function createImageEditor() {
    const input = document.getElementById('image-url');
    const editImage = document.getElementById('edit-image');
  
    if (editImage.hasChildNodes()) {
      // clear
      [...editImage.children].forEach(a => a.remove());
    }
  
    const imageEditor = new ImageEditor({
      imageSrc: input.value,
      canvasSize: 128
    });
  
    imageEditor.insertTo(editImage);
  
    // イベントを上書きする
    document.getElementById('export').onclick = () => {
      document.getElementById('output-image').appendChild(imageEditor.getImage());
    };
  
  }
  
//   function main() {
//     document.getElementById('load').addEventListener('click', createImageEditor);
//   }
  
//   main();
  