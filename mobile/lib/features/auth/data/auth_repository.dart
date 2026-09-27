import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/token_storage.dart';
import '../../../shared/models/user.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider), ref.watch(tokenStorageProvider));
});

class AuthSession {
  const AuthSession({required this.token, required this.user});

  final String token;
  final User user;
}

class AuthRepository {
  AuthRepository(this._client, this._storage);

  final Dio _client;
  final TokenStorage _storage;

  Future<AuthSession> login({required String login, required String password}) async {
    final response = await _client.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'login': login, 'senha': password},
    );
    return await _saveAuthResponse(response.data ?? <String, dynamic>{});
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String cpf,
    required String password,
    required String confirmation,
  }) async {
    final response = await _client.post<Map<String, dynamic>>(
      '/usuarios/cadastro',
      data: {
        'nomeCompleto': name,
        'cpf': cpf,
        'senha': password,
        'confirmarSenha': confirmation,
      },
    );
    return response.data ?? <String, dynamic>{};
  }

  Future<Map<String, dynamic>> recoverPassword({
    required String cpf,
    required String newPassword,
  }) async {
    final response = await _client.post<Map<String, dynamic>>(
      '/usuarios/recuperar-senha',
      data: {'cpf': cpf, 'novaSenha': newPassword},
    );
    return response.data ?? <String, dynamic>{};
  }

  Future<User> currentUser() async {
    final response = await _client.get<Map<String, dynamic>>('/auth/me');
    return User.fromJson(response.data ?? <String, dynamic>{});
  }

  Future<void> logout() => _storage.clear();

  Future<AuthSession> _saveAuthResponse(Map<String, dynamic> json) async {
    final token = (json['token'] ?? '').toString();
    final user = User.fromJson(json);
    if (token.isEmpty) {
      throw StateError('Resposta de autenticação sem token.');
    }
    await _storage.saveSession(token: token, userJson: jsonEncode(user.toJson()));
    return AuthSession(token: token, user: user);
  }
}
