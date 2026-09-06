# 罗昊 · Portfolio

黑白胶片风个人作品集，按 **创意短片 / 内容营销 / 平面与 H5** 分类。参考用户提供的截图与录屏进行网页风格复刻；首页姓名为罗昊。作品、个人照片、简介、邮箱、微信及 Showreel 均保留占位，没有使用参考网站中的他人案例作为个人作品。

## 预览

直接打开 `index.html`，或在此目录执行：

```sh
python -m http.server 4173
```

浏览器打开 `http://localhost:4173`。网站为原生 HTML、CSS 和 JavaScript，无需构建或安装依赖，兼容 GitHub Pages。

## 填写内容

编辑 `content.js`，每类预设三个空作品位，可继续增删 `projects` 条目。

```js
{ id: 'film-01', category: 'film', title: '你的项目名称',
  image: 'assets/cover.jpg', video: 'assets/film.mp4',
  description: '项目介绍、职责和创作过程。' }
```

- `category`：`film`（创意短片）、`content`（内容营销）、`design`（平面与 H5）。
- `image`：封面路径。`video`：可选视频路径；有视频时详情页使用原生播放器。
- 顶层 `bio` / `email` / `wechat` / `showreel`：个人简介、邮箱、微信号、作品集锦视频路径。
- 个人照片：替换 `index.html` 中 `.portrait-placeholder` 的占位内容。
- H5 项目可先填写项目介绍、截图或演示视频。
- 使用素材前，请确保拥有相应使用权。不要把账号密码或私密资料放进代码。

## 已实现

首页大字、描边 PORTFOLIO、悬浮导航、入场动画、精选序列切换、三类筛选、作品详情弹窗、Showreel 占位、About、Contact、返回顶部、移动端适配、键盘焦点和减少动画偏好支持。

## 视觉素材

`assets/hero-collage.png` 为内置 imagegen 生成的黑白摄影拼贴背景。提示词：wide 2:1 monochrome analog collage of torn textured paper, silver gelatin coastal and mountain photography, pressed botanical stem, film negative strip, quiet left space; no text, UI or logo. 网页文字与控件全部由 HTML/CSS 绘制，没有将截图作为整页 UI。

## 发布

GitHub Pages 设置：从 `main` 分支根目录发布。站点入口为 `index.html`，资源使用相对路径。
