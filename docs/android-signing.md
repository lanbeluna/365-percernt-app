# Android 发布签名

Android 发布包必须使用密钥签名。Google Play 新应用还需要启用 Play App Signing：你保管上传密钥，Google 保管用于分发的应用签名密钥。

## 文件作用

- `android/release-upload.jks`：本机上传密钥，不提交 Git。
- `android/keystore.properties`：本机密码与密钥配置，不提交 Git。
- `android/keystore.properties.example`：可提交的配置模板，不含真实密码。

## 在 Android Studio 创建上传密钥

1. 打开 `android` 工程。
2. 选择 `Build > Generate Signed App Bundle or APK`。
3. 选择 `Android App Bundle`，点击 `Next`。
4. 点击 `Create new`。
5. Key store path 选择 `android/release-upload.jks`。
6. Key alias 填写 `upload`。
7. Validity 建议填写 `25` 年以上。
8. 设置强密码，并保存到可靠的密码管理器。

不要在聊天、截图或 GitHub 中发送真实密码。

## 创建本机配置

复制 `android/keystore.properties.example` 为 `android/keystore.properties`，然后填写：

```properties
storeFile=release-upload.jks
storePassword=你的密钥库密码
keyAlias=upload
keyPassword=你的密钥密码
```

## 生成 AAB

在项目根目录先运行：

```powershell
npm run build
npx cap sync android
```

然后在 Android Studio 选择 `Build > Generate Signed App Bundle or APK`，生成 release AAB。输出通常位于：

```text
android/app/release/app-release.aab
```

也可以在已经正确配置 `JAVA_HOME` 时运行：

```powershell
cd android
.\gradlew.bat bundleRelease
```

## 必须备份

将 `.jks` 文件和两项密码分别安全备份。上传密钥丢失后可以向 Google Play 申请重置，但仍会显著增加发布维护成本。
