# 罗昊 · Portfolio

个人作品集：[腾讯云正式站点](https://luohao-studio.site/) · [GitHub Pages 备用预览](https://titian0507-afk.github.io/luohao/)。作品分为 **访谈 / 营销视频 / AIGC / 平面与H5**，共 33 个项目。

直接打开 `index.html`，或在目录中运行 `python -m http.server 4173` 后访问 `http://localhost:4173`。网站使用原生 HTML、CSS 和 JavaScript，无需构建。

作品清单在 `content.js`。标题可以直接修改；`frameTitles` 可按项目填写画面标题。封面图和其他静态资源放在 `assets/works`，视频只在打开作品详情后加载。视频卡片在悬停时切换画面，卡片按封面横竖比例展示，播放器按视频原始比例展示。MCtalk 完整访谈分为九段，支持自动连播与手动选段。多图作品在卡片中自动轮播，在详情页可切换、放大，并能查看同一分类的全部项目。

联系区域提供简历 PDF 查看入口，文件位于 `assets/luohao-resume.pdf`。

首页在每次重新进入时交替播放原开场影片与 AE 合集，默认静音并铺满屏幕。刷新后自动回到页面顶部。页面含固定进度线、六幕轮播、错位作品布局，以及跟随鼠标局部显现的网格。前四幕对应作品分类，后两幕链接 MCtalk 官网及网易智企小红书主页。桌面端在轮播区域每次滚动手势切换一页，连续触控板事件合并为一次；画面以缓动水平切换，其他方式滚动结束后也自动对齐到完整一页。鼠标移动到“罗昊”字样会局部显现“螺号”。桌面端使用白色镂空圆形光标；移动设备使用原生触控。邮箱 `titian0507@gmail.com` 与微信 `titian1231` 可以点击复制。个人照片是 `assets/portrait.jpg`。

网站从 `main` 分支根目录通过 GitHub Pages 发布。仓库包含网页播放所需的视频与图片；PSD 等工作文件未纳入。`assets/hero-collage.png` 是为网页生成的黑白胶片风格背景。
