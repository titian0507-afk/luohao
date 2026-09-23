# 罗昊 · Portfolio

个人作品集：[在线预览](https://titian0507-afk.github.io/luohao/)。作品分为 **访谈 / 短视频 / 平面与H5**，共 29 个项目。

直接打开 `index.html`，或在目录中运行 `python -m http.server 4173` 后访问 `http://localhost:4173`。网站使用原生 HTML、CSS 和 JavaScript，无需构建。

作品清单在 `content.js`。标题可以直接修改；`frameTitles` 可按项目填写画面标题。封面图和其他静态资源放在 `assets/works`，网页视频为 H.264/AAC faststart 格式，只在打开作品详情后加载。视频卡片在悬停时切换画面，卡片和播放器按素材原始横竖比例展示。多图作品在卡片中自动轮播，在详情页可切换、放大，并能查看同一分类的全部项目。

联系区域提供简历 PDF 查看入口，文件位于 `assets/luohao-resume.pdf`。

首页在每次重新进入时交替播放原开场影片与 AE 合集，默认静音并铺满屏幕。刷新后自动回到页面顶部。页面含固定进度线、三幕轮播、错位作品布局，以及跟随鼠标局部显现的网格。轮播按滚动位置选择类别，画面以缓动水平切换；滚动结束后自动对齐到完整一页。桌面端使用白色镂空圆形光标；移动设备使用原生触控。邮箱 `titian0507@gmail.com` 与微信 `titian1231` 可以点击复制。个人照片是 `assets/portrait.jpg`。

网站从 `main` 分支根目录通过 GitHub Pages 发布。原视频和 PSD 工作文件不在仓库中；网页内使用的是从用户提供的本地作品集制作的适配版素材。`assets/hero-collage.png` 是为网页生成的黑白胶片风格背景。
