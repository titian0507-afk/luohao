# 罗昊 · Portfolio

黑白胶片风个人作品集，按 **访谈 / 短视频 / 平面与H5** 分类。作品来自用户提供的本地「罗昊作品集」文件夹；个人照片、简介、邮箱和微信仍保留占位。Showreel 按钮可重新播放现有开场影片。

## 预览

直接打开 `index.html`，或在此目录执行：

```sh
python -m http.server 4173
```

浏览器打开 `http://localhost:4173`。网站为原生 HTML、CSS 和 JavaScript，无需构建或安装依赖，兼容 GitHub Pages。

## 填写内容

编辑 `content.js` 中的 `projects` 条目。视频标题使用原文件名，可直接改成正式标题；`frameTitles` 可逐条填写关键分镜标题。

```js
{ id: 'interview-01', category: 'interview', kind: 'video', title: '视频标题',
  image: 'assets/works/interview-01-shot-02.jpg',
  video: 'assets/works/interview-01.mp4',
  frames: ['assets/works/interview-01-shot-01.jpg'],
  frameTitles: ['分镜标题'] }
```

- `category`：`interview`（访谈）、`short`（短视频）、`design`（平面与H5）。
- `kind`：`video`、`gallery` 或 `document`。`image` 是封面，`video` 是按需加载的视频，`gallery` 是平面图集，`document` 是可下载脚本。
- 顶层 `bio` / `email` / `wechat` / `showreel`：个人简介、邮箱、微信号、作品集锦视频路径。
- 个人照片：替换 `index.html` 中 `.portrait-placeholder` 的占位内容。
- 视频详情页只显示标题、播放器、关键分镜和可用附件；平面作品显示画面网格。不生成未经提供的项目介绍。
- 使用素材前，请确保拥有相应使用权。不要把账号密码或私密资料放进代码。

## 已实现

打开网站时会静音自动播放全屏开场视频。作品视频由原文件优化为 H.264/AAC、faststart MP4，封面和关键分镜是静态帧，播放器只在打开详情后加载。原视频未改动；PSD 工作文件没有公开，脚本 DOCX 作为附件。鼠标设备使用白色镂空圆形光标，触屏保留原生操作。首页保留描边 PORTFOLIO、固定进度线、精选序列和错位作品布局。

## 视觉素材

`assets/hero-collage.png` 为内置 imagegen 生成的黑白摄影拼贴背景。提示词：wide 2:1 monochrome analog collage of torn textured paper, silver gelatin coastal and mountain photography, pressed botanical stem, film negative strip, quiet left space; no text, UI or logo. 网页文字与控件全部由 HTML/CSS 绘制，没有将截图作为整页 UI。

## 发布

GitHub Pages 设置：从 `main` 分支根目录发布。站点入口为 `index.html`，资源使用相对路径。
