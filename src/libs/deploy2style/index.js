"use strict";

import { $ as Zepto, isNumberOfNaN, placeholderPic } from '../util'

import trim from '../../tools/string/trim'

const El = document.body || window

export default class Deploy2style {
  constructor (model, boxW = 300) {
    this.style = '';
    this.list = [];
    this.model = Deploy2style.basisFilter(model);
    this.modelW = this.model.width || 750;
    this.modelH = this.model.height || 750;
    this.multip = this.modelW / boxW;
    this.placeholderPic = placeholderPic();
  }

  static basis = ['x', 'y', 'w', 'h', 'color', 'z_index', 'font_size', 'line_height', 'text_align'];
  static _basis = ['x', 'y', 'width', 'height', 'color', 'zIndex', 'fontSize', 'lineHeight', 'textAlign'];

  static isPixel (t) {
    return /^-?.?\d{0,}.?\d+px$/ig.test(t);
  }

  static isPercentage (t) {
    return /^.?\d{0,}.?\d+%$/ig.test(t);
  }

  static toHump (str) {
    return str.replace(/(_|-)[a-z]{0,1}/, function (m) {
      return m.replace(/^(_|-)/, '').toUpperCase();
    });
  }

  static field2attr (str) {
    if (/(^[a-z]+)([A-Z]{1})([a-z]+$)/g.test(str)) {
      return str.replace(/(^[a-z]+)([A-Z]{1})([a-z]+$)/g, '$1-$2$3').toLowerCase();
    } else {
      return str
    }
  }

  static basisFilter (obj) {
    let o = {};
    for (let k in obj) {
      let val = obj[k];
      if (typeof val === 'string') {
        val = trim(val)
      }
      let i = Deploy2style.basis.indexOf(k);
      if (i > -1) {
        o[Deploy2style._basis[i]] = val;
      } else if (k === 'opacity') {
        val = parseFloat(val)
        if (isNaN(+val)) {
          val = 1
        }
        o[k] = val * 100;
      } else {
        let key = Deploy2style.toHump(k);
        o[key] = val;
      }
    }
    return o
  }

  static reverseBasis (obj) {
    let o = {};
    for (let k in obj) {
      let val = obj[k];
      if (typeof val === 'string') {
        val = trim(val)
      }
      let i = Deploy2style._basis.indexOf(k);
      if (i > -1) {
        o[Deploy2style.basis[i]] = val;
      } else if (k === 'opacity') {
        val = parseFloat(val)
        if (isNaN(+val)) {
          val = 100
        }
        o[k] = val / 100;
      } else {
        let key = Deploy2style.field2attr(k);
        o[key] = val;
      }
    }
    return o
  }

  static isBasis (str) {
    return Deploy2style._basis.indexOf(str) > -1
  }

  getPercentage (num, num2) {
    let n = `${parseFloat(num) / num2 * 100}%`
    console.log(n);
    return n
  }

  toStyleObj (basis = {}, customize = {}) {
    let data = {...Deploy2style.basisFilter(basis), ...Deploy2style.basisFilter(customize)};
    let multiple = this.multip;
    let placeholderPic = this.placeholderPic
    let str = ''
    let w = data.width
    let h = data.height
    for (let k in  data) {
      let val = data[k];
      if (['y', 'height'].indexOf(k) > -1) {
        data[k] = `${parseFloat(val) / this.modelH * 100}%`
      } else if (['x', 'width'].indexOf(k) > -1) {
        data[k] = `${parseFloat(val) / this.modelW * 100}%`
      } else if (Deploy2style.isPixel(val)) {
        data[k] = parseFloat(val) / multiple / placeholderPic + 'rem';
      }
    }
    if (data.rotate) {
      // data.height = `${parseFloat(w) / this.modelH * 100}%`;
      // data.width = `${parseFloat(h) / this.modelW * 100}%`;
      str += `rotate(${data.rotate}deg)`;
      delete data.rotate;
    }

    if (str) {
      data.transform = str;
    }
    data.top = data.y || 0;
    data.left = data.x || 0;
    delete data.x;
    delete data.y;
    if (data.backgroundColor) {
      // console.log(data, data.transform, placeholderPic, multiple);
    }
    return data;
  }
}
