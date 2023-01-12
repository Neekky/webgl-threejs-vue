fileName = "test"
echo "$buildScript 2323"
if ($buildScript == "test") {
    fileName = "test"
}
if ($buildScript == "dev") {
    fileName = "development"
} else {
    fileName = "production"
}

if ($installDependencies == "true") {
    yarn
} else {
    echo "不需要安装依赖！"
}

$buildScript
