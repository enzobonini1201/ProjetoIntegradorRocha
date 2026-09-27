import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_theme.dart';
import '../../auth/presentation/auth_controller.dart';

class ShellPage extends ConsumerStatefulWidget {
  const ShellPage({super.key, required this.child});

  final Widget child;

  @override
  ConsumerState<ShellPage> createState() => _ShellPageState();
}

class _ShellPageState extends ConsumerState<ShellPage> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authControllerProvider).user;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sistema Rocha', style: TextStyle(fontWeight: FontWeight.w800)),
        actions: [
          IconButton(onPressed: () => _comingSoon('Perfil'), icon: const Icon(Icons.account_circle_outlined), tooltip: 'Perfil'),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              UserAccountsDrawerHeader(
                decoration: const BoxDecoration(color: AppColors.primary),
                accountName: Text(user?.name ?? 'Usuário'),
                accountEmail: Text(user?.login ?? ''),
                currentAccountPicture: const CircleAvatar(backgroundColor: Colors.white, child: Text('R', style: TextStyle(color: AppColors.primary, fontSize: 26, fontWeight: FontWeight.w800))),
              ),
              _DrawerItem(icon: Icons.dashboard_outlined, label: 'Dashboard', onTap: () => _select(0)),
              _DrawerItem(icon: Icons.badge_outlined, label: 'Motoristas', onTap: () => _comingSoon('Motoristas')),
              _DrawerItem(icon: Icons.groups_outlined, label: 'Agregados e ajudantes', onTap: () => _comingSoon('Agregados e ajudantes')),
              _DrawerItem(icon: Icons.business_outlined, label: 'Clientes', onTap: () => _comingSoon('Clientes')),
              _DrawerItem(icon: Icons.local_shipping_outlined, label: 'Transportes', onTap: () => _comingSoon('Transportes')),
              _DrawerItem(icon: Icons.receipt_long_outlined, label: 'Notas fiscais', onTap: () => _comingSoon('Notas fiscais')),
              _DrawerItem(icon: Icons.route_outlined, label: 'Rotas', onTap: () => _comingSoon('Rotas')),
              const Spacer(),
              const Divider(),
              _DrawerItem(icon: Icons.logout, label: 'Sair', onTap: () => ref.read(authControllerProvider.notifier).logout()),
            ],
          ),
        ),
      ),
      body: widget.child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: _select,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Início'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Notas'),
          NavigationDestination(icon: Icon(Icons.route_outlined), selectedIcon: Icon(Icons.route), label: 'Rotas'),
        ],
      ),
    );
  }

  void _select(int index) {
    setState(() => _index = index);
    Navigator.of(context).popUntil((route) => route.isFirst);
    if (index == 0) context.go('/home');
    if (index == 1) _comingSoon('Notas fiscais');
    if (index == 2) _comingSoon('Rotas');
  }

  void _comingSoon(String module) {
    Navigator.of(context).maybePop();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$module será implementado na próxima fatia.')));
  }
}

class _DrawerItem extends StatelessWidget {
  const _DrawerItem({required this.icon, required this.label, required this.onTap});

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ListTile(leading: Icon(icon), title: Text(label), onTap: onTap);
}
