class AppConfig {
  const AppConfig._();

  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    // O celular físico usa adb reverse para acessar o backend local.
    // Para emulador, compile com --dart-define=API_BASE_URL=http://10.0.2.2:8080/api.
    defaultValue: 'http://127.0.0.1:8080/api',
  );

  static const requestTimeout = Duration(seconds: 20);
}
