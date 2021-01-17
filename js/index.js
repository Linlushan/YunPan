{
    let topId = 4000;

    console.log(getAllParent(topId));

    //根据id获取对应当前项数据
    function getSelf(id) {
        return data.filter((item) => { return id == item.id })[0]
    }
    //查找子级，根据父级id（pid）
    function getChild(pid) {
        return data.filter((item) => { return pid == item.pid })
    }

    //查找父级
    function getParent(id) {
        let s = getSelf(id)
        return getSelf(s.pid)
    }
    //查找所有父级
    function getAllParent(id) {
        let parent = getParent(id)
        let allParent = []
        while (parent) {
            allParent.unshift(parent)
            parent = getParent(parent.id)
        }
        return allParent
    }
}