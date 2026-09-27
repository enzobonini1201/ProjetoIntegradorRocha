import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/auth_controller.dart';
import '../../features/auth/presentation/login_page.dart';
import '../../features/auth/presentation/recover_page.dart';
import '../../features/auth/presentation/register_page.dart';
import '../../features/dashboard/presentation/dashboard_page.dart';
import '../../features/shell/presentation/shell_page.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authControllerProvider.notifier);
  return GoRouter(
    initialLocation: '/home',
    refreshListenable: GoRouterRefreshStream(auth.stream),
    redirect: (context, state) {
      final authState = ref.read(authControllerProvider);
      if (authState.status == AuthStatus.checking) return null;
      final publicRoute = state.matchedLocation == '/login' ||
          state.matchedLocation == '/register' ||
          state.matchedLocation == '/recover';
      if (authState.status == AuthStatus.unauthenticated && !publicRoute) return '/login';
      if (authState.status == AuthStatus.authenticated && publicRoute) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterPage()),
      GoRoute(path: '/recover', builder: (context, state) => const RecoverPage()),
      GoRoute(
        path: '/home',
        builder: (context, state) => const ShellPage(child: DashboardPage()),
      ),
    ],
  );
});

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
