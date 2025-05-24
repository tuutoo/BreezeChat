#!/bin/bash

# 创建字体目录
mkdir -p public/fonts

# 下载字体文件
curl -L "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansMono/NotoSansMono-Regular.ttf" -o public/fonts/NotoSansMono-Regular.ttf
curl -L "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansMono/NotoSansMono-Medium.ttf" -o public/fonts/NotoSansMono-Medium.ttf
curl -L "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansMono/NotoSansMono-Bold.ttf" -o public/fonts/NotoSansMono-Bold.ttf

# 转换为 woff2 格式
for font in public/fonts/*.ttf; do
  woff2_compress "$font"
  rm "$font"
done