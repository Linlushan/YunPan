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
    //根据id和newId修改数据位置（移动位置）
    function moveData(id, newId) {
        let selfData = getSelf(id)
        selfData.pid = newId
    }
    //检查id 下的子元素是否与newName重名
    function testName(id, newName) {
        let child = getChild(id)
        return child.some(item => item.title == newName)
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
    //根据当前项id获取所有子级

    function getAllChild(id) {
        let child = getChild(id)
        arrChild = []
        if (child.length > 0) {
            arrChild = arrChild.concat(child)
            child.forEach(item => {
                arrChild = arrChild.concat(getChild(item.id))
            })
        }
        return arrChild
    }
    //删除数据当前项方法
    function removeData(id) {
        let remove = getAllChild(id)
        remove.push(getSelf(id))
        data = data.filter(item => !remove.includes(item))
        console.log(data);
    }

    //弹窗公共方法
    //成功弹窗
    function alertSuccess(info) {
        let succ = document.querySelector('.alert-success')
        clearTimeout(succ.timer)
        succ.classList.add('alert-show')
        succ.innerHTML = info
        succ.timer = setTimeout(() => {
            succ.classList.remove('alert-show')
        }, 1000)
    }
    //失败弹窗
    function alertWarning(info) {
        let warning = document.querySelector('.alert-warning')
        clearTimeout(warning.timer)
        warning.classList.add('alert-show')
        warning.innerHTML = info
        warning.timer = setTimeout(() => {
            warning.classList.remove('alert-show')
        }, 1000)
    }

    //树状菜单的渲染
    function renderTreeMenu(pid, level, isOpen) {
        let child = getChild(pid);
        let nowAllParent = getAllParent(nowId);
        nowAllParent.push(getSelf(nowId));
        let inner = `
        <ul>
            ${child.map(item => {
            let itemChild = getChild(item.id);
            return `
                    <li class="${(nowAllParent.includes(item) || isOpen) ? "open" : ""}">
                        <p 
                            style="padding-left:${40 + level * 20}px" 
                            class="${itemChild.length ? "has-child" : ""} ${item.id == nowId ? "active" : ""}"
                            data-id="${item.id}"
                        >
                            <span>${item.title}</span>
                        </p>
                        ${itemChild.length ? renderTreeMenu(item.id, level + 1, isOpen) : ""}
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

    //重命名
    function reName(folder) {
        let folderName = folder.querySelector('.folder-name')
        let editor = folder.querySelector('.editor')
        folderName.style.display = 'none'
        editor.style.display = 'block'
        editor.select()
        editor.onblur = function () {
            if (editor.value === folderName.innerHTML) {
                folderName.style.display = 'block'
                editor.style.display = 'none'
                return
            }
            if (!editor.value.trim()) {
                alertWarning('请输入新名字')
                editor.focus()
                return
            }
            if (testName(nowId, editor.value)) {
                alertWarning('名字重复了')
                editor.focus()
                return
            }
            folderName.style.display = 'block'
            editor.style.display = 'none'
            getSelf(folder.dataset.id).title = editor.value
            render()
            alertSuccess('重名名成功')
        }
    }

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
                title: getName()
            })
        render()
        alertSuccess('新建文件夹成功')
    })
    //获取新建文件名字
    function getName() {
        let chlid = getChild(nowId)
        let names = chlid.map(item => item.title)
        //过滤获取符合名字的title
        names = names.filter(item => {
            if (item === '新建文件夹') {
                return true
            }
            if (
                item.substring(0, 6) === '新建文件夹('
                && Number(item.substring(6, item.length - 1)) >= 2
                && item[item.length - 1] === ')'
            ) {
                return true
            }
            return false
        })
        names.sort((n1, n2) => {
            n1 = n1.substring(6, n1.length - 1)
            n2 = n2.substring(6, n2.length - 1)
            n1 = isNaN(n1) ? 0 : n1
            n2 = isNaN(n2) ? 0 : n2
            return n1 - n2
        })
        //判断第0位是否是 新建文件夹
        if (names[0] !== '新建文件夹') {
            return '新建文件夹'
        }
        for (let i = 1; i < names.length; i++) {
            if (Number(names[i].substring(6, names[i].length - 1)) !== i + 1) {
                return `新建文件(${names.length + 1})`
            }

        }
        return `新建文件夹(${names.length + 1})`
    }
    //右键菜单
    //阻止系统默认行为
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    })
    window.addEventListener('mousedown', function (e) {
        contextmenu.style.display = 'none'
    })
    window.addEventListener('resize', function (e) {
        contextmenu.style.display = 'none'
    })
    window.addEventListener('scorll', function (e) {
        contextmenu.style.display = 'none'
    })
    //右键添加事件
    let contextmenu = document.querySelector('#contextmenu')
    folders.addEventListener('contextmenu', function (e) {
        let folder = null

        if (e.target.tagName == 'LI') {
            folder = e.target
        } else if (e.target.parentNode.tagName == 'LI') {
            folder = e.target.parentNode

        }
        if (folder) {
            contextmenu.style.display = 'block'
            e.stopPropagation()
            e.preventDefault()
            let x = e.clientX
            let y = e.clientY
            let maxX = window.innerWidth - contextmenu.offsetWidth
            x = Math.min(x, maxX)
            let maxY = window.innerHeight - contextmenu.offsetHeight
            y = Math.min(y, maxY)
            contextmenu.style.left = x + 'px'
            contextmenu.style.top = y + 'px'
            contextmenu.folder = folder

        }
        // console.log(folder);
    })
    //右键菜单单项处理
    contextmenu.addEventListener('mousedown', function (e) {
        e.stopPropagation()
    })
    contextmenu.addEventListener('click', function (e) {
        if (e.target.classList.contains('icon-lajitong')) {//右键菜单(删除)
            confirm('确定要删除吗', () => {
                console.log('点击确定了');
                removeData(Number(this.folder.dataset.id))
                render()
                alertSuccess('删除文件夹成功')
            }, () => {
                console.log('点击取消了');
            })

        } else if (e.target.classList.contains('icon-yidong')) {//右键菜单(移动到)
            // console.log('移动到');
            let id = Number(this.folder.dataset.id)
            let nowPid = getSelf(id).pid
            moveAlert(() => {
                if (newPid === null || nowPid == newPid) {
                    alertWarning('您并没有任何移动')
                    return false
                }
                let allChild = getAllChild(id)
                let newParent = getSelf(newPid)
                allChild.push(getSelf(id))
                if (allChild.includes(newParent)) {
                    alertWarning('不能把文件移动到它的子级里面')
                    return false
                }
                if (testName(newPid, getSelf(id).title)) {
                    alertWarning('命名重复了')
                    return false
                }
                moveData(id, newPid)
                nowId = newPid
                render()
                alertSuccess('移动成功')
                return true
            })
        } else if (e.target.classList.contains('icon-zhongmingming')) {//右键菜单(重命名)
            console.log(this.folder);
            reName(this.folder)
        }
        contextmenu.style.display = 'none'
    })

    //  confirm 控件弹窗
    let confirmEl = document.querySelector('.confirm')
    let confirmText = document.querySelector('.confirm-text')
    let confirmClos = confirmEl.querySelector('.clos')
    let mask = document.querySelector('#mask')
    let confirmBtns = confirmEl.querySelectorAll('.confirm-btns a')


    function confirm(info, res, rej) {
        confirmText.innerHTML = info
        confirmEl.classList.add('confirm-show')
        mask.style.display = 'block'
        confirmBtns[0].onclick = function () {

            mask.style.display = 'none'
            confirmEl.classList.remove('confirm-show')
            res && res()
        }
        confirmBtns[1].onclick = function () {
            mask.style.display = 'none'
            confirmEl.classList.remove('confirm-show')
            rej && rej()
        }
    }
    confirmClos.addEventListener('click', function () {
        mask.style.display = 'none'
        confirmEl.classList.remove('confirm-show')
    })

    //移动单项的弹窗
    let moveAlertEl = document.querySelector('.move-alert')
    let closMoveAlert = moveAlertEl.querySelector('.clos')
    let moveAlertBtns = moveAlertEl.querySelectorAll('.confirm-btns a')
    let moveAlertTreeMenu = moveAlertEl.querySelector('.move-alert-menu ')
    let newPid = null
    moveAlertTreeMenu.addEventListener('click', (e) => {
        let item = ''
        item = e.target.tagName == 'SPAN' ? e.target.parentNode : e.target

        if (item.tagName == 'P') {
            let p = moveAlertTreeMenu.querySelectorAll('p')
            p.forEach(item => {
                item.classList.remove('active')
            })
            item.classList.add('active')
            newPid = item.dataset.id
        }
    })
    closMoveAlert.onclick = function () {
        moveAlertEl.classList.remove('move-alert-show')
        mask.style.display = 'none'
    }
    function moveAlert(res, rej) {
        moveAlertTreeMenu.innerHTML = renderTreeMenu(topPid, 0, true)
        moveAlertEl.classList.add('move-alert-show')
        mask.style.display = 'block'
        newPid = null
        moveAlertBtns[0].onclick = function () {
            if (res) {
                if (res()) {
                    moveAlertEl.classList.remove('move-alert-show')
                    mask.style.display = 'none'
                }
            } else {
                moveAlertEl.classList.remove('move-alert-show')
                mask.style.display = 'none'
            }


        }
        moveAlertBtns[1].onclick = function () {
            rej && rej()
            moveAlertEl.classList.remove('move-alert-show')
            mask.style.display = 'none'
        }

    }
}