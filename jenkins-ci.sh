#!/bin/sh

node --version

echo "---------设置使用源--------"
yarn config set registry https://registry.npm.taobao.org

echo "---------查看当前源--------"
yarn config get registry

npm -v

yarn --max-old-space-size=1024