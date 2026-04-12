<script setup lang="ts">
import { ref } from 'vue'
import crypto from './crypto.js'
import Modal from './a-modal.vue'
import Lazyload from './a-lazyload.vue'
import Placeholder from './a-placeholder.vue'
import { base64ToFile, getSecret } from './util.js'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  dir: {
    type: String,
    default: 'public',
  },
  hide: {
    type: Boolean,
    default: false,
  },
})

const isLocal = location.hostname === 'localhost'

const baseUrl = (localSuffix = 'docs/assets/') => {
  const repo_name = (window as any).__img_repo_name__ || 'img'
  if (isLocal) {
    return `http://localhost:3000/packages/${repo_name}/${localSuffix}`
  }
  return `/${repo_name}/assets/`
}

const img = ref<HTMLImageElement | null>(null)
const src = ref<string | undefined>(undefined)
const srcMin = ref<string | undefined>(undefined)
const scale = ref<number | undefined>(undefined)
const secretKey = ref<string | null>(getSecret())
const loading = ref(false)
const visible = ref(!props.dir.includes('privacy') || !!secretKey.value)

const onLoad = () => {
  load('min', 'srcMin')
}

const onImageLoad = (e: Event) => {
  img.value = e.target as HTMLImageElement
  scaleIn()
}

const onImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  const srcPath = target.getAttribute('src')?.split('/').slice(-1).join('')
  console.warn(`${srcPath} load error.`)
}

const scaleIn = () => {
  if (img.value) {
    scale.value = window.innerHeight / img.value.offsetHeight
  }
}

const scaleOut = () => {
  scale.value = 0
}

const loadHD = () => {
  load('', 'src')
}

const load = (suffer = '', t: 'src' | 'srcMin' = 'src') => {
  const error = (message: string) => {
    console.warn(message)
  }

  const request = (url: string) => {
    loading.value = true
    return fetch(baseUrl() + url, { mode: 'cors' })
      .then((res) => {
        if (res.status === 200) return res.blob()
        error(`${res.url.split('/').slice(-1)} ${res.statusText.toLowerCase()}.`)
        return Promise.reject()
      })
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = function () {
              const result = reader.result as string
              const secret = result.split('datatext/plainbase64')[1]
              resolve(secret)
            }
            reader.readAsDataURL(blob)
          })
      )
      .then((content) => {
        const base64 = crypto(content, secretKey.value || '', 'decrypt')
        const blobUrl = URL.createObjectURL(base64ToFile(base64))
        if (t === 'src') {
          src.value = blobUrl
        } else {
          srcMin.value = blobUrl
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (props.dir === 'privacy') {
    if (secretKey.value) {
      const name = suffer ? [props.name.split('.')[0], suffer, 'webp'].join('.') : props.name
      request('privacy/' + name).finally(() => {
        if (isLocal && !src.value && !srcMin.value) {
          if (t === 'src') {
            src.value = baseUrl('src/') + 'privacy/' + props.name
          } else {
            srcMin.value = baseUrl('src/') + 'privacy/' + props.name
          }
          error(`${name} asset load fail, use source instead.`)
        }
      })
    }
  } else if (props.dir === 'privacy-gif') {
    if (secretKey.value) {
      const name = suffer
        ? [props.name.split('.')[0], suffer ? suffer + '.g1f' : 'gif'].join('.')
        : props.name
      request('privacy/' + name).finally(() => {
        if (isLocal && !src.value && !srcMin.value) {
          if (t === 'src') {
            src.value = baseUrl('src/') + 'privacy/' + props.name
          } else {
            srcMin.value = baseUrl('src/') + 'privacy/' + props.name
          }
          error(`${name} asset load fail, use source instead.`)
        }
      })
    }
  } else if (props.dir === 'animation') {
    const imgUrl = baseUrl() + 'animation/' + [props.name, suffer, 'gif'].filter((_) => _).join('.')
    if (t === 'src') {
      src.value = imgUrl
    } else {
      srcMin.value = imgUrl
    }
  } else if (props.dir === 'origin') {
    srcMin.value = baseUrl() + props.name
    src.value = srcMin.value
  } else {
    const imgUrl = baseUrl() + 'public/' + [props.name, suffer, 'webp'].filter((_) => _).join('.')
    if (t === 'src') {
      src.value = imgUrl
    } else {
      srcMin.value = imgUrl
    }
  }
}
</script>

<template>
  <Lazyload @load="onLoad" aria-hidden="true">
    <Placeholder v-if="visible && (!src && !srcMin)" />
    <Modal v-if="!loading || (src || srcMin)" :scale="scale">
      <template #action>
        <div>
          <div class="a-img-left-action">
            <button 
              v-if="!src" 
              @click="loadHD" 
              :disabled="loading"
              style="padding:4px 5px; background: transparent; border: none; cursor: pointer;"
            >
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M128 128h768a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m192 352V384H256v256h64v-96h85.333333V640H469.333333V384H405.333333v96h-85.333333z m298.666667-32H682.666667a21.333333 21.333333 0 0 1 21.333333 21.333333v85.333334a21.333333 21.333333 0 0 1-21.333333 21.333333h-64v-128zM554.666667 384v256h128a85.333333 85.333333 0 0 0 85.333333-85.333333v-85.333334a85.333333 85.333333 0 0 0-85.333333-85.333333h-128z" fill="#fff"></path></svg>
            </button>
          </div>
          <div class="a-img-right-action">
            <button 
              @click="scaleIn"
              style="padding:4px 5px; background: transparent; border: none; cursor: pointer;"
            >
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M149.333333 394.666667c17.066667 0 32-14.933333 32-32v-136.533334l187.733334 187.733334c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-187.733333-187.733334H362.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-4.266667 0-8.533333 0-10.666666 2.133334-8.533333 4.266667-14.933333 10.666667-19.2 17.066666-2.133333 4.266667-2.133333 8.533333-2.133334 12.8v213.333334c0 17.066667 14.933333 32 32 32zM874.666667 629.333333c-17.066667 0-32 14.933333-32 32v136.533334L642.133333 597.333333c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l200.533334 200.533334H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333334c4.266667 0 8.533333 0 10.666666-2.133334 8.533333-4.266667 14.933333-8.533333 17.066667-17.066666 2.133333-4.266667 2.133333-8.533333 2.133333-10.666667V661.333333c2.133333-17.066667-12.8-32-29.866666-32zM381.866667 595.2l-200.533334 200.533333V661.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333334c0 4.266667 0 8.533333 2.133334 10.666666 4.266667 8.533333 8.533333 14.933333 17.066666 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333l200.533333-200.533333c12.8-12.8 12.8-32 0-44.8s-29.866667-10.666667-42.666666 0zM904.533333 138.666667c0-2.133333 0-2.133333 0 0-4.266667-8.533333-10.666667-14.933333-17.066666-17.066667-4.266667-2.133333-8.533333-2.133333-10.666667-2.133333H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533334l-187.733334 187.733333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l187.733333-187.733333V362.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c-2.133333-4.266667-2.133333-8.533333-4.266667-10.666666z" fill="#fff"></path></svg>
            </button>
            <button 
              @click="scaleOut"
              style="padding:4px 5px; background: transparent; border: none; cursor: pointer;"
            >
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M313.6 358.4H177.066667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333333c4.266667 0 8.533333 0 10.666667-2.133333 8.533333-4.266667 14.933333-8.533333 17.066666-17.066667 2.133333-4.266667 2.133333-8.533333 2.133334-10.666667v-213.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v136.533333L172.8 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l185.6 187.733333zM695.466667 650.666667H832c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H618.666667c-4.266667 0-8.533333 0-10.666667 2.133333-8.533333 4.266667-14.933333 8.533333-17.066667 17.066667-2.133333 4.266667-2.133333 8.533333-2.133333 10.666666v213.333334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-136.533334l200.533333 200.533334c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-204.8-198.4zM435.2 605.866667c-4.266667-8.533333-8.533333-14.933333-17.066667-17.066667-4.266667-2.133333-8.533333-2.133333-10.666666-2.133333H192c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533333L128 851.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l200.533334-200.533333V832c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V618.666667c-2.133333-4.266667-2.133333-8.533333-4.266667-12.8zM603.733333 403.2c4.266667 8.533333 8.533333 14.933333 17.066667 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333L896 170.666667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-187.733333 187.733333V177.066667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c2.133333 4.266667 2.133333 8.533333 4.266666 12.8z" fill="#fff"></path></svg>
            </button>
          </div>
        </div>
      </template>
      <template #popover>
        <img class="a-img a-img-popover-item" :src="visible ? (src || srcMin) : undefined" :alt="name" />
      </template>
      <template #default>
        <img class="a-img" v-if="visible && hide && (src || srcMin)" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" style="width:100vw;height:56.25vw;max-height:30vh" />
        <img class="a-img" v-if="visible && !hide && (src || srcMin)" :src="src || srcMin" :alt="name" @load="onImageLoad" @error="onImageError" style="width:100%" />
      </template>
    </Modal>
  </Lazyload>
</template>

<style scoped lang="less">
.a-img-popover-item {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}

.a-img-left-action {
  width: 50%;
  text-align: left;
  float: left;
}

.a-img-right-action {
  width: 50%;
  text-align: right;
  float: right;
}

.a-img {
  margin: 18px 0;
}
</style>