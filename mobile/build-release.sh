react-native bundle --platform android --dev false --entry-file index.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android
rmdir ".\app\src\main\res\drawable-*"
rmdir ".\app\src\main\res\raw"
./gradlew clean
./gradlew assembleRelease