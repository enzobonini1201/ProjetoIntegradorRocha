# Sistema Rocha Mobile

Primeira fatia funcional do aplicativo Flutter do Sistema Rocha Transportes.

## Escopo atual

- autenticação JWT contra o backend existente;
- armazenamento seguro do token;
- login, cadastro e recuperação de senha;
- shell mobile com bottom navigation e drawer;
- dashboard com totais e notas pendentes;
- configuração da URL da API por `--dart-define`.

## Executar no Android Studio

1. Instale Flutter/Dart e configure o Android SDK.
2. Abra esta pasta no Android Studio.
3. Execute `flutter pub get`.
4. Suba o backend na porta 8080.
5. Rode o app com:

```powershell
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080/api
```

Para um dispositivo físico, use o IP da máquina que executa o backend:

```powershell
flutter run --dart-define=API_BASE_URL=http://SEU_IP:8080/api
```

O backend precisa aceitar requisições do dispositivo e estar acessível na rede local.

## Próximas fatias

- CRUD de motoristas, agregados, ajudantes e clientes;
- transportes, notas e rotas;
- busca, paginação e formulários complexos;
- testes de contrato e integração;
- build Android assinado.
