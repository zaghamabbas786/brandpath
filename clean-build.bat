@echo off
echo Cleaning Gradle cache and build files...
cd android
call gradlew clean
rmdir /s /q app\build
rmdir /s /q build
rmdir /s /q .gradle
cd ..
echo Clean complete! Now you can rebuild.

