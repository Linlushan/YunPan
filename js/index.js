{
    let topId = 4000;//顶层id
    let nowId = 4000;//当前项id

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

    //视图渲染
    let treeMenu = document.querySelector('#tree-menu')
    let breadNav = document.querySelector('.bread-nav')
    let folders = document.querySelector('#folders')

    //路径导航渲染
    breadNav.innerHTML = reanderzBreadMenu()
    function reanderzBreadMenu() {
        let nowSelf = getSelf(nowId)
        let allParent = getAllParent(nowId)
        let inner = ''
        allParent.forEach(item => {
            inner += `<a herf = '#'>${item.title}</a>`
        });
        inner += `<span>${nowSelf.title}</span>`
        return inner
    }
}