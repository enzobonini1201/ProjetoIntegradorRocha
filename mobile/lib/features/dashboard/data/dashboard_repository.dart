import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepository(ref.watch(apiClientProvider));
});

final dashboardProvider = FutureProvider.autoDispose<DashboardData>((ref) {
  return ref.watch(dashboardRepositoryProvider).load();
});

class PendingInvoice {
  const PendingInvoice({
    required this.id,
    required this.number,
    required this.client,
    required this.destination,
    this.collectionDate,
    this.daysRemaining,
  });

  final int? id;
  final String number;
  final String client;
  final String destination;
  final DateTime? collectionDate;
  final int? daysRemaining;

  factory PendingInvoice.fromJson(Map<String, dynamic> json) {
    return PendingInvoice(
      id: (json['idNota'] as num?)?.toInt(),
      number: (json['numeroNota'] ?? '').toString(),
      client: (json['clienteNota'] ?? json['nomeCliente'] ?? '').toString(),
      destination: (json['cidadedestNota'] ?? '').toString(),
      collectionDate:
          DateTime.tryParse((json['datacoletaNota'] ?? '').toString()),
      daysRemaining: json['diasRestantes'] is num
          ? (json['diasRestantes'] as num).toInt()
          : null,
    );
  }
}

class DashboardData {
  const DashboardData({
    required this.drivers,
    required this.clients,
    required this.invoices,
    required this.vehicles,
    required this.deliveredInvoices,
    required this.overdueInvoices,
    required this.pending,
  });

  final int drivers;
  final int clients;
  final int invoices;
  final int vehicles;
  final int deliveredInvoices;
  final int overdueInvoices;
  final List<PendingInvoice> pending;
}

class DashboardRepository {
  DashboardRepository(this._client);

  final Dio _client;

  Future<DashboardData> load() async {
    final responses = await Future.wait([
      _client.get<List<dynamic>>('/motoristas'),
      _client.get<List<dynamic>>('/clientes'),
      _client.get<List<dynamic>>('/notas'),
      _client.get<List<dynamic>>('/transportes'),
      _client.get<List<dynamic>>('/notas/pendentes'),
    ]);
    final allInvoices = (responses[2].data ?? const <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .toList(growable: false);
    final pending = (responses[4].data ?? const <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .map(PendingInvoice.fromJson)
        .toList(growable: false);
    final deliveredInvoices = allInvoices
        .where((invoice) => invoice['dataentregaNota'] != null)
        .length;
    final overdueInvoices = pending
        .where((invoice) =>
            invoice.daysRemaining != null && invoice.daysRemaining! < 0)
        .length;
    return DashboardData(
      drivers: responses[0].data?.length ?? 0,
      clients: responses[1].data?.length ?? 0,
      invoices: responses[2].data?.length ?? 0,
      vehicles: responses[3].data?.length ?? 0,
      deliveredInvoices: deliveredInvoices,
      overdueInvoices: overdueInvoices,
      pending: pending,
    );
  }
}
