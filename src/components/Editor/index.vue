<template>
  <div class="editor">
    <QuillEditor
      v-model:content="content"
      contentType="html"
      @textChange="(e) => $emit('update:modelValue', content)"
      :options="options"
      :style="styles"
    />
  </div>
</template>

<script setup>
import { uploadFile } from '@/api/common'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'
import ImageUploader from 'quill-image-uploader'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'

Quill.register('modules/ImageUploader', ImageUploader)
Quill.register('modules/blotFormatter', BlotFormatter)
// 自定义字体
const fontFamily = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial']
Quill.imports['attributors/style/font'].whitelist = fontFamily
Quill.register(Quill.imports['attributors/style/font'], true)
// 自定义字号
const sizes = [false, '16px', '18px', '20px', '22px', '26px', '28px', '32px']
Quill.imports['attributors/style/size'].whitelist = sizes
Quill.register(Quill.imports['attributors/style/size'], true)

const props = defineProps({
  /* 编辑器的内容 */
  modelValue: {
    type: String
  },
  /* 高度 */
  height: {
    type: Number,
    default: 500
  },
  /* 最小高度 */
  minHeight: {
    type: Number,
    default: 200
  },
  /* 只读 */
  readOnly: {
    type: Boolean,
    default: false
  }
})

const options = ref({
  theme: 'snow',
  bounds: document.body,
  debug: 'warn',
  modules: {
    // 工具栏配置
    toolbar: [
      [{ font: fontFamily }], // 字体
      [{ size: sizes }], // 字体大小
      ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ script: 'sub' }, { script: 'super' }], //
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      ['blockquote', 'code-block'], // 引用  代码块
      [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
      [{ indent: '-1' }, { indent: '+1' }], // 缩进
      [{ align: [] }], // 对齐方式
      ['link', 'image', 'video'], // 链接、图片、视频
      ['clean'] // 清除文本格式
    ],
    ImageUploader: {
      upload(file) {
        return new Promise((resolve, reject) => {
          if (file.size / 1024 / 1024 > 10) {
            ElMessage.error('文件大小不能超过10MB')
            reject()
            return false
          }
          let formData = new FormData()
          formData.append('file', file)
          try {
            uploadFile(formData).then((res) => {
              resolve(res.data.fileUrl)
            })
          } catch (e) {
            reject('Upload failed')
            console.log(e, 'ImageUploader')
          }
        })
      }
    },
    // 图片缩放
    blotFormatter: {}
  },
  placeholder: '请输入内容',
  readOnly: props.readOnly
})

const styles = computed(() => {
  let style = {}
  if (props.minHeight) {
    style.minHeight = `${props.minHeight}px`
  }
  if (props.height) {
    style.height = `${props.height}px`
  }
  return style
})

const content = ref('')
watch(
  () => props.modelValue,
  (v) => {
    if (v !== content.value) {
      content.value = (v ?? '') === '' ? '<p></p>' : v
      console.log(content.value, 'content.value1')
    }
  },
  { immediate: true }
)
</script>

<style>
.editor,
.ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
  content: '黑体';
  font-family: 'SimHei';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
  content: '微软雅黑';
  font-family: 'Microsoft YaHei';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
  content: '楷体';
  font-family: 'KaiTi';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
  content: '仿宋';
  font-family: 'FangSong';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
  content: 'Arial';
  font-family: 'Arial';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
  content: 'sans-serif';
  font-family: 'sans-serif';
}

.ql-font-SimSun {
  font-family: 'SimSun';
}

.ql-font-SimHei {
  font-family: 'SimHei';
}

.ql-font-Microsoft-YaHei {
  font-family: 'Microsoft YaHei';
}

.ql-font-KaiTi {
  font-family: 'KaiTi';
}

.ql-font-FangSong {
  font-family: 'FangSong';
}

.ql-font-Arial {
  font-family: 'Arial';
}

.ql-font-Times-New-Roman {
  font-family: 'Times New Roman';
}

.ql-font-sans-serif {
  font-family: 'sans-serif';
}

/* 字号设置 */
/* 默认字号 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
  content: '14px';
  font-size: 14px;
}

.ql-size-14px {
  font-size: 14px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
  content: '16px';
  font-size: 16px;
}

.ql-size-16px {
  font-size: 16px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='18px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before {
  content: '18px';
  font-size: 18px;
}

.ql-size-18px {
  font-size: 18px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
  content: '20px';
  font-size: 20px;
}

.ql-size-20px {
  font-size: 20px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='22px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='22px']::before {
  content: '22px';
  font-size: 22px;
}

.ql-size-22px {
  font-size: 22px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='26px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='26px']::before {
  content: '26px';
  font-size: 26px;
}

.ql-size-26px {
  font-size: 26px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='28px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='28px']::before {
  content: '28px';
  font-size: 28px;
}

.ql-size-28px {
  font-size: 28px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='32px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='32px']::before {
  content: '32px';
  font-size: 32px;
}

.ql-size-32px {
  font-size: 32px;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
</style>
