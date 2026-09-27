import 'package:flutter/services.dart';

class TokenStorage {
  static const _tokenKey = 'rocha_access_token';
  static const _userKey = 'rocha_current_user';
  static const _channel = MethodChannel('com.sistemarocha.mobile/secure_storage');

  // The Android implementation encrypts these values with Android Keystore.
  // The in-memory fallback keeps widget tests and other Flutter platforms usable.
  static final Map<String, String> _fallback = <String, String>{};

  Future<String?> _read(String key) async {
    try {
      return await _channel.invokeMethod<String>('read', {'key': key});
    } on MissingPluginException {
      return _fallback[key];
    }
  }

  Future<void> _write(String key, String value) async {
    try {
      await _channel.invokeMethod<void>('write', {'key': key, 'value': value});
    } on MissingPluginException {
      _fallback[key] = value;
    }
  }

  Future<void> _delete(String key) async {
    try {
      await _channel.invokeMethod<void>('delete', {'key': key});
    } on MissingPluginException {
      _fallback.remove(key);
    }
  }

  Future<String?> readToken() => _read(_tokenKey);

  Future<void> saveSession({required String token, required String userJson}) async {
    await _write(_tokenKey, token);
    await _write(_userKey, userJson);
  }

  Future<String?> readUser() => _read(_userKey);

  Future<void> clear() async {
    await _delete(_tokenKey);
    await _delete(_userKey);
  }
}
