# Sistema Rocha Mobile

Aplicativo Android Flutter do Sistema Rocha Transportes. O app usa o mesmo backend do sistema web e, atualmente, possui:

- login com CPF e senha;
- cadastro de usuário;
- recuperação de senha;
- armazenamento local da sessão JWT;
- dashboard com totais e notas pendentes;
- navegação inferior entre início, notas e rotas.

## Pré-requisitos

- Flutter instalado e disponível no `PATH`;
- Android Studio com Android SDK e um dispositivo/emulador configurado;
- Java 17 ou superior;
- backend do Sistema Rocha executando na porta `8080`;
- PostgreSQL configurado conforme a documentação da pasta `backend`.

Confirme o ambiente com:

```powershell
flutter doctor
flutter devices
```

## Preparar o projeto

Na raiz do repositório:

```powershell
cd mobile
flutter pub get
```

Em outro terminal, suba o backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

O backend deve estar disponível em `http://localhost:8080`.

## Rodar no emulador Android

O emulador Android acessa a máquina host pelo endereço `10.0.2.2`:

```powershell
cd mobile
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080/api
```

## Rodar em celular físico via USB

Com o celular conectado e a depuração USB autorizada:

```powershell
adb devices
adb reverse tcp:8080 tcp:8080
cd mobile
flutter run --dart-define=API_BASE_URL=http://127.0.0.1:8080/api
```

O `adb reverse` encaminha a porta `8080` do celular para o backend local. Se o comando `adb` não for encontrado, execute-o pela pasta `platform-tools` do Android SDK.

## Rodar em celular pela rede Wi-Fi

Descubra o IP da máquina que executa o backend e use esse IP:

```powershell
flutter run --dart-define=API_BASE_URL=http://SEU_IP_DA_MAQUINA:8080/api
```

Nesse modo, o celular e o computador precisam estar na mesma rede, a porta `8080` precisa estar liberada no firewall e o backend precisa aceitar a origem/rede utilizada.

## Gerar o APK

APK de debug para testes:

```powershell
cd mobile
flutter build apk --debug --android-skip-build-dependency-validation
```

O arquivo será gerado em:

```text
mobile/build/app/outputs/flutter-apk/app-debug.apk
```

Para instalar diretamente no dispositivo conectado:

```powershell
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

## Configuração da API

A URL padrão do app é:

```text
http://127.0.0.1:8080/api
```

Essa configuração funciona no celular físico quando o `adb reverse` está ativo. Para outros ambientes, sempre prefira informar a URL com `--dart-define`:

```powershell
flutter run --dart-define=API_BASE_URL=http://HOST:8080/api
```

## Fluxo de login e cadastro

1. Inicie o PostgreSQL e o backend.
2. Abra o aplicativo.
3. Use **Cadastre-se** para criar um usuário com CPF e senha.
4. Faça login com o CPF e a senha cadastrados.
5. Após o login, o token JWT é salvo localmente e o dashboard é carregado.

A senha deve atender às regras do backend: no mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial.

## Problemas comuns

### `Connection refused` ou falha de comunicação

- confirme que o backend está rodando na porta `8080`;
- em emulador, use `10.0.2.2`, não `localhost`;
- em celular USB, execute novamente `adb reverse tcp:8080 tcp:8080`;
- em Wi-Fi, confirme o IP da máquina e a liberação da porta no firewall.

### Dispositivo não aparece no Flutter

```powershell
adb devices
flutter devices
```

Ative as opções de desenvolvedor e a depuração USB no celular e autorize a chave RSA quando solicitado.

### Limpar e reconstruir

```powershell
cd mobile
flutter clean
flutter pub get
flutter run --dart-define=API_BASE_URL=http://127.0.0.1:8080/api
```
