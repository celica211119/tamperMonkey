// ==UserScript==
// @name         bilibili组件屏蔽
// @version      v0.0.1
// @description  将类型匹配的组件删除、隐藏
// @match        https://*.bilibili.com/*
// @namespace    celica.bilibili
// ==/UserScript==

(function() {
    'use strict';

    // 所有要移除的组件的 CSS 选择器
    const selectorsToRemove = [
        // 首页
        '.recommended-swipe', // 滑动推荐
        '.floor-single-card', // 板块推荐
        '.feed-card:has(.bili-video-card.is-rcmd:not(.enable-no-interest))', // 广告
        '.bili-feed-card:has(.bili-video-card.is-rcmd:not(.enable-no-interest))', // 懒加载广告
        '.bili-video-card__info--icon-text', // 作者图标:播放量
        '.bili-video-card__info--owner__up', // 作者图标:up
        '.bili-live-card__info--uname-icon', // 主播图标:up
        // 搜索页
        '.col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40:has(.bili-video-card__info--ad)', // 广告
    ];
    // 所有要隐藏的组件的 CSS 选择器
    const selectorsToHide = [
        // 视频页
        '.act-now',
        '.activity-m-v1',
        '.ad-floor-cover',
        '.ad-floor-exp',
        '.ad-report',
        '.left-banner',
        '.right-bottom-banner',
        '.slide-ad-exp',
        '.video-card-ad-small',
    ];
    // 要删除的最外层父级容器的选择器
    const containerToRemoveSelector = '.bili-feed-card';
    // 要查找的作者名元素的选择器
    const authorSpanSelector = '.bili-video-card__info--author';
    // 首页所有屏蔽的UP主的 CSS 选择器
    const authorBlacklist = [
        '爱丽速子LightSpeed',
        'cc-小亚',
        'Feelin-双',
        '富贵甜心喵',
        '何书烟-有猫版',
        '河原木仁菜_',
        '话题分享猫',
        'Inoo慧',
        '猛男影视w',
        '柿柿如意Oc',
        '棠峰盛宇',
        '小白今日话题',
        '小情兽獣',
        '棕熊音乐库',

        '棕熊音乐库',

    ];

    // 定义移除元素函数
    function removeSpecificElements() {
        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // 确保元素存在且未被移除过，避免重复操作
                if (element && element.parentNode) {
                    element.remove();
                    console.log(`成功移除了一个 ${selector}`);
                }
            });
        });
    }
    // 定义隐藏元素函数
    function hideSpecificElements() {
        selectorsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // 确保元素存在且未被移除过，避免重复操作
                if (element && element.parentNode) {
                    element.style.display = 'none';
                    console.log(`成功隐藏了一个 ${selector}`);
                }
            });
        });
    }
    // 定义一个函数来查找并移除符合条件的元素
    function removeByAuthorName() {
        // 查找所有可能的作者名span元素
        document.querySelectorAll(authorSpanSelector).forEach(authorSpan => {
            // 确保该span元素及其父级容器尚未被移除
            if (!document.body.contains(authorSpan)) {
                return; // 如果不在DOM中，跳过
            }

            // 获取作者名，优先使用 title 属性，因为有时 textContent 可能被截断
            const authorName = authorSpan.title || authorSpan.textContent;

            // 检查作者名是否在黑名单中
            if (authorBlacklist.includes(authorName)) {
                // 如果是黑名单作者，则向上查找最近的父级容器并删除
                const container = authorSpan.closest(containerToRemoveSelector);
                if (container && document.body.contains(container)) { // 再次确认容器存在且未被移除
                    container.remove();
                    console.log(`成功移除了UP主 "${authorName}"`);
                }
            }
        });
    }

    // 页面加载完成后立即执行一次，移除初始存在的元素
    removeSpecificElements();
    removeByAuthorName();
    hideSpecificElements();

    // 创建一个 MutationObserver 实例，用于监听 DOM 树的变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            // 只关心新节点被添加到 DOM 中的变化
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 当有新节点添加时，再次尝试移除目标元素
                removeSpecificElements();
                removeByAuthorName();
                hideSpecificElements();
            }
        }
    });

    // 配置观察选项：观察子节点的变化以及所有后代节点的变化
    const config = { childList: true, subtree: true };

    // 开始观察 document.body 元素，因为它包含了整个页面的内容
    observer.observe(document.body, config);

    // 额外的检查：添加一个延时尝试，作为兜底方案（可选，但通常MutationObserver就足够了）
    // setTimeout(removeSpecificElements, 2000); // 2秒后再次尝试
})();
