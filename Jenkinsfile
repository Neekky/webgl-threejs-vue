fileName = "test"

if [[ $buildScript == *"test"]]
    then
        fileName = "test"
elif [[ $buildScript == *"dev"]]
    then
        fileName = "development"
else
    fileName = "production"
fi

if [[ $installDependencies == "true"]]
    then
        yarn
    else
        echo "不需要安装依赖！"

fi
$buildScript
