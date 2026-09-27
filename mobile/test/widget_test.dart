import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:sistema_rocha_mobile/core/theme/app_theme.dart';
import 'package:sistema_rocha_mobile/features/auth/presentation/login_page.dart';

void main() {
  testWidgets('renders the login screen', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          theme: AppTheme.light,
          home: const LoginPage(),
        ),
      ),
    );
    await tester.pump();

    expect(find.text('Bem-vindo de volta'), findsOneWidget);
    expect(find.text('Entrar'), findsOneWidget);
    expect(find.text('CPF ou login'), findsOneWidget);
  });
}
