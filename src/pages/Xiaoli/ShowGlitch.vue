<template>
  <div class="content demo-2" :class="containerClass">
    <div class="glitch">
      <div class="glitch__img" :style="style" v-for="n in 5" :key="n"></div>
    </div>
    <h2 class="content__title">小鲤基因，释放你的好奇心</h2>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
export default {
  name: 'First',
  data () {
    return {
      loadStatus: 0,
      containerClass: ''
    }
  },
  computed: {
    style () {
      var imgUrl = require('src/assets/img/xiaoli-bg.jpg')
      return {
        background: `url(${imgUrl})  no-repeat 50% 0`
      }
    }
  },
  watch: {
    loadStatus (val) {
      var clazz = val > 0 ? 'render ' : ' '
      this.containerClass = clazz + (val > 1 ? 'imgloaded' : 'loading')
    }
  },
  mounted () {
    this.loadStatus = 1
    var component = this
    imagesLoaded('.glitch__img', { background: true }, () => {
      component.loadStatus = 2
    })
  }
}
</script>

<style scoped>
  article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block;}audio,canvas,video{display:inline-block;}audio:not([controls]){display:none;height:0;}[hidden]{display:none;}html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}body{margin:0;}a:focus{outline:thin dotted;}a:active,a:hover{outline:0;}h1{font-size:2em;margin:0.67em 0;}abbr[title]{border-bottom:1px dotted;}b,strong{font-weight:bold;}dfn{font-style:italic;}hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0;}mark{background:#ff0;color:#000;}code,kbd,pre,samp{font-family:monospace,serif;font-size:1em;}pre{white-space:pre-wrap;}q{quotes:"\201C" "\201D" "\2018" "\2019";}small{font-size:80%;}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline;}sup{top:-0.5em;}sub{bottom:-0.25em;}img{border:0;}svg:not(:root){overflow:hidden;}figure{margin:0;}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em;}legend{border:0;padding:0;}button,input,select,textarea{font-family:inherit;font-size:100%;margin:0;}button,input{line-height:normal;}button,select{text-transform:none;}button,html input[type="button"],input[type="reset"],input[type="submit"]{-webkit-appearance:button;cursor:pointer;}button[disabled],html input[disabled]{cursor:default;}input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0;}input[type="search"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box;}input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none;}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}textarea{overflow:auto;vertical-align:top;}table{border-collapse:collapse;border-spacing:0;}
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  /*html {*/
  /*background: #1d2121;*/
  /*}*/

  /* Fade effect */
  body {
    transition: opacity 0.3s;
  }

  #container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    min-height: 100vh;
    color: #57585c;
    color: var(--color-text);
    background-color: #fff;
    background-color: var(--color-bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Fade effect */
  #container {
    opacity: 0;
    transition: opacity 0.3s;
  }

  #container.render {
    opacity: 1;
  }

  /* Page Loader */
  .loading::before {
    content: '';
    position: fixed;
    z-index: 100000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
  }

  .loading::after {
    content: '';
    position: fixed;
    z-index: 100000;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;
    pointer-events: none;
    border-radius: 50%;
    opacity: 0.4;
    background: var(--color-link);
    animation: loaderAnim 0.7s linear infinite alternate forwards;
  }

  @keyframes loaderAnim {
    to {
      opacity: 1;
      transform: scale3d(0.5,0.5,1);
    }
  }

  a {
    text-decoration: none;
    color: var(--color-link);
    outline: none;
  }

  a:hover,
  a:focus {
    color: var(--color-link-hover);
    outline: none;
  }

  main {
    position: relative;
    width: 100%;
  }

  .content {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    min-height: 100vh;
  }

  .content--fixed a {
    pointer-events: auto;
  }

  .demo span {
    white-space: nowrap;
    pointer-events: none;
  }

  @media screen and (max-width: 55em) {
    .content {
      flex-direction: column;
      height: auto;
      min-height: 0;
    }
  }

  .demo-2 {
    --color-text: #aaa;
    --color-bg: #000;
    --color-link: #1c1cc9;
    --color-link-hover: #aaa;
    --color-info: #1c1cc9;
    --glitch-width: 100%;
    --glitch-height: 100%;
    --gap-horizontal: 10px;
    --gap-vertical: 5px;
    --color-title: #fff;
    --time-anim: 4s;
    --delay-anim: 2s;
    --blend-mode-1: none;
    --blend-mode-2: none;
    --blend-mode-3: none;
    --blend-mode-4: overlay;
    --blend-mode-5: overlay;
    --blend-color-1: transparent;
    --blend-color-2: transparent;
    --blend-color-3: transparent;
    --blend-color-4: #fb909a;
    --blend-color-5: #1c1cc9;
  }

  .content__title {
    font-size: 5vw;
    margin: 35vh 0 0 0;
    position: relative;
    font-family: 'Bungee', cursive;
    color: var(--color-title);
    animation-name: glitch-anim-text;
    animation-duration: var(--time-anim);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-delay: calc(var(--delay-anim) + var(--time-anim) * 0.2);
  }

  /* Glitch styles */
  .glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--glitch-width);
    height: var(--glitch-height);
    overflow: hidden;
  }

  .glitch__img {
    position: absolute;
    top: calc(-1 * var(--gap-vertical));
    left: calc(-1 * var(--gap-horizontal));
    width: calc(100% + var(--gap-horizontal) * 2);
    height: calc(100% + var(--gap-vertical) * 2);
    /*background: url(/static/img/xiaoli-bg.jpg) no-repeat 50% 0;*/
    background-color: var(--blend-color-1);
    background-size: cover;
    transform: translate3d(0,0,0);
    background-blend-mode: var(--blend-mode-1);
  }

  .glitch__img:nth-child(n+2) {
    opacity: 0;
  }

  .imgloaded .glitch__img:nth-child(n+2) {
    animation-duration: var(--time-anim);
    animation-delay: var(--delay-anim);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .imgloaded .glitch__img:nth-child(2) {
    background-color: var(--blend-color-2);
    background-blend-mode: var(--blend-mode-2);
    animation-name: glitch-anim-1;
  }

  .imgloaded .glitch__img:nth-child(3) {
    background-color: var(--blend-color-3);
    background-blend-mode: var(--blend-mode-3);
    animation-name: glitch-anim-2;
  }

  .imgloaded .glitch__img:nth-child(4) {
    background-color: var(--blend-color-4);
    background-blend-mode: var(--blend-mode-4);
    animation-name: glitch-anim-3;
  }

  .imgloaded .glitch__img:nth-child(5) {
    background-color: var(--blend-color-5);
    background-blend-mode: var(--blend-mode-5);
    animation-name: glitch-anim-flash;
  }

  /* Animations */

  @keyframes glitch-anim-1 {
    0% {
      opacity: 1;
      transform: translate3d(var(--gap-horizontal),0,0);
      -webkit-clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
      clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    }
    2% {
      -webkit-clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
      clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    }
    4% {
      -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
      clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    }
    6% {
      -webkit-clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
      clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    }
    8% {
      -webkit-clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
      clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    }
    10% {
      -webkit-clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
      clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    }
    12% {
      -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
      clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    }
    14% {
      -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
      clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    }
    16% {
      -webkit-clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
      clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    }
    18% {
      -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
      clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    }
    20% {
      -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
      clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
    }
    21.9% {
      opacity: 1;
      transform: translate3d(var(--gap-horizontal),0,0);
    }
    22%, 100% {
      opacity: 0;
      transform: translate3d(0,0,0);
      -webkit-clip-path: polygon(0 0, 0 0, 0 0, 0 0);
      clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    }
  }

  @keyframes glitch-anim-2 {
    0% {
      opacity: 1;
      transform: translate3d(calc(-1 * var(--gap-horizontal)),0,0);
      -webkit-clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%);
      clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%);
    }
    3% {
      -webkit-clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%);
      clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%);
    }
    5% {
      -webkit-clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%);
      clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%);
    }
    7% {
      -webkit-clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%);
      clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%);
    }
    9% {
      -webkit-clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%);
      clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%);
    }
    11% {
      -webkit-clip-path: polygon(0 52%, 100% 52%, 100% 59%, 0 59%);
      clip-path: polygon(0 52%, 100% 52%, 100% 59%, 0 59%);
    }
    13% {
      -webkit-clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%);
      clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%);
    }
    15% {
      -webkit-clip-path: polygon(0 75%, 100% 75%, 100% 75%, 0 75%);
      clip-path: polygon(0 75%, 100% 75%, 100% 75%, 0 75%);
    }
    17% {
      -webkit-clip-path: polygon(0 65%, 100% 65%, 100% 40%, 0 40%);
      clip-path: polygon(0 65%, 100% 65%, 100% 40%, 0 40%);
    }
    19% {
      -webkit-clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%);
      clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%);
    }
    20% {
      -webkit-clip-path: polygon(0 14%, 100% 14%, 100% 33%, 0 33%);
      clip-path: polygon(0 14%, 100% 14%, 100% 33%, 0 33%);
    }
    21.9% {
      opacity: 1;
      transform: translate3d(calc(-1 * var(--gap-horizontal)),0,0);
    }
    22%, 100% {
      opacity: 0;
      transform: translate3d(0,0,0);
      -webkit-clip-path: polygon(0 0, 0 0, 0 0, 0 0);
      clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    }
  }

  @keyframes glitch-anim-3 {
    0% {
      opacity: 1;
      transform: translate3d(0, calc(-1 * var(--gap-vertical)), 0) scale3d(-1,-1,1);
      -webkit-clip-path: polygon(0 1%, 100% 1%, 100% 3%, 0 3%);
      clip-path: polygon(0 1%, 100% 1%, 100% 3%, 0 3%);
    }
    1.5% {
      -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 9%, 0 9%);
      clip-path: polygon(0 10%, 100% 10%, 100% 9%, 0 9%);
    }
    2% {
      -webkit-clip-path: polygon(0 5%, 100% 5%, 100% 6%, 0 6%);
      clip-path: polygon(0 5%, 100% 5%, 100% 6%, 0 6%);
    }
    2.5% {
      -webkit-clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%);
      clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%);
    }
    3% {
      -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 10%, 0 10%);
      clip-path: polygon(0 10%, 100% 10%, 100% 10%, 0 10%);
    }
    5% {
      -webkit-clip-path: polygon(0 30%, 100% 30%, 100% 25%, 0 25%);
      clip-path: polygon(0 30%, 100% 30%, 100% 25%, 0 25%);
    }
    5.5% {
      -webkit-clip-path: polygon(0 15%, 100% 15%, 100% 16%, 0 16%);
      clip-path: polygon(0 15%, 100% 15%, 100% 16%, 0 16%);
    }
    7% {
      -webkit-clip-path: polygon(0 40%, 100% 40%, 100% 39%, 0 39%);
      clip-path: polygon(0 40%, 100% 40%, 100% 39%, 0 39%);
    }
    8% {
      -webkit-clip-path: polygon(0 20%, 100% 20%, 100% 21%, 0 21%);
      clip-path: polygon(0 20%, 100% 20%, 100% 21%, 0 21%);
    }
    9% {
      -webkit-clip-path: polygon(0 60%, 100% 60%, 100% 55%, 0 55%);
      clip-path: polygon(0 60%, 100% 60%, 100% 55%, 0 55%);
    }
    10.5% {
      -webkit-clip-path: polygon(0 30%, 100% 30%, 100% 31%, 0 31%);
      clip-path: polygon(0 30%, 100% 30%, 100% 31%, 0 31%);
    }
    11% {
      -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 69%, 0 69%);
      clip-path: polygon(0 70%, 100% 70%, 100% 69%, 0 69%);
    }
    13% {
      -webkit-clip-path: polygon(0 40%, 100% 40%, 100% 41%, 0 41%);
      clip-path: polygon(0 40%, 100% 40%, 100% 41%, 0 41%);
    }
    14% {
      -webkit-clip-path: polygon(0 80%, 100% 80%, 100% 75%, 0 75%);
      clip-path: polygon(0 80%, 100% 80%, 100% 75%, 0 75%);
    }
    14.5% {
      -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 51%, 0 51%);
      clip-path: polygon(0 50%, 100% 50%, 100% 51%, 0 51%);
    }
    15% {
      -webkit-clip-path: polygon(0 90%, 100% 90%, 100% 90%, 0 90%);
      clip-path: polygon(0 90%, 100% 90%, 100% 90%, 0 90%);
    }
    16% {
      -webkit-clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%);
      clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%);
    }
    18% {
      -webkit-clip-path: polygon(0 100%, 100% 100%, 100% 99%, 0 99%);
      clip-path: polygon(0 100%, 100% 100%, 100% 99%, 0 99%);
    }
    20% {
      -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 71%, 0 71%);
      clip-path: polygon(0 70%, 100% 70%, 100% 71%, 0 71%);
    }
    21.9% {
      opacity: 1;
      transform: translate3d(0, calc(-1 * var(--gap-vertical)), 0) scale3d(-1,-1,1);
    }
    22%, 100% {
      opacity: 0;
      transform: translate3d(0,0,0);
      -webkit-clip-path: polygon(0 0, 0 0, 0 0, 0 0);
      clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    }
  }

  @keyframes glitch-anim-text {
    0% {
      transform: translate3d(calc(-1 * var(--gap-horizontal)),0,0) scale3d(-1,-1,1);
      -webkit-clip-path: polygon(0 20%, 100% 20%, 100% 21%, 0 21%);
      clip-path: polygon(0 20%, 100% 20%, 100% 21%, 0 21%);
    }
    2% {
      -webkit-clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
      clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    }
    4% {
      -webkit-clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
      clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    }
    5% {
      -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
      clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    }
    6% {
      -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
      clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    }
    7% {
      -webkit-clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
      clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    }
    8% {
      -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
      clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    }
    9% {
      -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
      clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
    }
    9.9% {
      transform: translate3d(calc(-1 * var(--gap-horizontal)),0,0) scale3d(-1,-1,1);
    }
    10%, 100% {
      transform: translate3d(0,0,0) scale3d(1,1,1);
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    }
  }

  /* Flash */
  @keyframes glitch-anim-flash {
    0%, 5% {
      opacity: 0.2;
      transform: translate3d(var(--gap-horizontal), var(--gap-vertical), 0);
    }
    5.5%, 100% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }
  }
</style>
