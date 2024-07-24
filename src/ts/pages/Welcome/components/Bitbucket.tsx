import React from 'react';

import Console from 'ts/components/Console';

import style from '../styles/bitbucket.module.scss';
import textStyle from '../styles/text.module.scss';
import copyInBuffer from '../../../helpers/copyInBuffer';
import notificationsStore from '../../../components/Notifications/store';
import { t } from '../../../helpers/Localization';

interface LiProps {
  title: string;
}
function Li({ title }: LiProps) {
  return (
    <li className={`${style.welcome_bitbucket_list_item} ${textStyle.welcome_text_m}`}>
      {title}
    </li>
  );
}

const CODE = 'javascript:(()=>{function getConfig(code, repositories) {return code && repositories.length? [{ code, folder: code, status: 1, repositories }]: [];}function getRepositories(selector, getUrl) {const elements=document.body.querySelectorAll(selector);return Array.from(elements).map((node)=>({url: getUrl(node),}));}function getConfigFromBitbucketPage() {const domain=location.origin;const code=location.pathname.toLowerCase().split(\'/\').pop()||\'\';const repositories=getRepositories(\'.aui-iconfont-repository-small + .repository-name span\',node=>[domain, \'/scm/\', code, \'/\', node.innerText, \'.git\'].join(\'\'));return getConfig(code, repositories);}function getConfigFromGitlabPage() {const code=(location.pathname.split(\'/\')?.[1]||\'\')?.replace(/-/gim, \'_\');const repositories=getRepositories(\'li[itemprop=owns] > div > a\', node=>(node.href + \'.git\'));return getConfig(code, repositories);}function downloadForChrome(blob, suggestedName) {window.showSaveFilePicker({ suggestedName }).then(async (file)=>{const writable=await file.createWritable();await writable.write(blob);await writable.close();});}function downloadForAll(blob, filename) {const a=document.createElement(\'a\');const url=URL.createObjectURL(blob);a.href=url;a.download=filename;document.body.appendChild(a);a.click();setTimeout(function() {document.body.removeChild(a);window.URL.revokeObjectURL(url);}, 0);}function download(text, filename) {const blob=new Blob([text], { type: \'application/json\' });if (window.navigator.msSaveOrOpenBlob) {window.navigator.msSaveOrOpenBlob(blob, filename);} else if (window.showSaveFilePicker) {downloadForChrome(blob, filename);} else {downloadForAll(blob, filename)}}function getFileName(code) {const defaultFileName=[code||\'tasks\', \'.json\'].join(\'\');return window.showSaveFilePicker? defaultFileName: (prompt(\'File name for save?\', defaultFileName)||defaultFileName);}const config=[...getConfigFromBitbucketPage(),...getConfigFromGitlabPage(),];const fileName=getFileName(config?.[0]?.code);download(JSON.stringify(config, 2, 2), fileName);})();';

function Bitbucket() {
  return (
    <>
      <section className={style.welcome_bitbucket}>
        <div className={style.welcome_bitbucket_left}>
          <img
            alt="Chrome bookmarklet"
            src="./assets/bookmarklet.png"
            className={style.welcome_bitbucket_icon}
          />
        </div>
        <div className={style.welcome_bitbucket_right}>
          <p className={`${textStyle.welcome_bitbucket_text} ${textStyle.welcome_text_m}`}>
            Чтобы не выписывать названия руками, подготовим скрипт для парсинга страницы Bitbucket или Gitlab:
          </p>
          <ul className={style.welcome_bitbucket_list}>
            <Li title="откройте новую вкладку;"/>
            <Li title="добавьте её в закладки;"/>
            <li className={`${style.welcome_bitbucket_list_item} ${textStyle.welcome_text_m}`}>
              {'откройте свойства только что созданной закладки и вставьте в поле URL '}
              <span
                className={textStyle.welcome_text_link}
                onClick={() => {
                  copyInBuffer(CODE);
                  notificationsStore.show(t('uiKit.console.notification'));
                }}
              >
              {'этот'}
              </span>
              {' скрипт'}
            </li>
            <Li title="сохраните изменения;"/>
          </ul>
        </div>
      </section>

      {false && (
        <Console
          className={style.welcome_bitbucket_console}
          textForCopy={CODE}
        />
      )}
      <section className={style.welcome_bitbucket}>
        <div className={style.welcome_bitbucket_right}>
          <ul className={style.welcome_list}>
            <Li title="откройте Bitbucket на странице со списком репозиториев;"/>
            <Li title="нажмите на закладку со скриптом;"/>
            <Li title="сохраните полученный файл;"/>
            <Li title="перетащите файл в это окно, если хотитте, чтобы сервис начал сбор лог файлов;"/>
          </ul>
        </div>
        <div className={style.welcome_bitbucket_left}>
          <img
            alt="Bitbucket page screenshot"
            src="./assets/bitbucket.png"
            className={style.welcome_bitbucket_icon}
          />
        </div>
      </section>
      <section className={style.welcome_bitbucket}>
        <div className={style.welcome_bitbucket_left}>
          <img
            alt="Gitlab page screenshot"
            src="./assets/gitlab.png"
            className={style.welcome_bitbucket_icon}
          />
        </div>
        <div className={style.welcome_bitbucket_right}>
          <ul className={style.welcome_list}>
            <Li title="откройте Gitlab на странице со списком репозиториев;"/>
            <Li title="раскройте группы, если нужные репозитории внутри;"/>
            <Li title="нажмите на закладку со скриптом;"/>
            <Li title="сохраните полученный файл;"/>
            <Li title="перетащите файл в это окно, если хотитте, чтобы сервис начал сбор лог файлов;"/>
          </ul>
        </div>
      </section>
    </>
  );
}

export default Bitbucket;
