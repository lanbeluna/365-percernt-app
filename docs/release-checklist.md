# 365% 发布准备清单

## 当前已具备

- React + Vite + TypeScript 前端可生产构建
- Android Capacitor 原生工程与真机运行
- Android 返回键、触觉反馈、本地持久化和本地通知
- PWA Manifest、Service Worker 和离线基础页面
- 自动化 lint 与 production build 检查
- 品牌图标、启动画面和 `1.0.0` 版本元数据
- 中文隐私政策初稿

## Android 发布前

- 在 Android Studio 生成并妥善保管 release signing key
- 生成签名 AAB，并在至少两台不同 Android 设备上测试
- 准备应用商店截图、功能图、简短说明和完整说明
- 建立公开可访问的隐私政策网页
- 在 Google Play Console 完成数据安全、内容分级和测试轨道问卷

## iOS 发布前

- 准备 Mac、最新版 Xcode 和 Apple Developer Program 账号
- 安装 `@capacitor/ios`，执行 `npx cap add ios` 和 `npx cap sync ios`
- 在 Xcode 配置签名、Bundle ID、版本和构建号
- 检查 Capacitor Preferences 对 Apple Privacy Manifest 的要求
- 在真机测试通知、返回流程、深色模式、离线启动和数据保留
- 准备 iPhone 所需尺寸截图、App Privacy 回答和审核说明
- 通过 App Store Connect 上传 TestFlight，再提交审核

## 每次发布固定流程

1. 更新 `package.json`、Android `versionName` 与 `versionCode`。
2. 运行 `npm run lint` 和 `npm run build`。
3. 运行 `npx cap sync android`。
4. 在 Android Studio 真机执行回归测试。
5. 合并发布分支并创建 Git tag。
