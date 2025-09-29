package com.DevToolBox.Config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * Creates a singleton Cloudinary client, reading credentials from the CLOUDINARY_URL env var.
 */
@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        // Cloudinary() with no args auto-reads CLOUDINARY_URL from environment.
        // You can override/add options by passing a Map here if needed.
        return new Cloudinary(); 
    }
}
