package com.rochatransportes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RochaTransportesApplication {

    public static void main(String[] args) {
        SpringApplication.run(RochaTransportesApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("  SISTEMA ROCHA TRANSPORTES - BACKEND");
        System.out.println("  Backend disponível em: http://localhost:8080");
        System.out.println("  Documentação: http://localhost:8080/swagger-ui.html");
        System.out.println("===========================================\n");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
