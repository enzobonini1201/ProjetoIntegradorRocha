import 'package:flutter/material.dart';

class BrandHeader extends StatelessWidget {
  const BrandHeader({super.key, this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/Logo rocha.png',
      width: compact ? 140 : 190,
      height: compact ? 90 : 125,
      fit: BoxFit.contain,
    );
  }
}
