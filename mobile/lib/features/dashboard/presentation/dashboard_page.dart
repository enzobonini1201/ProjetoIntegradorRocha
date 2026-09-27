import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/presentation/auth_controller.dart';
import '../data/dashboard_repository.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).user;
    final dashboard = ref.watch(dashboardProvider);
    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(dashboardProvider);
        await ref.read(dashboardProvider.future);
      },
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
        children: [
          Text('Bem-vindo, ${user?.name ?? 'usuário'}!',
              style: Theme.of(context)
                  .textTheme
                  .headlineSmall
                  ?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          const Text('Aqui está um resumo da operação.',
              style: TextStyle(color: AppColors.muted)),
          const SizedBox(height: 24),
          dashboard.when(
            loading: () => const Center(
                child: Padding(
                    padding: EdgeInsets.all(48),
                    child: CircularProgressIndicator())),
            error: (error, _) => _DashboardError(
                message: apiErrorMessage(error),
                onRetry: () => ref.invalidate(dashboardProvider)),
            data: (data) => Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.55,
                  children: [
                    _MetricCard(
                        label: 'Motoristas',
                        value: data.drivers,
                        icon: Icons.badge_outlined,
                        color: AppColors.primary),
                    _MetricCard(
                        label: 'Clientes',
                        value: data.clients,
                        icon: Icons.business_outlined,
                        color: AppColors.primaryDark),
                    _MetricCard(
                        label: 'Notas',
                        value: data.invoices,
                        icon: Icons.receipt_long_outlined,
                        color: AppColors.warning),
                    _MetricCard(
                        label: 'Transportes',
                        value: data.vehicles,
                        icon: Icons.local_shipping_outlined,
                        color: AppColors.success),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                        child: _StatusPill(
                            icon: Icons.check_circle_outline,
                            label: 'Entregues',
                            value: data.deliveredInvoices,
                            color: AppColors.success)),
                    const SizedBox(width: 10),
                    Expanded(
                        child: _StatusPill(
                            icon: Icons.warning_amber_outlined,
                            label: 'Vencidas',
                            value: data.overdueInvoices,
                            color: AppColors.danger)),
                  ],
                ),
                const SizedBox(height: 28),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Notas pendentes',
                        style: Theme.of(context)
                            .textTheme
                            .titleLarge
                            ?.copyWith(fontWeight: FontWeight.w800)),
                    Text('${data.pending.length}',
                        style: const TextStyle(
                            color: AppColors.muted,
                            fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 12),
                if (data.pending.isEmpty)
                  const _EmptyState()
                else
                  ...data.pending
                      .take(10)
                      .map((invoice) => _PendingCard(invoice: invoice)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill(
      {required this.icon,
      required this.label,
      required this.value,
      required this.color});

  final IconData icon;
  final String label;
  final int value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Icon(icon, color: color),
            const SizedBox(width: 10),
            Expanded(
                child: Text(label,
                    style: const TextStyle(color: AppColors.muted))),
            Text('$value',
                style: TextStyle(
                    color: color, fontWeight: FontWeight.w800, fontSize: 18)),
          ],
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard(
      {required this.label,
      required this.value,
      required this.icon,
      required this.color});

  final String label;
  final int value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color),
              Text('$value',
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(fontWeight: FontWeight.w800)),
              Text(label,
                  style: const TextStyle(color: AppColors.muted, fontSize: 12)),
            ]),
      ),
    );
  }
}

class _PendingCard extends StatelessWidget {
  const _PendingCard({required this.invoice});

  final PendingInvoice invoice;

  @override
  Widget build(BuildContext context) {
    final days = invoice.daysRemaining;
    final color = days == null || days <= 1
        ? AppColors.danger
        : days == 2
            ? AppColors.warning
            : AppColors.success;
    final collectionDate = invoice.collectionDate == null
        ? 'Data não informada'
        : DateFormat('dd/MM/yyyy').format(invoice.collectionDate!);
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showDetails(context, invoice),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                      backgroundColor: color.withValues(alpha: .12),
                      child: Icon(Icons.receipt_long, color: color)),
                  const SizedBox(width: 12),
                  Expanded(
                      child: Text('Nota ${invoice.number}',
                          style: const TextStyle(fontWeight: FontWeight.w800))),
                  _DeadlineBadge(days: days, color: color),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                  invoice.client.isEmpty
                      ? 'Cliente não informado'
                      : invoice.client,
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              Text(
                  invoice.destination.isEmpty
                      ? 'Destino não informado'
                      : invoice.destination,
                  style: const TextStyle(color: AppColors.muted)),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.calendar_today_outlined,
                      size: 15, color: AppColors.muted),
                  const SizedBox(width: 6),
                  Text('Coleta: $collectionDate',
                      style: const TextStyle(
                          color: AppColors.muted, fontSize: 12)),
                  const Spacer(),
                  const Icon(Icons.hourglass_empty,
                      size: 15, color: AppColors.warning),
                  const SizedBox(width: 4),
                  const Text('Pendente',
                      style: TextStyle(
                          color: AppColors.warning,
                          fontSize: 12,
                          fontWeight: FontWeight.w700)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDetails(BuildContext context, PendingInvoice invoice) {
    final date = invoice.collectionDate == null
        ? 'Não informada'
        : DateFormat('dd/MM/yyyy').format(invoice.collectionDate!);
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Nota ${invoice.number}',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 18),
              _DetailRow(label: 'Cliente', value: invoice.client),
              _DetailRow(label: 'Destino', value: invoice.destination),
              _DetailRow(label: 'Data da coleta', value: date),
              _DetailRow(
                  label: 'Prazo',
                  value: invoice.daysRemaining == null
                      ? 'Não informado'
                      : '${invoice.daysRemaining} dia(s)'),
              const SizedBox(height: 12),
              const Text(
                  'A finalização da entrega será liberada na tela de Notas.',
                  style: TextStyle(color: AppColors.muted)),
            ],
          ),
        ),
      ),
    );
  }
}

class _DeadlineBadge extends StatelessWidget {
  const _DeadlineBadge({required this.days, required this.color});

  final int? days;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final label = days == null
        ? 'Prazo n/d'
        : days! < 0
            ? '${days!.abs()}d atrasada'
            : '${days}d restantes';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
          color: color.withValues(alpha: .12),
          borderRadius: BorderRadius.circular(20)),
      child: Text(label,
          style: TextStyle(
              color: color, fontWeight: FontWeight.w800, fontSize: 11)),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 120,
              child:
                  Text(label, style: const TextStyle(color: AppColors.muted))),
          Expanded(
              child: Text(value.isEmpty ? 'Não informado' : value,
                  style: const TextStyle(fontWeight: FontWeight.w600))),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(28),
        child: Column(
          children: [
            Icon(Icons.check_circle_outline,
                color: AppColors.success, size: 42),
            SizedBox(height: 8),
            Text('Nenhuma nota pendente no momento.'),
          ],
        ),
      ),
    );
  }
}

class _DashboardError extends StatelessWidget {
  const _DashboardError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Icon(Icons.cloud_off, color: AppColors.danger, size: 42),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Tentar novamente'),
            ),
          ],
        ),
      ),
    );
  }
}
