<template>
  <ul class="img-wrapper">
    <li class="li" v-for="item in state.imgArr" :key="item.src">
      <img :src="item.src"/>
    </li>

  </ul>
</template>

<script setup name="Pubuliu">
import Waterfall from '@/utils/waterfall'

const { proxy } = getCurrentInstance()

const state = reactive({
  imgArr: [
    { src: 'https://img2.baidu.com/it/u=3744833132,2436317021&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800' },
    { src: 'https://img1.baidu.com/it/u=3898423942,4076211846&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
    { src: 'https://img1.baidu.com/it/u=518241996,3736231705&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800' },
    { src: 'https://img2.baidu.com/it/u=3744833132,2436317021&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800' },
    { src: 'https://img2.baidu.com/it/u=1974924240,1112837054&fm=253&fmt=auto&app=138&f=JPEG?w=412&h=1000' },
    { src: 'https://img1.baidu.com/it/u=3649074522,1783976476&fm=253&fmt=auto&app=120&f=JPEG?w=1073&h=800' },
    { src: 'https://img0.baidu.com/it/u=2371981474,1441097367&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889' },
    { src: 'https://img2.baidu.com/it/u=476789844,431283725&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500' },
    { src: 'https://img1.baidu.com/it/u=1399988253,3237427503&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
    { src: 'https://img2.baidu.com/it/u=1974924240,1112837054&fm=253&fmt=auto&app=138&f=JPEG?w=412&h=1000' },
    { src: 'https://img1.baidu.com/it/u=3598755103,1414399167&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500' },
    { src: 'https://img0.baidu.com/it/u=386495707,3760583171&fm=253&fmt=auto&app=120&f=JPEG?w=640&h=1041' },

    { src: 'https://img1.baidu.com/it/u=3598755103,1414399167&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500' },
    { src: 'https://img0.baidu.com/it/u=2115480609,3908373657&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500' },
    { src: 'https://img0.baidu.com/it/u=3402039430,3079674364&fm=253&fmt=auto&app=138&f=PNG?w=500&h=436' },
    { src: 'https://img0.baidu.com/it/u=3402039430,3079674364&fm=253&fmt=auto&app=138&f=PNG?w=500&h=436' },
    { src: 'https://img0.baidu.com/it/u=3402039430,3079674364&fm=253&fmt=auto&app=138&f=PNG?w=500&h=436' },
    { src: 'https://img0.baidu.com/it/u=1505812118,4270139427&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=593' },
    { src: 'https://img1.baidu.com/it/u=3609094254,3525305531&fm=253&fmt=auto&app=120&f=JPEG?w=856&h=500' },
    { src: 'https://img2.baidu.com/it/u=1671780893,3250010100&fm=253&fmt=auto&app=138&f=JPEG?w=885&h=500' },
    { src: 'https://img2.baidu.com/it/u=1671780893,3250010100&fm=253&fmt=auto&app=138&f=JPEG?w=885&h=500' },
    { src: 'https://img1.baidu.com/it/u=2246292267,3043161175&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=900' },
    { src: 'https://img0.baidu.com/it/u=159437678,1754422573&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800' },
    { src: 'https://img1.baidu.com/it/u=1895646735,4088719651&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666' },
    { src: 'https://img1.baidu.com/it/u=756749608,300530122&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=754' },
    { src: 'https://img2.baidu.com/it/u=2702739843,4173448683&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=460' },
    { src: 'https://img2.baidu.com/it/u=2702739843,4173448683&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=460' },
    { src: 'https://img0.baidu.com/it/u=622160231,3691488277&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=711' },
    { src: 'https://img0.baidu.com/it/u=622160231,3691488277&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=711' },
    { src: 'https://img1.baidu.com/it/u=3557171717,3550057565&fm=253&fmt=auto&app=138&f=JPEG?w=950&h=475' },
    { src: 'https://img0.baidu.com/it/u=1668415580,2585772157&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=441' },
    { src: 'https://img2.baidu.com/it/u=239572217,4224508093&fm=253&fmt=auto&app=120&f=JPEG?w=751&h=500' },
    { src: 'https://img2.baidu.com/it/u=239572217,4224508093&fm=253&fmt=auto&app=120&f=JPEG?w=751&h=500' },
    { src: 'https://img2.baidu.com/it/u=239572217,4224508093&fm=253&fmt=auto&app=120&f=JPEG?w=751&h=500' },
    { src: 'https://img0.baidu.com/it/u=643580985,3962323161&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400' },
    { src: 'https://img1.baidu.com/it/u=3314677088,2128415789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313' },
    { src: 'https://img1.baidu.com/it/u=3314677088,2128415789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313' },
    { src: 'https://img1.baidu.com/it/u=3058290304,2672930459&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313' },
    { src: 'https://img0.baidu.com/it/u=2767316593,1174653555&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=850  ' },
    { src: 'https://img2.baidu.com/it/u=1490454792,1671084579&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=854' },
    { src: 'https://img2.baidu.com/it/u=163779587,1738005204&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313' },
    { src: 'https://img2.baidu.com/it/u=163779587,1738005204&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313' },
    { src: 'https://img2.baidu.com/it/u=1379410573,2169992759&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889' }
  ]
})
onMounted(()=>{
  function initSize() {
    console.log('onresize')
    new Waterfall({
      $el: document.querySelector(".img-wrapper"),
      count: 2,
      gap: 10
    })
  }

  initSize();
  window.onresize = initSize;
})
</script>

<style scoped lang="scss">
  .img-wrapper {
    counter-reset: count 0;

    .li {
      list-style: none;
      position: relative;
      /*width: calc(100% / 4);*/
      /*padding: 5px;*/
      box-sizing: border-box;

      &:after {
        counter-increment: count;
        content: counter(count);
        width: 2em;
        height: 2em;
        background-color: rgba(0, 0, 0, 0.9);
        color: #ffffff;
        line-height: 2em;
        text-align: center;
        position: absolute;
        font-size: 1em;
        z-index: 2;
        left: 0;
        top: 0;
      }

      img {
        width: 100%;
      }
    }
  }
</style>
