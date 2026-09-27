import 'dart:async';
import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/token_storage.dart';
import '../../../shared/models/user.dart';
import '../data/auth_repository.dart';

enum AuthStatus { checking, unauthenticated, authenticated }

class AuthState {
  const AuthState({
    required this.status,
    this.user,
    this.error,
    this.isSubmitting = false,
  });

  const AuthState.checking() : this(status: AuthStatus.checking);
  const AuthState.unauthenticated({String? error})
      : this(status: AuthStatus.unauthenticated, error: error);
  const AuthState.authenticated(User user)
      : this(status: AuthStatus.authenticated, user: user);

  final AuthStatus status;
  final User? user;
  final String? error;
  final bool isSubmitting;

  AuthState copyWith({
    AuthStatus? status,
    User? user,
    String? error,
    bool clearError = false,
    bool? isSubmitting,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      error: clearError ? null : error ?? this.error,
      isSubmitting: isSubmitting ?? this.isSubmitting,
    );
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  final controller = AuthController(
    ref.watch(authRepositoryProvider),
    ref.watch(tokenStorageProvider),
  );
  unawaited(controller.restoreSession());
  return controller;
});

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._repository, this._storage) : super(const AuthState.checking());

  final AuthRepository _repository;
  final TokenStorage _storage;

  Future<void> restoreSession() async {
    try {
      final token = await _storage.readToken();
      if (token == null || token.isEmpty) {
        state = const AuthState.unauthenticated();
        return;
      }
      final storedUser = await _storage.readUser();
      if (storedUser != null) {
        state = AuthState.authenticated(User.fromJson(jsonDecode(storedUser)));
      }
      state = AuthState.authenticated(await _repository.currentUser());
    } catch (_) {
      await _storage.clear();
      state = const AuthState.unauthenticated();
    }
  }

  Future<void> login(String login, String password) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final session = await _repository.login(login: login, password: password);
      state = AuthState.authenticated(session.user);
    } catch (error) {
      state = AuthState(
        status: AuthStatus.unauthenticated,
        error: apiErrorMessage(error),
      );
    }
  }

  Future<String?> register({
    required String name,
    required String cpf,
    required String password,
    required String confirmation,
  }) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final result = await _repository.register(
        name: name,
        cpf: cpf,
        password: password,
        confirmation: confirmation,
      );
      state = const AuthState.unauthenticated();
      return (result['message'] ?? 'Cadastro realizado com sucesso.').toString();
    } catch (error) {
      state = AuthState(status: AuthStatus.unauthenticated, error: apiErrorMessage(error));
      return null;
    }
  }

  Future<String?> recover({required String cpf, required String password}) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final result = await _repository.recoverPassword(cpf: cpf, newPassword: password);
      state = const AuthState.unauthenticated();
      return (result['message'] ?? 'Senha alterada com sucesso.').toString();
    } catch (error) {
      state = AuthState(status: AuthStatus.unauthenticated, error: apiErrorMessage(error));
      return null;
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AuthState.unauthenticated();
  }
}
