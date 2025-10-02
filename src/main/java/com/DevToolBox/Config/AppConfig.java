package com.DevToolBox.Config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.context.annotation.*;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import javax.sql.DataSource;
import java.util.Properties;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {
        // scan BOTH variants until you make everything lowercase
        "com.devtoolbox",      // e.g., model, controller, service, dao (lowercase)
        "com.DevToolBox"       // existing config/controller package
})
public class AppConfig {

    // ---------- DataSource (HikariCP) ----------
    @Bean
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();
        // ❗ Move secrets to env vars in real deployments
        ds.setJdbcUrl(getEnv("DB_URL", "jdbc:mysql://localhost:3306/DevTools?useSSL=false&serverTimezone=UTC"));
        ds.setUsername(getEnv("DB_USER", "root"));
        ds.setPassword(getEnv("DB_PASS", "ayush52141")); // <- replace / externalize
        ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
        // optional pool tuning
        ds.setMaximumPoolSize(10);
        ds.setMinimumIdle(2);
        return ds;
    }
    @Bean(name={"tem"})
    public JdbcTemplate jdbcTemplate(DataSource datasoucre){
        return new JdbcTemplate(datasoucre);
    }

    // ---------- JPA: EntityManagerFactory ----------
    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(dataSource);
        // Scan BOTH model packages (until you standardize)
        emf.setPackagesToScan("com.devtoolbox.model", "com.DevToolBox.model");

        HibernateJpaVendorAdapter vendor = new HibernateJpaVendorAdapter();
        vendor.setGenerateDdl(true);
        vendor.setShowSql(true); // dev only
        emf.setJpaVendorAdapter(vendor);

        Properties jpa = new Properties();
        jpa.put("hibernate.hbm2ddl.auto", "update"); // dev only; use 'validate' in prod
        jpa.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        jpa.put("hibernate.format_sql", "true");
        emf.setJpaProperties(jpa);
        return emf;
    }

    // ---------- Transactions ----------
    @Bean
    public JpaTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }

    // Translate JPA exceptions to Spring’s DataAccessException
    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    // ---------- Mail (Jakarta Mail) ----------
    @Bean
    public JavaMailSender mailSender() {
        JavaMailSenderImpl s = new JavaMailSenderImpl();
        s.setHost(getEnv("MAIL_HOST", "smtp.gmail.com"));
        s.setPort(Integer.parseInt(getEnv("MAIL_PORT", "587")));
        s.setUsername(getEnv("MAIL_USER", "your@gmail.com"));
        s.setPassword(getEnv("MAIL_PASS", "app_password"));

        var props = s.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");
        return s;
    }

    // ---------- Multipart (for file upload endpoints) ----------
    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    // ---------- Helpers ----------
    private static String getEnv(String key, String def) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? def : v;
    }
}
