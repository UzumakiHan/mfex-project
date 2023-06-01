
import downLoad from 'download-git-repo'
import path from 'path'
import inquirer from 'inquirer'
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra'
import { questionList, vueConfigList, reactConfigList, vuePackageTemplateConfigList } from '../constant.js';
import { isFileExist, fileControl, delPath } from '../utils/index.js'
//设置检测重名的问题交互
const folder = [
  {
    name: "folder",
    message: "当前目录已存在，请选择",
    type: "list",
    choices: [
      {
        name: "覆盖",
        value: "cover"
      },
      {
        name: "重命名",
        value: "rename"
      }
    ]
  },
  {
    name: 'newName',
    // 这里设置当前面用户选择重命名后，让用户输入新名称
    when: answer => answer.folder === 'rename',
    type: 'input',
    message: '目录名称为:'
  }

]


const handleDownLoad = (projectName) => {
  inquirer.prompt(questionList).then(res => {
    const targetDir = path.join(process.cwd(), projectName)
    // 获取到第一项中，用户选择的值，这里偷了个懒，大家可以根据答案和问题获取对应下载链接。
    const info = questionList[0].choices.find(item => item.value === res.features)

    let configAnswer = vueConfigList
    if (res.features === 'react') {
      configAnswer = reactConfigList
    } else if (res.features === 'vue-node-package') {
      configAnswer = vuePackageTemplateConfigList
    }

    inquirer.prompt(configAnswer).then(result => {
      /*** 初始化loading图标文字 start */
      const spinner = ora('模版下载中 ...')
      /*** 初始化loading图标文字 end */
      spinner.start()
      downLoad(`direct:${info.link}`, targetDir, { clone: true }, (err) => {
        if (err) {
          spinner.fail()
          console.log(chalk.red(err))
          console.log(chalk.red('获取模版失败'))
        } else {
          // 获取所有的用户问题答案，并以用户create名称为项目名称
          const answer = { name: projectName, ...res, ...result }
          // 处理package.json对应交互变更
          fileControl(targetDir, 'package.json', answer)
          if (res.features === 'react' || res.features === 'vue') {
            fileControl(targetDir, 'vite.config.ts', answer)
            //处理index.html
            fileControl(targetDir, 'index.html', answer)
            if (answer.features === 'vue') {
              // 处理入口文件相关变更main.js
              fileControl(targetDir, '/src/main.ts', answer)
              fileControl(targetDir, '/src/router/index.ts', answer)
              fileControl(targetDir, '/src/vite-env.d.ts', answer)
              if (!answer.pinia) {
                delPath(path.join(targetDir, '/src/store'))
              }
            } else if (answer.features === 'react') {
              fileControl(targetDir, '/src/main.tsx', answer)
              fileControl(targetDir, '/src/views/index/index.tsx', answer)
              if (!answer.mobx) {
                delPath(path.join(targetDir, '/src/store'))
              }
            }
          }else if(res.features === 'vue-node-package'){
            fileControl(targetDir, '/src/vue/index.vue', answer)
            fileControl(targetDir, '/typings/typing.d.ts', answer)

          }
          //处理vite.config.ts

          const spinner = ora('获取模版成功')
          spinner.succeed()
          // console.log(chalk.green('获取模版成功'))

        }
        spinner.stop()
      })
    })

  })
}
const handleChecKName = (name) => {
  // 清空控制台
  console.clear()
  if (isFileExist(name)) {
    inquirer.prompt(folder).then(res => {
      if (res.folder === 'cover') {
        const targetDir = path.join(process.cwd(), name)
        const loadingMsg = ora(`正在删除 ${chalk.cyan(targetDir)}...`)
        loadingMsg.start()
        fs.remove(targetDir).then(val => {
          loadingMsg.succeed()
          loadingMsg.stop()
          handleDownLoad(name)
        })
      } else {
        handleChecKName(res.newName)
      }
    })
  } else {
    handleDownLoad(name)
  }
}
export default handleChecKName;