function getBaseName(filePath, suffix) {
    // 从文件路径中提取文件名
    const baseName = filePath.split('/').pop(); // 使用 '/' 分隔符获取最后一部分
    if (suffix && baseName.endsWith(suffix)) {
        return baseName.slice(0, -suffix.length); // 移除后缀
    }
    return baseName;
}

function getDirName(filePath) {
    // 去除路径中最后的部分，保留目录名
    const lastSlashIndex = filePath.lastIndexOf('/');
    if (lastSlashIndex === -1) {
        return '.'; // 如果没有斜杠，返回当前目录
    }
    return filePath.slice(0, lastSlashIndex);
}

function joinPaths(...paths) {
    return paths
        .map(path => path.replace(/\\/g, '/')) // 替换反斜杠为正斜杠
        .join('/') // 用正斜杠连接路径
        .replace(/\/+/g, '/'); // 处理多余的斜杠
}

export {getBaseName, getDirName, joinPaths};
