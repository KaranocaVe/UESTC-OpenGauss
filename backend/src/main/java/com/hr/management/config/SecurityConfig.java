package com.hr.management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * SecurityConfig 配置类，用于定义应用程序的安全配置。
 *
 * <p>此类使用了 Spring Security 提供的注解 @Configuration 和 @EnableWebSecurity，
 * 表示这是一个配置类，并启用了 Web 安全功能。</p>
 *
 * <p>主要功能包括：
 * <ul>
 *   <li>禁用 CSRF 和 CORS 功能。</li>
 *   <li>定义请求的授权规则：
 *       <ul>
 *         <li>允许所有访问路径为 "/api/auth/**" 的请求。</li>
 *         <li>允许所有访问路径为 "/api/**" 的请求。</li>
 *         <li>对其他所有请求进行认证。</li>
 *       </ul>
 *   </li>
 * </ul>
 * </p>
 *
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated());

        return http.build();
    }
}