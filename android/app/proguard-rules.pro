# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Capacitor & WebView JS Interface preservation
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }

-keep class * extends com.getcapacitor.Plugin {
    public <methods>;
    public <fields>;
}

# Preserve line number information for crash report symbolication in Play Console
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

