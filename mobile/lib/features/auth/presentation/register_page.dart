import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_theme.dart';
import 'auth_controller.dart';
import 'auth_form_scaffold.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _cpf = TextEditingController();
  final _password = TextEditingController();
  final _confirmation = TextEditingController();

  @override
  void dispose() {
    _name.dispose();
    _cpf.dispose();
    _password.dispose();
    _confirmation.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    return AuthFormScaffold(
      title: 'Criar conta',
      subtitle: 'Cadastre seu acesso ao Sistema Rocha.',
      form: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(controller: _name, decoration: const InputDecoration(labelText: 'Nome completo'), validator: _required),
            const SizedBox(height: 14),
            TextFormField(controller: _cpf, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'CPF'), validator: _required),
            const SizedBox(height: 14),
            TextFormField(controller: _password, obscureText: true, decoration: const InputDecoration(labelText: 'Senha'), validator: _passwordValidator),
            const SizedBox(height: 14),
            TextFormField(controller: _confirmation, obscureText: true, decoration: const InputDecoration(labelText: 'Confirmar senha'), validator: (value) => value != _password.text ? 'As senhas não coincidem.' : null),
            if (auth.error != null) ...[
              const SizedBox(height: 14),
              Text(auth.error!, style: const TextStyle(color: AppColors.danger)),
            ],
            const SizedBox(height: 24),
            FilledButton(
              onPressed: auth.isSubmitting ? null : _submit,
              child: Text(auth.isSubmitting ? 'Cadastrando...' : 'Cadastrar'),
            ),
            TextButton(onPressed: () => context.go('/login'), child: const Text('Voltar para o login')),
          ],
        ),
      ),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final message = await ref.read(authControllerProvider.notifier).register(
          name: _name.text.trim(),
          cpf: _cpf.text.trim(),
          password: _password.text,
          confirmation: _confirmation.text,
        );
    if (!mounted || message == null) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    context.go('/login');
  }

  String? _required(String? value) => value == null || value.trim().isEmpty ? 'Campo obrigatório.' : null;

  String? _passwordValidator(String? value) {
    if (value == null || value.length < 8) return 'Use pelo menos 8 caracteres.';
    if (!RegExp(r'(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!])').hasMatch(value)) {
      return 'Use maiúscula, minúscula, número e caractere especial.';
    }
    return null;
  }
}
