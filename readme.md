#### 需求说明
当我们遇到一个背景色，但是你并不知道这个背景色合适的字体颜色是什么，那么就可以使用这个工具。
具体场景，比如说一个标签背景色是用户自定义的，这个时候就可以使用这个工具，来计算出字体颜色是什么。如果字体颜色写死，则可能导致字体颜色和背景色不一致或接近，导致看不到字体。

支持各种颜色格式，包括rgb、rgba、hsl、hsla、hex、css颜色名，并内置了缓存逻辑。
`contrastColor`支持传入2个参数，第一个参数为背景色，第二个参数为容器所在背景色（默认为白色），如果你的容器背景色是透明的，则需要传入这个颜色。
#### 使用方法
```bash
npm install --save @zhujiegogogo/contrast-color
```
#### 项目引入
```js
import contrastColor from "@zhujiegogogo/contrast-color"
const color = contrastColor("#000000")
console.log(color)
```

#### 销毁
```js
import {destroy} from "@zhujiegogogo/contrast-color"
dstroy()
```
