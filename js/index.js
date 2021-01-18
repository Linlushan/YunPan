{
    let topPid = -1;//顶层pid
    let topId = 1;//顶层id
    let nowId = 0;//当前项id

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

    //视图渲染
    render()
    function render() {
        treeMenu.innerHTML = renderTreeMenu(-1, 0)
        breadNav.innerHTML = reanderBreadMenu()
        folders.innerHTML = reanderFolders()
    }

    //树状菜单的渲染

    function renderTreeMenu(pid, level) {
        let child = getChild(pid);
        let nowAllParent = getAllParent(nowId);
        nowAllParent.push(getSelf(nowId));
        let inner = `
        <ul>
            ${child.map(item => {
            let itemChild = getChild(item.id);
            return `
                    <li class="${nowAllParent.includes(item) ? "open" : ""}">
                        <p 
                            style="padding-left:${40 + level * 20}px" 
                            class="${itemChild.length ? "has-child" : ""} ${item.id == nowId ? "active" : ""}"
                            data-id="${item.id}"
                        >
                            <span>${item.title}</span>
                        </p>
                        ${itemChild.length ? renderTreeMenu(item.id, level + 1) : ""}
                    </li>
                `
        }).join("")}
        </ul>
    `;
        return inner;
    }

    //路径导航渲染
    function reanderBreadMenu() {
        let nowSelf = getSelf(nowId)
        let allParent = getAllParent(nowId)
        let inner = ''
        allParent.forEach(item => {
            inner += `<a data-id=${item.id} herf = '#'>${item.title}</a>`
        });
        inner += `<span>${nowSelf.title}</span>`
        return inner
    }

    //文件夹视图渲染

    function reanderFolders() {
        let child = getChild(nowId)
        let inner = ''
        child.forEach(item => {
            inner += `
                <li data-id='${item.id}' class="folder-item">
                    <img src="img/folder-b.png" alt="">
                    <span class="folder-name">${item.title}</span>
                    <input type="text" class="editor" value="${item.title}">
                    <label class="checked">
                        <input type="checkbox" />
                        <span class="iconfont icon-checkbox-checked"></span>
                    </label>   
                </li>
            `
        })
        return inner
    }

    //三大视图添加事件
    //树状菜单添加事件
    treeMenu.addEventListener('click', function (e) {
        let item = ''
        item = e.target.tagName == 'SPAN' ? e.target.parentNode : e.target
        if (item.tagName == 'P') {
            console.log(item.dataset.id);
            nowId = item.dataset.id
            render()
        }
    })

    //路径导航添加事件
    breadNav.addEventListener('click', function (e) {
        console.log(e.target);
        if (e.target.tagName === 'A') {
            nowId = e.target.dataset.id
            render()
        }
    })
    //文件夹添加事件
    folders.addEventListener('click', function (e) {
        console.log(e.target);
        let item = ''
        if (e.target.tagName === 'LI') {
            item = e.target.tagName
        } else if (e.target.tagName === 'IMG') {
            item = e.target.tagName.parentNode
        }
        if (item) {
            nowId = e.target.dataset.id
            render()
        }
    })
    //新建文件夹
    let createBtn = document.querySelector('.create-btn')
    createBtn.addEventListener('click', function () {
        data.push(
            {
                id: Date.now(),
                pid: nowId,
                title: "新建文件夹"
            })
            render()
    })  
}