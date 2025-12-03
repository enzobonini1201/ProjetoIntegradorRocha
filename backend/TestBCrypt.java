import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String hashDoBanco = "$2a$10$QwJDCYzIn./B3j1SsD1ULewzeEfq/SJo7LlYZtfu155kQplnTbAnS";
        
        // Testar várias senhas possíveis
        String[] senhasTeste = {
            "teste123",
            "Teste123",
            "Teste@123",
            "Marcus123",
            "marcus123",
            "56578710817",
            "565787108",
            "123456",
            "12345678"
        };
        
        System.out.println("Testando senhas contra o hash do banco...\n");
        
        for (String senha : senhasTeste) {
            boolean match = encoder.matches(senha, hashDoBanco);
            System.out.println("Senha '" + senha + "': " + (match ? "✓ CORRETA" : "✗ incorreta"));
        }
        
        // Gerar novo hash
        System.out.println("\n--- Gerando novo hash para 'Teste@123' ---");
        String novoHash = encoder.encode("Teste@123");
        System.out.println("Novo hash: " + novoHash);
        System.out.println("Validação: " + encoder.matches("Teste@123", novoHash));
    }
}
