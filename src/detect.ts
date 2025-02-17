export class DeviceDetector {
  static isMobile = /Mobi|Android/i.test(navigator.userAgent);

  static isTV =
    /Android TV|SmartTV|AppleTV|Tizen|webOS|NetCast|Roku|PhilipsTV|SonyTV|HbbTV|LGTV|Viera|Aquos/i.test(
      navigator.userAgent
    );
}
