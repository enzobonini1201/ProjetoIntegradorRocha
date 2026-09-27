class User {
  const User({required this.login, required this.name});

  final String login;
  final String name;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      login: (json['login'] ?? '').toString(),
      name: (json['nome'] ?? json['name'] ?? '').toString(),
    );
  }

  Map<String, dynamic> toJson() => {'login': login, 'nome': name};
}
