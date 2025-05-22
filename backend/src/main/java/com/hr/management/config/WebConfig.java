package com.hr.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 标注为配置类
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 配置跨域映射
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 设置允许跨域的路径
                .allowedOrigins("http://localhost:3000")  // 允许的来源（React应用的URL）
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 允许的HTTP方法
                .allowedHeaders("*") // 允许的请求头
                .allowCredentials(true); // 是否允许发送凭据（如Cookie）
    }
}